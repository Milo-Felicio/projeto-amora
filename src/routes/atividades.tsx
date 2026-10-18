import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Page } from "@/components/amora/chrome";
import { ACTIVITIES, moodByValue } from "@/lib/amora/data";
import { useAmora } from "@/lib/amora/store";

export const Route = createFileRoute("/atividades")({ component: AtividadesPage });

function AtividadesPage() {
  const { mood, activityDone, toggleActivity, doneActivityCount } = useAmora();
  const feeling = moodByValue(mood);
  const total = ACTIVITIES.length;
  const done = doneActivityCount === total;

  return (
    <Page
      title="Atividades"
      lede={
        feeling
          ? `Dia ${feeling.label}. Escolha uma e marque quando terminar.`
          : "Escolha uma e marque quando terminar."
      }
    >
      <div className="stack">
        <p className="text-sm font-extrabold text-berry">
          {done ? "Tudo marcado. Pode descansar." : `${doneActivityCount} de ${total} hoje`}
        </p>
        {ACTIVITIES.map((activity) => {
          const on = activityDone(activity.id);
          const Icon = activity.icon;
          return (
            <button
              key={activity.id}
              type="button"
              className="check-row"
              aria-pressed={on}
              onClick={() => toggleActivity(activity.id)}
            >
              <span className="check-box" aria-hidden="true">
                {on ? <Check className="size-4" strokeWidth={3} /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="check-title">{activity.title}</span>
                <span className="check-detail">
                  {activity.detail} · {activity.minutes} min
                </span>
              </span>
              <Icon className="size-5 shrink-0 text-berry" strokeWidth={2.2} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </Page>
  );
}
