import { NextResponse, type NextRequest } from "next/server";
import { createCoupleSchema } from "@/lib/validation/couple";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSafeErrorMessage } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = createCoupleSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("create_couple_with_member", {
      p_relationship_type: body.relationshipType,
      p_started_on: body.startedOn || null,
      p_journey_name: body.journeyName || null
    });

    if (error) {
      return NextResponse.json({ error: "Nao foi possivel criar a relacao." }, { status: 400 });
    }

    return NextResponse.json({ coupleId: data });
  } catch (error) {
    return NextResponse.json({ error: getSafeErrorMessage(error) }, { status: 400 });
  }
}
