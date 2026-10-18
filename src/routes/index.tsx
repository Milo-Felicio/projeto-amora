import { createFileRoute, Link } from "@tanstack/react-router";
import { ChartColumn, ListChecks, Phone, SunMedium } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Wordmark } from "@/components/amora/chrome";
import { MOODS } from "@/lib/amora/data";
import { useAmora } from "@/lib/amora/store";

export const Route = createFileRoute("/")({ component: Home });

const BALLOONS: {
  to: "/atividades" | "/rotina" | "/estatisticas" | "/emergencia";
  title: string;
  hint: string;
  icon: LucideIcon;
  urgent?: boolean;
}[] = [
  {
    to: "/atividades",
    title: "Atividades",
    hint: "Coisas leves para hoje",
    icon: SunMedium,
  },
  {
    to: "/rotina",
    title: "Rotina",
    hint: "O ritmo do seu dia",
    icon: ListChecks,
  },
  {
    to: "/estatisticas",
    title: "Estatísticas",
    hint: "Como os dias têm sido",
    icon: ChartColumn,
  },
  {
    to: "/emergencia",
    title: "Ligar para serviços de emergência",
    hint: "Números que atendem agora",
    icon: Phone,
    urgent: true,
  },
];

function Home() {
  const { mood, setMood } = useAmora();
  const current = MOODS.find((item) => item.value === mood) ?? null;
  const todayLabel = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="shell">
      <Wordmark />
      <section className="mood-band">
        <div className="column px-4 py-6">
          <p className="text-center text-sm font-extrabold text-muted" suppressHydrationWarning>
            {todayLabel}
          </p>
          <h1 className="mt-2 text-center text-2xl font-extrabold leading-tight">
            como você está se sentindo hoje?
          </h1>
          <div className="mood-row" role="radiogroup" aria-label="como você está se sentindo hoje?">
            {MOODS.map((item) => {
              const selected = mood === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className="mood-btn"
                  onClick={() => setMood(item.value)}
                >
                  <span className="mood-face" aria-hidden="true">
                    {item.emoji}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className={`mt-4 min-h-6 text-center text-sm font-extrabold ${current ? "text-berry" : "text-muted"}`} aria-live="polite">
            {current ? `anotado para hoje: ${current.label}` : "escolha um rosto, do mais feliz ao mais difícil"}
          </p>
        </div>
      </section>
      <section className="column px-4 py-6">
        <div className="balloon-list">
          {BALLOONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="balloon rise"
              >
                <span className={item.urgent ? "chip chip-solid" : "chip"}>
                  <Icon className="size-5" strokeWidth={2.3} />
                </span>
                <span className="min-w-0">
                  <span className="balloon-title">{item.title}</span>
                  <span className="balloon-hint">{item.hint}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm font-bold text-muted">Os registros ficam neste aparelho.</p>
      </section>
    </div>
  );
}
