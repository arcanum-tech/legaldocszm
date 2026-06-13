"use client";

import { useState } from "react";
import Link from "next/link";

const DOC_LABELS: Record<string, string> = {
  affidavit: "Affidavit", sale_agreement: "Sale Agreement", tenancy: "Tenancy Agreement",
  employment: "Employment Contract", nda: "NDA", demand_letter: "Demand Letter",
  loan: "Loan Agreement", power_of_attorney: "Power of Attorney",
};

const DOC_ICONS: Record<string, string> = {
  affidavit: "📜", sale_agreement: "🏠", tenancy: "🔑", employment: "💼",
  nda: "🤐", demand_letter: "✉️", loan: "💰", power_of_attorney: "✍️",
};

export default function MyDocumentsPage() {
  const [phone, setPhone] = useState("");
  const [docs, setDocs] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/my-documents?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setDocs(data.documents ?? []);
    setSearched(true);
    setLoading(false);
  }

  const inp = "flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50";

  return (
    <div className="min-h-screen" style={{ background: "#eff6ff" }}>
      <header style={{ background: "linear-gradient(135deg,#1e3a5f,#162d4a)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white text-sm">← Home</Link>
          <h1 className="text-lg font-black">My Documents ⚖️</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-black text-gray-800 mb-1">Retrieve your documents</h2>
          <p className="text-xs text-gray-500 mb-4">Enter the phone number you used when generating documents to find them all.</p>
          <form onSubmit={search} className="flex gap-3">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required
              placeholder="Your phone (e.g. 0976123456)" className={inp} />
            <button type="submit" disabled={loading}
              className="text-white font-black px-5 py-2.5 rounded-xl text-sm disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#1e3a5f,#162d4a)" }}>
              {loading ? "..." : "Search"}
            </button>
          </form>
        </div>

        {searched && !docs.length && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-sm font-semibold">No documents found for this number.</p>
            <Link href="/" className="text-sm font-black mt-2 inline-block" style={{ color: "#1e3a5f" }}>
              Generate your first document →
            </Link>
          </div>
        )}

        {docs.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-black text-gray-700">{docs.length} document{docs.length !== 1 ? "s" : ""} found</p>
            {docs.map((doc: any) => (
              <Link key={doc.id} href={`/document/${doc.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                <div className="text-3xl">{DOC_ICONS[doc.doc_type] ?? "📄"}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800">{DOC_LABELS[doc.doc_type] ?? doc.doc_type}</p>
                  <p className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString("en-ZM", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${doc.is_paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {doc.is_paid ? "✓ Paid" : "Unpaid"}
                  </span>
                  <p className="text-xs font-black mt-1" style={{ color: "#1e3a5f" }}>View →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
