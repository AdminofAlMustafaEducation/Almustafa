import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, GraduationCap, Loader2, User, Users } from "lucide-react";
import { applicationSchema, type ApplicationFormData } from "@/data/schema";
import { useCreateApplication } from "@/hooks/use-admissions";
import { GRADES } from "@/lib/academy";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS = [
  { label: "Personal Info", icon: User },
  { label: "Academic Info", icon: GraduationCap },
  { label: "Parent Info", icon: Users },
  { label: "Review", icon: Check },
] as const;

export function ApplicationWizard() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const createApp = useCreateApplication();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      full_name: "",
      father_name: "",
      phone: "",
      id_number: "",
      gender: "male",
      grade: "9th",
      date_of_birth: "",
      address: "",
      previous_school: "",
      guardian_occupation: "",
      message: "",
      student_name: "",
      email: "",
      class_level: 9,
      program: "matric",
      campus: "main",
      previous_marks: "",
      parent_name: "",
      parent_phone: "",
      parent_cnic: "",
    },
  });

  const { register, handleSubmit, formState, trigger, watch, setValue } = form;
  const values = watch();

  const stepFields: (keyof ApplicationFormData)[][] = [
    ["full_name", "phone", "id_number", "date_of_birth", "address"],
    ["grade", "gender"],
    ["parent_name", "parent_phone"],
    [],
  ];

  async function handleNext() {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleEdit(targetStep: number) {
    setStep(targetStep);
  }

  async function onSubmit(data: ApplicationFormData) {
    try {
      const result = await createApp.mutateAsync(data);
      setApplicationNumber(result.application_number);
      setSubmitted(true);
      setStep(STEPS.length);
    } catch {
      // handled by mutation state
    }
  }

  if (submitted) {
    return (
      <Card className="border-gold/20">
        <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gold/10">
            <Check className="h-10 w-10 text-gold" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-black text-navy-deep sm:text-3xl">
            Application Submitted!
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Your application has been received. Please note your application number for tracking purposes.
          </p>
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 px-8 py-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Application Number</p>
            <p className="mt-1 font-display text-2xl font-black tracking-wider text-navy-deep sm:text-3xl">
              {applicationNumber}
            </p>
          </div>
          <p className="mt-6 max-w-sm text-xs text-muted-foreground">
            You can track your application status anytime using this number on the{" "}
            <a href="/track" className="font-semibold text-navy underline underline-offset-2">Track Application</a> page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map(({ label, icon: Icon }, i) => {
            const isActive = i === step;
            const isComplete = i < step;
            return (
              <div key={label} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div className={cn("h-0.5 flex-1 transition-colors", isComplete ? "bg-gold" : "bg-border")} />
                  )}
                  <button
                    type="button"
                    onClick={() => isComplete && handleEdit(i)}
                    className={cn(
                      "relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all sm:h-12 sm:w-12",
                      isComplete
                        ? "cursor-pointer border-gold bg-gold text-navy-deep"
                        : isActive
                          ? "border-navy-deep bg-navy-deep text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={cn("h-0.5 flex-1 transition-colors", isComplete ? "bg-gold" : "bg-border")} />
                  )}
                </div>
                <span className={cn("mt-2 hidden text-[11px] font-semibold uppercase tracking-wider sm:block", isActive ? "text-navy-deep" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-center sm:hidden">
          <span className="text-sm font-semibold text-navy-deep">
            Step {step + 1} of {STEPS.length}: {STEPS[step].label}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-gold/20">
          <CardContent className="px-6 py-8 sm:px-8 sm:py-10">
            {/* Step 1 — Personal Info */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">Personal Information</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Tell us about the student.</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" placeholder="e.g. Ahmed Khan" {...register("full_name")} />
                    {formState.errors.full_name && <p className="text-xs text-destructive">{formState.errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="father_name">Father / Guardian Name</Label>
                    <Input id="father_name" placeholder="e.g. Muhammad Khan" {...register("father_name")} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp *</Label>
                    <Input id="phone" type="tel" inputMode="tel" placeholder="03XX XXXXXXX" {...register("phone")} />
                    {formState.errors.phone && <p className="text-xs text-destructive">{formState.errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id_number">B-Form / ID Number *</Label>
                    <Input id="id_number" placeholder="Child registration / CNIC number" {...register("id_number")} />
                    {formState.errors.id_number && <p className="text-xs text-destructive">{formState.errors.id_number.message}</p>}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Textarea id="address" placeholder="House#, Street, Area, City" rows={2} {...register("address")} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Academic Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">Academic Information</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Select the class and gender.</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Class Applying For *</Label>
                    <Select value={values.grade} onValueChange={(v) => setValue("grade", v as ApplicationFormData["grade"])}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {GRADES.map((grade) => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select value={values.gender} onValueChange={(v) => setValue("gender", v as ApplicationFormData["gender"])}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="previous_school">Previous School (optional)</Label>
                    <Input id="previous_school" placeholder="e.g. Roots Millennium" {...register("previous_school")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardian_occupation">Guardian Occupation (optional)</Label>
                    <Input id="guardian_occupation" placeholder="e.g. Business, Government Job" {...register("guardian_occupation")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message / Notes (optional)</Label>
                  <Textarea id="message" placeholder="Anything you'd like us to know..." rows={3} {...register("message")} />
                </div>
              </div>
            )}

            {/* Step 3 — Parent Info */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">Parent / Guardian Information</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Contact details of the student&apos;s parent or guardian.</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">Parent / Guardian Name *</Label>
                    <Input id="parent_name" placeholder="e.g. Muhammad Khan" {...register("parent_name")} />
                    {formState.errors.parent_name && <p className="text-xs text-destructive">{formState.errors.parent_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent_phone">Parent Phone *</Label>
                    <Input id="parent_phone" type="tel" inputMode="tel" placeholder="03XX XXXXXXX" {...register("parent_phone")} />
                    {formState.errors.parent_phone && <p className="text-xs text-destructive">{formState.errors.parent_phone.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent_cnic">Parent CNIC (optional)</Label>
                  <Input id="parent_cnic" placeholder="XXXXX-XXXXXXX-X" {...register("parent_cnic")} />
                </div>
              </div>
            )}

            {/* Step 4 — Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">Review Your Application</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Please verify all details before submitting.</p>
                </div>
                <ReviewSection
                  title="Personal Information"
                  onEdit={() => handleEdit(0)}
                  rows={[
                    { label: "Full Name", value: values.full_name },
                    { label: "Father Name", value: values.father_name || "—" },
                    { label: "Phone", value: values.phone },
                    { label: "B-Form/ID", value: values.id_number },
                    { label: "Date of Birth", value: values.date_of_birth || "—" },
                    { label: "Address", value: values.address || "—" },
                  ]}
                />
                <ReviewSection
                  title="Academic Information"
                  onEdit={() => handleEdit(1)}
                  rows={[
                    { label: "Class", value: values.grade },
                    { label: "Gender", value: values.gender === "male" ? "Male" : "Female" },
                    { label: "Previous School", value: values.previous_school || "—" },
                    { label: "Guardian Occupation", value: values.guardian_occupation || "—" },
                  ]}
                />
                <ReviewSection
                  title="Parent / Guardian"
                  onEdit={() => handleEdit(2)}
                  rows={[
                    { label: "Name", value: values.parent_name },
                    { label: "Phone", value: values.parent_phone },
                    { label: "CNIC", value: values.parent_cnic || "—" },
                  ]}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={createApp.isPending} className="min-w-[140px]">
              {createApp.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
              ) : (
                "Submit Application"
              )}
            </Button>
          )}
        </div>

        {createApp.isError && (
          <p className="mt-4 text-center text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit: () => void;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h4 className="text-sm font-bold text-navy-deep">{title}</h4>
        <button type="button" onClick={onEdit} className="text-xs font-semibold text-navy underline underline-offset-2 hover:text-navy-deep">
          Edit
        </button>
      </div>
      <dl className="divide-y divide-border">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-4 px-5 py-3">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
            <dd className="text-right text-sm font-medium text-navy-deep">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
