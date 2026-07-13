import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation/profile";
import { getSafeErrorMessage } from "@/lib/errors";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { data, error } = await supabase.from("profiles").select("id, full_name, avatar_url, role").eq("id", user.id).single();
  if (error) return NextResponse.json({ error: "Perfil nao encontrado." }, { status: 404 });

  return NextResponse.json({ profile: data, email: user.email });
}

export async function PUT(request: NextRequest) {
  try {
    const body = profileSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: body.fullName,
        avatar_url: body.avatarUrl || null
      })
      .eq("id", user.id);

    if (error) return NextResponse.json({ error: "Nao foi possivel atualizar o perfil." }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getSafeErrorMessage(error) }, { status: 400 });
  }
}
