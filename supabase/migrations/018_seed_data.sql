-- 018_seed_data.sql
-- Seed initial data for grades, subjects, and classes

-- Seed subjects
INSERT INTO subjects (name, code, category, sort_order) VALUES
  ('Science', 'SCI', 'general', 1),
  ('Urdu', 'URD', 'language', 2),
  ('English', 'ENG', 'language', 3),
  ('Islamiat', 'ISL', 'religious', 4),
  ('Pakistan Studies', 'PST', 'social', 5),
  ('Computer', 'COM', 'technical', 6),
  ('Biology', 'BIO', 'science', 7),
  ('Physics', 'PHY', 'science', 8),
  ('Chemistry', 'CHE', 'science', 9),
  ('Mathematics', 'MAT', 'science', 10),
  ('Accounting', 'ACC', 'commerce', 11),
  ('Statistics', 'STA', 'commerce', 12),
  ('Economics', 'ECO', 'commerce', 13)
ON CONFLICT (code) DO NOTHING;

-- Seed classes for 2026
INSERT INTO classes (name, grade, section, academic_year, capacity) VALUES
  ('Class 6 - A', '6th', 'A', '2026', 30),
  ('Class 7 - A', '7th', 'A', '2026', 30),
  ('Class 8 - A', '8th', 'A', '2026', 30),
  ('Class 9 - A', '9th', 'A', '2026', 30),
  ('Class 9 - B', '9th', 'B', '2026', 30),
  ('Class 10 - A', '10th', 'A', '2026', 30),
  ('Class 10 - B', '10th', 'B', '2026', 30),
  ('FSc Pre-Eng 1st Year', 'FSc Pre-Engineering', 'A', '2026', 25),
  ('FSc Pre-Eng 2nd Year', 'FSc Pre-Engineering', 'B', '2026', 25),
  ('FSc Pre-Med 1st Year', 'FSc Pre-Medical', 'A', '2026', 25),
  ('FSc Pre-Med 2nd Year', 'FSc Pre-Medical', 'B', '2026', 25),
  ('ICS', 'ICS', 'A', '2026', 25),
  ('I.Com', 'I.Com', 'A', '2026', 25)
ON CONFLICT DO NOTHING;

-- Seed initial notifications
INSERT INTO notifications (title, message, date, is_read, is_active, sort_order) VALUES
  ('Juniors Admissions Open (Class 1-8)', 'Admissions are now open for Junior classes (1-8). Build strong foundations with experienced teachers and small batches.', CURRENT_DATE, false, true, 1),
  ('Matric Admissions Open (9th & 10th)', 'Registration is open for Matric 9th and 10th classes. FBISE-aligned coaching, weekly tests and concept-based preparation.', CURRENT_DATE, false, true, 2),
  ('Intermediate Admissions Open (11th & 12th)', 'F.Sc Pre-Medical and Pre-Engineering admissions for 1st Year and 2nd Year are now open.', CURRENT_DATE, false, true, 3),
  ('Evening Batches Starting Soon', 'All evening batches for Juniors, Matric and F.Sc are starting soon. Classes run Monday to Saturday, 3:00 PM to 9:00 PM.', CURRENT_DATE, false, true, 4)
ON CONFLICT DO NOTHING;

-- Seed chat agent
INSERT INTO chat_agents (name, role, photo_url, whatsapp_number, is_active, sort_order) VALUES
  ('Al-Mustafa Academy', 'Admissions', '/brand/almustafa-logo.jpg', '+923350555696', true, 1)
ON CONFLICT DO NOTHING;

-- Seed website content defaults
INSERT INTO website_content (key, value, published) VALUES
  ('hero', '{"title":"Premier Evening Coaching Academy","subtitle":"Trusted since 1998 in Islamabad","cta":"Apply for Admission"}', true),
  ('about', '{"title":"About Al-Mustafa Academy","description":"Quality evening coaching for Juniors, Matric and F.Sc students.","mission":"To provide structured, concept-driven evening coaching.","vision":"Islamabad''s most trusted academy."}', true),
  ('contact', '{"phone":"0335 0555696","email":"almustafaschool@gmail.com","addressPrimary":"House# 1460 Sachal Sarmast Road, G-11/2, Islamabad","addressSecondary":"House 417, Sawan Road, G-10/4, Islamabad"}', true),
  ('social', '{"facebook":"https://www.facebook.com/Almustafa614","youtube":"https://youtube.com/@almustafa1292"}', true)
ON CONFLICT (key) DO NOTHING;
