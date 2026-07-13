import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Informe seu nome.").max(120, "Nome muito longo."),
  avatarUrl: z.string().url("URL invalida.").optional().or(z.literal(""))
});

export const preferencesSchema = z.object({
  devotionalTime: z.string().optional().or(z.literal("")),
  timezone: z.string().min(1, "Informe o fuso horario."),
  notificationsEnabled: z.boolean()
});

export const consentsSchema = z.object({
  terms: z.boolean(),
  privacyPolicy: z.boolean(),
  personalData: z.boolean(),
  sensitiveData: z.boolean(),
  communications: z.boolean(),
  partnerSharing: z.boolean()
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type ConsentsInput = z.infer<typeof consentsSchema>;
