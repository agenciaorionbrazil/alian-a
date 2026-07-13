"use client";

import { Button, ErrorState } from "@/components/ui";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background-main px-4">
      <div className="w-full max-w-lg">
        <ErrorState description="Encontramos um erro inesperado. Tente novamente em instantes." title="Algo saiu do fluxo" />
        <Button className="mt-5" onClick={reset} type="button">
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
