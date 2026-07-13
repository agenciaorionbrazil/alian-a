import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { preferencesSchema } from "@/lib/validation/profile";
import { getSafeErrorMessage } from "@/lib/errors";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { data } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle();
  return NextResponse.json({ preferences: data });
}

export async function PUT(request: NextRequest) {
  try {
    const body = preferencesSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const { error } = await supabase.from("user_preferences").upsert({
      user_id: user.id,
      devotional_time: body.devotionalTime || null,
      timezone: body.timezone,
      notifications_enabled: body.notificationsEnabled
    });

    if (error) return NextResponse.json({ error: "Nao foi possivel salvar preferencias." }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getSafeErrorMessage(error) }, { status: 400 });
  }
}
