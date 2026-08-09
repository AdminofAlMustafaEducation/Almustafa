import { z } from "zod";
import { GRADES } from "@/lib/academy";

// Application form schema (for public admission form)
export const applicationSchema = z.object({
  full_name: z.string().min(2, "Student name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
  father_name: z.string().optional(),
  phone: z.string().min(11, "Phone number must be 11 digits"),
  id_number: z.string().min(1, "B-Form/ID number is required"),
  gender: z.enum(["male", "female"]),
  grade: z.enum(GRADES as [string, ...string[]]),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  previous_school: z.string().optional(),
  guardian_occupation: z.string().optional(),
  message: z.string().optional(),
  // Legacy fields (backward compatibility)
  student_name: z.string().optional(),
  class_level: z.coerce.number().optional(),
  program: z.string().optional(),
  campus: z.string().optional(),
  previous_marks: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  parent_cnic: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Student form schema (for admin)
export const studentFormSchema = z.object({
  full_name: z.string().min(2, "Student name is required"),
  father_name: z.string().optional(),
  phone: z.string().optional(),
  id_number: z.string().optional(),
  gender: z.enum(["male", "female"]).default("male"),
  grade: z.enum(GRADES as [string, ...string[]]),
  roll_number: z.string().optional(),
  address: z.string().optional(),
  admission_date: z.string().optional(),
  monthly_fee: z.coerce.number().min(0).optional(),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  parent_name: z.string().min(2, "Parent/Guardian name is required"),
  parent_phone: z.string().min(11, "Parent phone is required"),
  parent_cnic: z.string().optional(),
  // Legacy fields
  name: z.string().optional(),
  date_of_birth: z.string().optional(),
  class_level: z.coerce.number().optional(),
  program: z.string().optional(),
  campus: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
