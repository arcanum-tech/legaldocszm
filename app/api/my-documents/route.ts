import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function normalizePhone(p: string) {
  return p.replace(/\s+/g, "").replace(/^\+26/, "0").replace(/^26/, "0");
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ documents: [] });

  const normalized = normalizePhone(phone);
  const { data, error } = await supabaseAdmin
    .from("legal_documents")
    .select("id, doc_type, is_paid, created_at")
    .eq("requester_phone", normalized)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data ?? [] });
}
