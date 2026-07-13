export class AppError extends Error {
  constructor(
    message: string,
    public readonly code = "APP_ERROR",
    public readonly safeMessage = "Nao foi possivel concluir esta acao."
  ) {
    super(message);
  }
}

export function getSafeErrorMessage(error: unknown) {
  if (error instanceof AppError) return error.safeMessage;
  if (error instanceof Error) return error.message;
  return "Nao foi possivel concluir esta acao.";
}
