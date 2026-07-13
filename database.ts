export const privacyClasses = {
  private: "Visivel somente para quem respondeu.",
  shared: "Visivel aos dois membros apos autorizacao.",
  administrative: "Restrito a configuracoes, planos, termos e logs sem conteudo sensivel."
} as const;

export function isSensitiveField(field: string) {
  return ["feelings", "reflection", "private_prayer", "sos_session", "risk_report"].includes(field);
}
