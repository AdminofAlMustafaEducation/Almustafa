import { createClient } from "@supabase/supabase-js";

type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: Record<string, unknown>): void;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

function json(res: ApiResponse, status: number, body: Record<string, unknown>) {
  res.status(status).json(body);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return json(res, 503, { error: "Account provisioning service is not configured" });
  }

  const rawAuthorization = req.headers.authorization;
  const authorization = Array.isArray(rawAuthorization) ? rawAuthorization[0] : rawAuthorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token) return json(res, 401, { error: "Authentication required" });

  const body =
    typeof req.body === "object" && req.body !== null ? (req.body as Record<string, unknown>) : {};
  const applicationId = typeof body.applicationId === "string" ? body.applicationId.trim() : "";
  if (!/^[0-9a-f-]{36}$/i.test(applicationId)) {
    return json(res, 400, { error: "Invalid application ID" });
  }

  const admin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return json(res, 401, { error: "Invalid authentication" });

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, is_active")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin" || profile.is_active !== true) {
    return json(res, 403, { error: "Administrator access required" });
  }

  const { data: application, error: applicationError } = await admin
    .from("applications")
    .select("email, full_name")
    .eq("id", applicationId)
    .maybeSingle();

  if (applicationError) return json(res, 502, { error: "Unable to read application" });
  if (!application?.email?.trim())
    return json(res, 422, { error: "Application has no valid email address" });

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    application.email.trim(),
    { data: { full_name: application.full_name, role: "student" } },
  );

  if (inviteError || !invited.user) {
    return json(res, 409, { error: "Unable to provision the student account" });
  }

  const { data: result, error: approvalError } = await admin.rpc("approve_and_create_account", {
    app_id: applicationId,
    reviewer_id: authData.user.id,
    student_auth_user_id: invited.user.id,
  });

  if (approvalError) {
    await admin.auth.admin.deleteUser(invited.user.id);
    return json(res, 409, { error: "Unable to approve application" });
  }

  return json(res, 200, { result });
}
