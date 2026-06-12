import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("doc_id");
  const status = searchParams.get("status");

  if (!docId) return NextResponse.json({ error: "Missing doc_id" }, { status: 400 });

  if (status === "success") {
    await supabaseAdmin.from("legal_documents").update({ is_paid: true }).eq("id", docId);
    return NextResponse.redirect(new URL(`/document/${docId}?paid=1`, req.url));
  }

  return NextResponse.redirect(new URL(`/document/${docId}?paid=0`, req.url));
}
