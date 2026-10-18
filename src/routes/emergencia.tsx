import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/amora/chrome";
import { SERVICES } from "@/lib/amora/data";

export const Route = createFileRoute("/emergencia")({ component: EmergenciaPage });

function EmergenciaPage() {
  return (
    <Page
      title="Ligar para serviços de emergência"
      lede="Se você ou alguém perto precisa de ajuda agora, estes serviços atendem no Brasil. No celular, o botão abre o discador."
    >
      <div className="stack">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <article key={service.id} className="panel">
              <div className="flex items-start gap-3">
                <span className="chip chip-solid">
                  <Icon className="size-5" strokeWidth={2.3} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold">{service.name}</h2>
                  <p className="text-sm font-bold text-muted">{service.detail}</p>
                  <p className="service-number">{service.number}</p>
                </div>
              </div>
              <a className="primary mt-4 w-full" href={`tel:${service.tel}`}>
                Ligar {service.number}
              </a>
            </article>
          );
        })}
        <p className="text-sm font-bold text-muted">
          Se a ligação não completar, disque o número no teclado do telefone.
        </p>
      </div>
    </Page>
  );
}
