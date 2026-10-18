import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { Page } from "@/components/amora/chrome";
import { PERIODS, type Period } from "@/lib/amora/data";
import { useAmora } from "@/lib/amora/store";

export const Route = createFileRoute("/rotina")({ component: RotinaPage });

function RotinaPage() {
  const { routineItems, routineDone, toggleRoutine, addRoutine, removeRoutine, routineProgress } = useAmora();
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<Period>("manha");
  const empty = routineProgress.total === 0;

  return (
    <Page title="Rotina" lede="Marque o que já fez hoje. Amanhã a lista começa de novo.">
      <div className="stack">
        <p className="text-sm font-extrabold text-berry">
          {routineProgress.total === 0
            ? "Nada na lista ainda."
            : `${routineProgress.done} de ${routineProgress.total} hoje`}
        </p>

        <form
          className="panel stack"
          onSubmit={(event) => {
            event.preventDefault();
            addRoutine(title, period);
            setTitle("");
          }}
        >
          <label className="text-sm font-extrabold" htmlFor="rotina-nome">
            Incluir na rotina
          </label>
          <input
            id="rotina-nome"
            className="field"
            value={title}
            maxLength={60}
            autoComplete="off"
            placeholder="Ex.: remédio, leitura, alongar"
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="field"
              aria-label="Período"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
            >
              {PERIODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <button className="primary shrink-0" type="submit" disabled={!title.trim()}>
              Incluir
            </button>
          </div>
        </form>

        {empty ? <p className="text-sm font-bold text-muted">Inclua o primeiro item quando quiser.</p> : null}

        {PERIODS.map((periodItem) => {
          const items = routineItems(periodItem.id);
          if (items.length === 0) return null;
          return (
            <section key={periodItem.id} className="stack">
              <h2 className="text-sm font-extrabold tracking-wide text-muted">{periodItem.label}</h2>
              {items.map((item) => {
                const on = routineDone(item.id);
                return (
                  <div key={item.id} className="flex items-stretch gap-2">
                    <button
                      type="button"
                      className="check-row flex-1"
                      aria-pressed={on}
                      onClick={() => toggleRoutine(item.id)}
                    >
                      <span className="check-box" aria-hidden="true">
                        {on ? <Check className="size-4" strokeWidth={3} /> : null}
                      </span>
                      <span className="check-title">{item.title}</span>
                    </button>
                    <button type="button" className="ghost self-center" onClick={() => removeRoutine(item.id)}>
                      tirar
                    </button>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </Page>
  );
}
