import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "./CopyButton";

export const dynamic = "force-dynamic";

const PRICES: Record<string, number> = {
  affidavit: 30, sale_agreement: 100, nda: 80, employment: 80,
  tenancy: 60, demand_letter: 50, loan: 70, power_of_attorney: 90,
};

export default async function DocumentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ paid?: string }> }) {
  const { id } = await params;
  const { paid } = await searchParams;
  const { data: doc } = await supabaseAdmin.from("legal_documents").select("*").eq("id", id).single();
  if (!doc) return notFound();

  const isPaid = doc.is_paid;
  const justPaid = paid === "1";
  const price = PRICES[doc.doc_type] ?? doc.amount_paid_zmw;

  // Preview: show first 300 chars if not paid
  function cleanDoc(text: string) {
    return text
      .replace(/^#{1,6}\s+/gm, "")          // remove # headings
      .replace(/\*\*(.*?)\*\*/g, "$1")       // remove **bold**
      .replace(/\*(.*?)\*/g, "$1")           // remove *italic*
      .replace(/^---+$/gm, "")              // remove --- dividers
      .replace(/&nbsp;/g, "")               // remove &nbsp;
      .replace(/\\(_+)/g, "$1")             // unescape \___ → ___
      .replace(/\\_/g, "_")                 // unescape remaining \_
      .replace(/\n{3,}/g, "\n\n")           // collapse excess blank lines
      .trim();
  }

  const cleanContent = cleanDoc(doc.content);
  const preview = cleanContent.slice(0, 400) + "...";
  const payUrl = `https://arcanum-payments.vercel.app/pay?app=legaldocszm&product=${encodeURIComponent(doc.title)}&amount=${price}&callback=${encodeURIComponent(`https://legaldocszm.vercel.app/api/payment-callback?doc_id=${id}&status=success`)}`;

  return (
    <div className="min-h-screen" style={{ background: "#eff6ff" }}>
      <header style={{ background: "linear-gradient(135deg,#1e3a5f,#162d4a)" }} className="text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white text-sm">← Home</Link>
          <h1 className="text-lg font-black">LegalDocs ZM ⚖️</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {justPaid && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl px-5 py-3 text-sm font-semibold">
            🎉 Payment confirmed! Your full document is now unlocked below.
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">{doc.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Generated {new Date(doc.created_at).toLocaleDateString("en-ZM")}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isPaid ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-700"}`}>
              {isPaid ? "✓ Paid & Unlocked" : `ZMW ${price} — Payment Required`}
            </span>
          </div>
        </div>

        {/* Document content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-black text-gray-700">Document Preview</p>
            {isPaid && <CopyButton text={cleanContent} />}
          </div>
          <div className="p-5 relative">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono"
              style={{ filter: isPaid ? "none" : "blur(4px)", userSelect: isPaid ? "auto" : "none" }}>
              {isPaid ? cleanContent : preview}
            </pre>
            {!isPaid && (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "rgba(240,253,244,0.85)" }}>
                <div className="text-center p-6">
                  <p className="text-2xl mb-2">🔒</p>
                  <p className="font-black text-gray-800 mb-1">Document Ready</p>
                  <p className="text-sm text-gray-500 mb-4">Pay ZMW {price} to unlock and copy the full document</p>
                  <a href={payUrl}
                    className="inline-block text-white font-black px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg,#1e3a5f,#162d4a)" }}>
                    Pay ZMW {price} — MTN MoMo →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {isPaid && (
          <div className="bg-white rounded-2xl p-5 border border-blue-100 text-sm text-gray-600 space-y-2">
            <p className="font-black text-gray-800">📋 Next steps</p>
            <ul className="space-y-1 text-xs">
              <li>• Copy the document and paste it into Microsoft Word or Google Docs</li>
              <li>• Print and sign before a Commissioner of Oaths (at any Notary or Police station)</li>
              <li>• Keep a copy for your records</li>
            </ul>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm font-bold" style={{ color: "#1e3a5f" }}>
            ← Generate another document
          </Link>
        </div>
      </main>
    </div>
  );
}
