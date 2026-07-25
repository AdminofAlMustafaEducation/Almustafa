import { z } from "zod";

export const applicationSchema = z.object({
  student_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(11, "Phone number must be 11 digits"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  class_level: z.coerce.number().min(9).max(12),
  program: z.enum(["matric", "fsc_pre_medical", "fsc_pre_engineering"]),
  campus: z.enum(["main", "second"]),
  previous_school: z.string().optional(),
  previous_marks: z.string().optional(),
  parent_name: z.string().min(2, "Parent name is required"),
  parent_phone: z.string().min(11, "Parent phone is required"),
  parent_cnic: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
