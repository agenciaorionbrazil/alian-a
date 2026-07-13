import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createInviteSchema } from "@/lib/validation/couple";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/utils";
import { getSafeErrorMessage } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = createInviteSchema.parse(await request.json());
    const token = randomBytes(32).toString("base64url");
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("create_partner_invite", {
      p_couple_id: body.coupleId,
      p_invited_email: body.invitedEmail || null,
      p_invited_phone: body.invitedPhone || null,
      p_token: token
    });

    if (error || !data?.[0]) {
      return NextResponse.json({ error: "Nao foi possivel criar o convite." }, { status: 400 });
    }

    const invite = data[0];
    const inviteUrl = absoluteUrl(`/convite?code=${encodeURIComponent(invite.public_code)}&token=${encodeURIComponent(token)}`);

    return NextResponse.json({
      publicCode: invite.public_code,
      expiresAt: invite.expires_at,
      inviteUrl
    });
  } catch (error) {
    return NextResponse.json({ error: getSafeErrorMessage(error) }, { status: 400 });
  }
}
