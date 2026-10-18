import { createFileRoute, Link } from "@tanstack/react-router";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Page } from "@/components/amora/chrome";
import { ACTIVITIES, moodByValue } from "@/lib/amora/data";
import { dateKey, useAmora } from "@/lib/amora/store";

export const Route = createFileRoute("/estatisticas")({ component: EstatisticasPage });

function weekday(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return format(new Date(year, (month ?? 1) - 1, day), "EEE", { locale: ptBR }).replace(".", "");
}

function streakEndingToday(moods: Record<string, number>, today: string) {
  if (!today) return 0;
  let count = 0;
  const cursor = new Date();
  if (!moods[today]) cursor.setDate(cursor.getDate() - 1);
  while (moods[dateKey(cursor)]) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
    if (count > 366) break;
  }
  return count;
}

function EstatisticasPage() {
  const { mood, moods, activitiesByDay, routineProgress, today } = useAmora();
  const feeling = moodByValue(mood);
  const days = Array.from({ length: 7 }, (_, index) => {
    const key = dateKey(subDays(new Date(), 6 - index));
    const value = moods[key];
    return { key, label: weekday(key), mood: value ?? null };
  });
  const recorded = Object.keys(moods).length;
  const weekActivities = days.reduce((sum, day) => {
    const ids = activitiesByDay[day.key] ?? [];
    return sum + ids.filter((id) => ACTIVITIES.some((item) => item.id === id)).length;
  }, 0);
  const hasChart = days.some((day) => day.mood);

  return (
    <Page title="Estatísticas" lede="Os últimos sete dias, só com o que você anotou.">
      <div className="stack">
        <section className="panel text-center">
          <p className="text-sm font-extrabold text-muted">hoje</p>
          {feeling ? (
            <>
              <p className="mt-2 text-5xl leading-none" aria-hidden="true">
                {feeling.emoji}
              </p>
              <p className="mt-2 text-lg font-extrabold">{feeling.label}</p>
            </>
          ) : (
            <>
              <p className="mt-2 font-extrabold">Ainda sem registro hoje.</p>
              <Link to="/" className="primary mt-4">
                marcar o dia
              </Link>
            </>
          )}
        </section>

        <div className="stat-grid">
          <article className="panel">
            <p className="text-2xl font-extrabold tabular-nums">{streakEndingToday(moods, today)}</p>
            <p className="text-sm font-bold text-muted">dias seguidos</p>
          </article>
          <article className="panel">
            <p className="text-2xl font-extrabold tabular-nums">{recorded}</p>
            <p className="text-sm font-bold text-muted">dias anotados</p>
          </article>
          <article className="panel">
            <p className="text-2xl font-extrabold tabular-nums">{weekActivities}</p>
            <p className="text-sm font-bold text-muted">atividades na semana</p>
          </article>
          <article className="panel">
            <p className="text-2xl font-extrabold tabular-nums">
              {routineProgress.done}/{routineProgress.total}
            </p>
            <p className="text-sm font-bold text-muted">rotina de hoje</p>
          </article>
        </div>

        <section className="panel">
          <h2 className="text-base font-extrabold">Humor da semana</h2>
          <p className="mt-1 text-sm font-bold text-muted">Quanto mais alta a barra, melhor o dia.</p>
          {hasChart ? (
            <MoodChart data={days} today={today} />
          ) : (
            <p className="mt-4 text-sm font-bold text-muted">Quando você marcar um dia, a semana aparece aqui.</p>
          )}
        </section>
      </div>
    </Page>
  );
}

function MoodChart({ data, today }: { data: { key: string; label: string; mood: number | null }[]; today: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="mt-4 h-44" />;

  return (
    <div className="mt-4 h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-muted)", fontSize: 12, fontWeight: 700 }}
          />
          <YAxis hide domain={[0, 5]} />
          <Tooltip
            cursor={{ fill: "color-mix(in oklab, var(--color-berry) 8%, transparent)" }}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              borderRadius: 12,
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
            }}
            formatter={(value) => {
              const mood = moodByValue(Number(value));
              return [mood ? mood.label : "sem registro", "humor"];
            }}
          />
          <Bar dataKey="mood" radius={8} maxBarSize={28}>
            {data.map((day) => (
              <Cell
                key={day.key}
                fill={
                  day.key === today
                    ? "var(--color-berry)"
                    : "color-mix(in oklab, var(--color-berry) 55%, var(--color-line))"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
