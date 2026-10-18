import {
  Ambulance,
  Droplets,
  Flame,
  Footprints,
  Headset,
  HeartHandshake,
  LifeBuoy,
  Music,
  PenLine,
  PersonStanding,
  Phone,
  Shield,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";

export const MOODS = [
  { value: 5, emoji: "😄", label: "ótimo" },
  { value: 4, emoji: "🙂", label: "bem" },
  { value: 3, emoji: "😐", label: "ok" },
  { value: 2, emoji: "🙁", label: "baixo" },
  { value: 1, emoji: "😢", label: "difícil" },
] as const;

export type MoodValue = (typeof MOODS)[number]["value"];

export function moodByValue(value: number | null | undefined) {
  return MOODS.find((mood) => mood.value === value) ?? null;
}

export type Period = "manha" | "tarde" | "noite";

export const PERIODS: { id: Period; label: string }[] = [
  { id: "manha", label: "Manhã" },
  { id: "tarde", label: "Tarde" },
  { id: "noite", label: "Noite" },
];

export type Activity = {
  id: string;
  title: string;
  detail: string;
  minutes: number;
  icon: LucideIcon;
};

export const ACTIVITIES: Activity[] = [
  { id: "respira", title: "Respirar devagar", detail: "Inspire em 4, solte em 6", minutes: 2, icon: Wind },
  { id: "agua", title: "Beber água", detail: "Um copo, sem pressa", minutes: 1, icon: Droplets },
  { id: "volta", title: "Dar uma volta", detail: "Dez minutos, fora ou em casa", minutes: 10, icon: Footprints },
  { id: "alongar", title: "Alongar", detail: "Ombros, pescoço e costas", minutes: 5, icon: PersonStanding },
  { id: "escrever", title: "Escrever três linhas", detail: "O que está na cabeça agora", minutes: 5, icon: PenLine },
  { id: "musica", title: "Ouvir uma música", detail: "Uma que você já gosta", minutes: 4, icon: Music },
  { id: "luz", title: "Ver a luz do dia", detail: "Perto da janela já vale", minutes: 5, icon: Sun },
  { id: "falar", title: "Falar com alguém", detail: "Uma pessoa que te faz bem", minutes: 10, icon: Phone },
];

export type RoutineItem = {
  id: string;
  title: string;
  period: Period;
};

export const DEFAULT_ROUTINE: RoutineItem[] = [
  { id: "janela", title: "Abrir a janela", period: "manha" },
  { id: "cafe", title: "Tomar café", period: "manha" },
  { id: "cama", title: "Arrumar a cama", period: "manha" },
  { id: "almoco", title: "Almoçar", period: "tarde" },
  { id: "pausa", title: "Pausa longe da tela", period: "tarde" },
  { id: "agua-tarde", title: "Beber água", period: "tarde" },
  { id: "jantar", title: "Jantar", period: "noite" },
  { id: "banho", title: "Tomar banho", period: "noite" },
  { id: "dormir", title: "Ir para a cama", period: "noite" },
];

export type Service = {
  id: string;
  name: string;
  detail: string;
  number: string;
  tel: string;
  icon: LucideIcon;
};

export const SERVICES: Service[] = [
  {
    id: "samu",
    name: "SAMU",
    detail: "Urgência médica",
    number: "192",
    tel: "192",
    icon: Ambulance,
  },
  {
    id: "bombeiros",
    name: "Bombeiros",
    detail: "Incêndio, resgate e acidente",
    number: "193",
    tel: "193",
    icon: Flame,
  },
  {
    id: "policia",
    name: "Polícia Militar",
    detail: "Quando há risco ou violência",
    number: "190",
    tel: "190",
    icon: Shield,
  },
  {
    id: "cvv",
    name: "CVV",
    detail: "Apoio emocional, 24 horas, de graça e em sigilo",
    number: "188",
    tel: "188",
    icon: HeartHandshake,
  },
  {
    id: "mulher",
    name: "Central da Mulher",
    detail: "Violência contra a mulher",
    number: "180",
    tel: "180",
    icon: LifeBuoy,
  },
  {
    id: "humanos",
    name: "Direitos Humanos",
    detail: "Denúncia e orientação",
    number: "100",
    tel: "100",
    icon: Headset,
  },
];
