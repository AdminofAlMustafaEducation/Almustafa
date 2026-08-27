import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://www.almustafaeducationsystem.com",
  "https://almustafaeducationsystem.com",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin":
      origin && allowedOrigins.has(origin) ? origin : "https://www.almustafaeducationsystem.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

type ApprovalRequest = {
  applicationId?: unknown;
};

function response(request: Request, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

function getSecretKey() {
  const legacyKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyKey) return legacyKey;

  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!secretKeys) return "";

  try {
    const parsed = JSON.parse(secretKeys) as Record<string, string>;
    return parsed.default || "";
  } catch {
    return "";
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return response(request, 405, { error: "Method not allowed" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = getSecretKey();
  if (!supabaseUrl || !serviceKey) {
    return response(request, 503, {
      error: "Supabase Edge Function server credentials are not configured",
    });
  }

  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
  if (!accessToken) return response(request, 401, { error: "Authentication required" });

  let body: ApprovalRequest;
  try {
    body = (await request.json()) as ApprovalRequest;
  } catch {
    return response(request, 400, { error: "Invalid JSON body" });
  }

  const applicationId = typeof body.applicationId === "string" ? body.applicationId.trim() : "";
  if (!/^[0-9a-f-]{36}$/i.test(applicationId)) {
    return response(request, 400, { error: "Invalid application ID" });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authData, error: authError } = await admin.auth.getUser(accessToken);
  if (authError || !authData.user)
    return response(request, 401, { error: "Invalid authentication" });

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, is_active")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();
  if (profileError || profile?.role !== "admin" || profile.is_active !== true) {
    return response(request, 403, { error: "Administrator access required" });
  }

  const { data: application, error: applicationError } = await admin
    .from("applications")
    .select("email, full_name")
    .eq("id", applicationId)
    .maybeSingle();
  if (applicationError) return response(request, 502, { error: "Unable to read application" });
  if (!application?.email?.trim()) {
    return response(request, 422, { error: "Application has no valid email address" });
  }

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    application.email.trim(),
    { data: { full_name: application.full_name, role: "student" } },
  );
  if (inviteError || !invited.user) {
    return response(request, 409, { error: "Unable to provision the student account" });
  }

  const { data: result, error: approvalError } = await admin.rpc("approve_and_create_account", {
    app_id: applicationId,
    reviewer_id: authData.user.id,
    student_auth_user_id: invited.user.id,
  });
  if (approvalError) {
    await admin.auth.admin.deleteUser(invited.user.id);
    return response(request, 409, {
      error: approvalError.message || "Unable to approve application",
    });
  }

  return response(request, 200, { result });
});
