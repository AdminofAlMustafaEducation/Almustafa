-- 026_harden_storage_policies.sql
-- Phase 5: private academic storage and explicit gallery object boundaries.
-- Apply after migrations 022-025 in a disposable environment first.

-- Keep the role check independent of JWT metadata and safe for SECURITY DEFINER use.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Academic note files are private. Gallery assets remain public by design because they
-- are public-site content, but writes are restricted to active administrators.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('notes', 'notes', false),
  ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Authenticated users can read permitted note files" ON storage.objects;
CREATE POLICY "Authenticated users can read permitted note files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'notes'
    AND EXISTS (
      SELECT 1
      FROM public.notes n
      WHERE replace(ltrim(coalesce(n.file_path, ''), '/'), 'notes/', '') = name
        AND (
          public.is_admin()
          OR EXISTS (
            SELECT 1
            FROM public.teachers t
            WHERE t.id = n.teacher_id
              AND t.auth_user_id = auth.uid()
          )
          OR (
            n.is_published = true
            AND EXISTS (
              SELECT 1
              FROM public.class_students cs
              JOIN public.students s ON s.id = cs.student_id
              WHERE cs.class_id = n.class_id
                AND s.auth_user_id = auth.uid()
            )
          )
          OR (
            n.is_published = true
            AND EXISTS (
              SELECT 1
              FROM public.class_students cs
              JOIN public.student_guardians sg ON sg.student_id = cs.student_id
              JOIN public.guardians g ON g.id = sg.guardian_id
              WHERE cs.class_id = n.class_id
                AND g.auth_user_id = auth.uid()
            )
          )
        )
    )
  );

DROP POLICY IF EXISTS "Teachers and admins can upload note files" ON storage.objects;
CREATE POLICY "Teachers and admins can upload note files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'notes'
    AND EXISTS (
      SELECT 1
      FROM public.notes n
      WHERE replace(ltrim(coalesce(n.file_path, ''), '/'), 'notes/', '') = name
        AND (
          public.is_admin()
          OR EXISTS (
            SELECT 1
            FROM public.teachers t
            WHERE t.id = n.teacher_id
              AND t.auth_user_id = auth.uid()
          )
        )
    )
  );

DROP POLICY IF EXISTS "Teachers and admins can update note files" ON storage.objects;
CREATE POLICY "Teachers and admins can update note files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'notes'
    AND EXISTS (
      SELECT 1
      FROM public.notes n
      WHERE replace(ltrim(coalesce(n.file_path, ''), '/'), 'notes/', '') = name
        AND (
          public.is_admin()
          OR EXISTS (
            SELECT 1
            FROM public.teachers t
            WHERE t.id = n.teacher_id
              AND t.auth_user_id = auth.uid()
          )
        )
    )
  )
  WITH CHECK (bucket_id = 'notes');

DROP POLICY IF EXISTS "Teachers and admins can delete note files" ON storage.objects;
CREATE POLICY "Teachers and admins can delete note files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'notes'
    AND EXISTS (
      SELECT 1
      FROM public.notes n
      WHERE replace(ltrim(coalesce(n.file_path, ''), '/'), 'notes/', '') = name
        AND (
          public.is_admin()
          OR EXISTS (
            SELECT 1
            FROM public.teachers t
            WHERE t.id = n.teacher_id
              AND t.auth_user_id = auth.uid()
          )
        )
    )
  );

DROP POLICY IF EXISTS "Public can read gallery objects" ON storage.objects;
CREATE POLICY "Public can read gallery objects"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can manage gallery objects" ON storage.objects;
CREATE POLICY "Admins can manage gallery objects"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin())
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin());
