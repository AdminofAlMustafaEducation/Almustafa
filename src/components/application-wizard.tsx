import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, GraduationCap, Loader2, User, Users } from "lucide-react";
import { applicationSchema, type ApplicationFormData } from "@/data/schema";
import { useCreateApplication } from "@/hooks/use-admissions";
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

const PROGRAM_LABELS: Record<string, string> = {
  matric: "Matric (9th & 10th)",
  fsc_pre_medical: "F.Sc Pre-Medical",
  fsc_pre_engineering: "F.Sc Pre-Engineering",
};

const CAMPUS_LABELS: Record<string, string> = {
  main: "Main Campus — House# 1461, G-11/2",
  second: "Second Campus — House# 1300, G-11/2",
};

const CLASS_OPTIONS = [
  { value: 9, label: "Class 9th" },
  { value: 10, label: "Class 10th" },
  { value: 11, label: "Class 11th (1st Year)" },
  { value: 12, label: "Class 12th (2nd Year)" },
];

export function ApplicationWizard() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const createApp = useCreateApplication();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      student_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
      class_level: 9,
      program: "matric",
      campus: "main",
      previous_school: "",
      previous_marks: "",
      parent_name: "",
      parent_phone: "",
      parent_cnic: "",
    },
  });

  const { register, handleSubmit, formState, trigger, watch, setValue } = form;
  const values = watch();

  const stepFields: (keyof ApplicationFormData)[][] = [
    ["student_name", "email", "phone", "date_of_birth", "address"],
    ["class_level", "program", "campus"],
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
      /* handled by mutation state */
    }
  }

  // Confirmation step
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
            Your application has been received. Please note your application number for
            tracking purposes.
          </p>
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 px-8 py-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Application Number
            </p>
            <p className="mt-1 font-display text-2xl font-black tracking-wider text-navy-deep sm:text-3xl">
              {applicationNumber}
            </p>
          </div>
          <p className="mt-6 max-w-sm text-xs text-muted-foreground">
            You can track your application status anytime using this number on the{" "}
            <a href="/track" className="font-semibold text-navy underline underline-offset-2">
              Track Application
            </a>{" "}
            page.
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
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors",
                        isComplete ? "bg-gold" : "bg-border",
                      )}
                    />
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
                          : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors",
                        isComplete ? "bg-gold" : "bg-border",
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 hidden text-[11px] font-semibold uppercase tracking-wider sm:block",
                    isActive ? "text-navy-deep" : "text-muted-foreground",
                  )}
                >
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
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us about the student.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="student_name">Full Name *</Label>
                    <Input
                      id="student_name"
                      placeholder="e.g. Ahmed Khan"
                      {...register("student_name")}
                    />
                    {formState.errors.student_name && (
                      <p className="text-xs text-destructive">
                        {formState.errors.student_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. ahmed@email.com"
                      {...register("email")}
                    />
                    {formState.errors.email && (
                      <p className="text-xs text-destructive">{formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="03XX XXXXXXX"
                      {...register("phone")}
                    />
                    {formState.errors.phone && (
                      <p className="text-xs text-destructive">{formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      {...register("date_of_birth")}
                    />
                    {formState.errors.date_of_birth && (
                      <p className="text-xs text-destructive">
                        {formState.errors.date_of_birth.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Home Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="House#, Street, Area, City"
                    rows={3}
                    {...register("address")}
                  />
                  {formState.errors.address && (
                    <p className="text-xs text-destructive">{formState.errors.address.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 — Academic Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">
                    Academic Information
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select the class, program and campus.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Class Level *</Label>
                    <Select
                      value={String(values.class_level)}
                      onValueChange={(v) => setValue("class_level", Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Program *</Label>
                    <Select
                      value={values.program}
                      onValueChange={(v) =>
                        setValue("program", v as ApplicationFormData["program"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matric">Matric (9th & 10th)</SelectItem>
                        <SelectItem value="fsc_pre_medical">F.Sc Pre-Medical</SelectItem>
                        <SelectItem value="fsc_pre_engineering">F.Sc Pre-Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Campus *</Label>
                  <Select
                    value={values.campus}
                    onValueChange={(v) =>
                      setValue("campus", v as ApplicationFormData["campus"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Campus — House# 1461, G-11/2</SelectItem>
                      <SelectItem value="second">Second Campus — House# 1300, G-11/2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="previous_school">Previous School (optional)</Label>
                    <Input
                      id="previous_school"
                      placeholder="e.g. Roots Millennium"
                      {...register("previous_school")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previous_marks">Previous Marks / Percentage (optional)</Label>
                    <Input
                      id="previous_marks"
                      placeholder="e.g. 85%"
                      {...register("previous_marks")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Parent Info */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">
                    Parent / Guardian Information
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Contact details of the student&apos;s parent or guardian.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">Parent / Guardian Name *</Label>
                    <Input
                      id="parent_name"
                      placeholder="e.g. Muhammad Khan"
                      {...register("parent_name")}
                    />
                    {formState.errors.parent_name && (
                      <p className="text-xs text-destructive">
                        {formState.errors.parent_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent_phone">Parent Phone *</Label>
                    <Input
                      id="parent_phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="03XX XXXXXXX"
                      {...register("parent_phone")}
                    />
                    {formState.errors.parent_phone && (
                      <p className="text-xs text-destructive">
                        {formState.errors.parent_phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent_cnic">Parent CNIC (optional)</Label>
                  <Input
                    id="parent_cnic"
                    placeholder="XXXXX-XXXXXXX-X"
                    {...register("parent_cnic")}
                  />
                </div>
              </div>
            )}

            {/* Step 4 — Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-black text-navy-deep sm:text-2xl">
                    Review Your Application
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Please verify all details before submitting.
                  </p>
                </div>

                <ReviewSection
                  title="Personal Information"
                  onEdit={() => handleEdit(0)}
                  rows={[
                    { label: "Full Name", value: values.student_name },
                    { label: "Email", value: values.email },
                    { label: "Phone", value: values.phone },
                    { label: "Date of Birth", value: values.date_of_birth },
                    { label: "Address", value: values.address },
                  ]}
                />

                <ReviewSection
                  title="Academic Information"
                  onEdit={() => handleEdit(1)}
                  rows={[
                    {
                      label: "Class",
                      value: CLASS_OPTIONS.find((o) => o.value === values.class_level)?.label ?? "",
                    },
                    { label: "Program", value: PROGRAM_LABELS[values.program] ?? "" },
                    { label: "Campus", value: CAMPUS_LABELS[values.campus] ?? "" },
                    { label: "Previous School", value: values.previous_school || "—" },
                    { label: "Previous Marks", value: values.previous_marks || "—" },
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
            <Button
              type="submit"
              disabled={createApp.isPending}
              className="min-w-[140px]"
            >
              {createApp.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                </>
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
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-navy underline underline-offset-2 hover:text-navy-deep"
        >
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
