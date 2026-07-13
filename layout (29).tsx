import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background-main px-4 text-center">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-text-primary">Pagina nao encontrada</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          O caminho solicitado nao existe ou ainda nao foi liberado para esta etapa.
        </p>
        <Button className="mt-6" href="/">
          Voltar ao inicio
        </Button>
      </div>
    </main>
  );
}
