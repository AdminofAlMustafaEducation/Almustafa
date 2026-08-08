export type ChatAgent = {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  whatsappNumber: string;
  isActive: boolean;
  sortOrder: number;
};

export const chatAgents: ChatAgent[] = [
  {
    id: "1",
    name: "Al-Mustafa Academy",
    role: "Admissions",
    photoUrl: "/brand/almustafa-logo.jpg",
    whatsappNumber: "+923350555696",
    isActive: true,
    sortOrder: 1,
  },
];
