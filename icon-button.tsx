import { NextResponse, type NextRequest } from "next/server";
import { acceptInviteSchema } from "@/lib/validation/couple";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSafeErrorMessage } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = acceptInviteSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("accept_partner_invite", {
      p_public_code: body.code,
      p_token: body.token
    });

    if (error) {
      return NextResponse.json({ error: "Convite invalido, expirado ou ja utilizado." }, { status: 400 });
    }

    return NextResponse.json({ coupleId: data });
  } catch (error) {
    return NextResponse.json({ error: getSafeErrorMessage(error) }, { status: 400 });
  }
}
