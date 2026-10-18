import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function Wordmark({ back = false }: { back?: boolean }) {
  return (
    <header className="band">
      <div className={back ? "band-row band-row-back" : "band-row"}>
        {back ? (
          <Link to="/" className="back" aria-label="Voltar ao início">
            <ChevronLeft className="size-6" strokeWidth={2.4} />
          </Link>
        ) : null}
        <img className="band-art" src="/faixa-amora.jpg" width={1000} height={280} alt="Projeto Amora" />
      </div>
    </header>
  );
}

export function Page({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return (
    <div className="shell">
      <Wordmark back />
      <main className="column px-4 py-6">
        <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
        {lede ? <p className="mt-2 text-base font-bold text-muted">{lede}</p> : null}
        <div className="mt-5">{children}</div>
      </main>
    </div>
  );
}
