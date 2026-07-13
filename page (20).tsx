import { NextResponse, type NextRequest } from "next/server";
import type { ConsentType } from "@/types/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { consentsSchema, type ConsentsInput } from "@/lib/validation/profile";
import { getSafeErrorMessage } from "@/lib/errors";

const CONSENT_VERSION = "2026-07-12";

const consentMap: Record<keyof ConsentsInput, ConsentType> = {
  terms: "terms",
  privacyPolicy: "privacy_policy",
  personalData: "personal_data",
  sensitiveData: "sensitive_data",
  communications: "communications",
  partnerSharing: "partner_sharing"
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { data } = await supabase.from("consents").select("*").eq("user_id", user.id).eq("version", CONSENT_VERSION);
  return NextResponse.json({ consents: data ?? [], version: CONSENT_VERSION });
}

export async function PUT(request: NextRequest) {
  try {
    const body = consentsSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const now = new Date().toISOString();
    const rows = Object.entries(consentMap).map(([key, consentType]) => {
      const granted = body[key as keyof typeof body];
      return {
        user_id: user.id,
        consent_type: consentType,
        version: CONSENT_VERSION,
        granted,
        granted_at: granted ? now : null,
        revoked_at: granted ? null : now
      };
    });

    const { error } = await supabase.from("consents").upsert(rows, {
      onConflict: "user_id,consent_type,version"
    });

    if (error) return NextResponse.json({ error: "Nao foi possivel salvar consentimentos." }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getSafeErrorMessage(error) }, { status: 400 });
  }
}
