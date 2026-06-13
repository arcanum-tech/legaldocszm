"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TODAY = new Date().toISOString().split("T")[0];

const DOC_CONFIG: Record<string, { label: string; icon: string; price: number; fields: { key: string; label: string; placeholder: string; type?: string; rows?: number }[] }> = {
  affidavit: {
    label: "Affidavit", icon: "📜", price: 30,
    fields: [
      { key: "deponent_name", label: "Deponent Full Name", placeholder: "e.g. John Doe" },
      { key: "nrc", label: "NRC Number", placeholder: "e.g. 123456/78/1" },
      { key: "address", label: "Residential Address", placeholder: "e.g. Plot 123, Woodlands, Lusaka" },
      { key: "statement", label: "Statement of Facts", placeholder: "State the facts you are swearing to...", rows: 5 },
      { key: "date", label: "Date", placeholder: TODAY, type: "date" },
    ],
  },
  sale_agreement: {
    label: "Sale Agreement", icon: "🏠", price: 100,
    fields: [
      { key: "seller_name", label: "Seller Full Name", placeholder: "e.g. John Banda" },
      { key: "seller_nrc", label: "Seller NRC", placeholder: "e.g. 123456/78/1" },
      { key: "seller_address", label: "Seller Address", placeholder: "e.g. Plot 123, Woodlands, Lusaka" },
      { key: "buyer_name", label: "Buyer Full Name", placeholder: "e.g. Mary Phiri" },
      { key: "buyer_nrc", label: "Buyer NRC", placeholder: "e.g. 987654/32/1" },
      { key: "buyer_address", label: "Buyer Address", placeholder: "e.g. House 45, Kabulonga, Lusaka" },
      { key: "property_description", label: "Property / Item Description", placeholder: "e.g. Toyota Corolla 2018, Reg. ABC 1234; or Plot 567 Stand No. 123, Woodlands" },
      { key: "price", label: "Purchase Price (ZMW)", placeholder: "e.g. 150000" },
      { key: "payment_terms", label: "Payment Terms", placeholder: "e.g. Full payment on signing; or 50% deposit, balance on transfer" },
      { key: "date", label: "Date", placeholder: TODAY, type: "date" },
    ],
  },
  tenancy: {
    label: "Tenancy Agreement", icon: "🔑", price: 60,
    fields: [
      { key: "landlord_name", label: "Landlord Full Name", placeholder: "e.g. David Mwale" },
      { key: "landlord_nrc", label: "Landlord NRC/ID", placeholder: "e.g. 456789/10/1" },
      { key: "tenant_name", label: "Tenant Full Name", placeholder: "e.g. Grace Tembo" },
      { key: "tenant_nrc", label: "Tenant NRC", placeholder: "e.g. 321654/98/1" },
      { key: "property_address", label: "Property Address", placeholder: "e.g. House No. 12, Stand 456, Chelstone, Lusaka" },
      { key: "rent", label: "Monthly Rent (ZMW)", placeholder: "e.g. 3500" },
      { key: "deposit", label: "Security Deposit (ZMW)", placeholder: "e.g. 7000" },
      { key: "start_date", label: "Tenancy Start Date", placeholder: TODAY, type: "date" },
      { key: "duration", label: "Duration", placeholder: "e.g. 12 months, or Month-to-month" },
    ],
  },
  employment: {
    label: "Employment Contract", icon: "💼", price: 80,
    fields: [
      { key: "employer", label: "Employer / Company Name", placeholder: "e.g. ARCANUM TECH LIMITED" },
      { key: "employer_address", label: "Employer Address", placeholder: "e.g. Lusaka, Zambia" },
      { key: "employee_name", label: "Employee Full Name", placeholder: "e.g. Peter Sichinga" },
      { key: "employee_nrc", label: "Employee NRC", placeholder: "e.g. 654321/10/1" },
      { key: "position", label: "Job Title / Position", placeholder: "e.g. Software Developer" },
      { key: "start_date", label: "Start Date", placeholder: TODAY, type: "date" },
      { key: "salary", label: "Monthly Salary (ZMW)", placeholder: "e.g. 8000" },
      { key: "hours", label: "Working Hours", placeholder: "e.g. 8am–5pm, Monday to Friday" },
      { key: "probation", label: "Probation Period", placeholder: "e.g. 3 months" },
    ],
  },
  nda: {
    label: "Non-Disclosure Agreement", icon: "🤐", price: 80,
    fields: [
      { key: "disclosing_party", label: "Disclosing Party", placeholder: "e.g. ARCANUM TECH LIMITED" },
      { key: "receiving_party", label: "Receiving Party", placeholder: "e.g. John Mwanza" },
      { key: "subject", label: "Confidential Information Relates To", placeholder: "e.g. Software product design, business strategy, client lists" },
      { key: "duration", label: "NDA Duration", placeholder: "e.g. 2 years from signing" },
      { key: "date", label: "Date", placeholder: TODAY, type: "date" },
    ],
  },
  demand_letter: {
    label: "Demand Letter", icon: "✉️", price: 50,
    fields: [
      { key: "sender_name", label: "Your Full Name / Company", placeholder: "e.g. John Doe" },
      { key: "sender_address", label: "Your Address", placeholder: "e.g. Plot 123, Woodlands, Lusaka" },
      { key: "recipient_name", label: "Recipient Name / Company", placeholder: "e.g. ABC Contractors Ltd" },
      { key: "recipient_address", label: "Recipient Address", placeholder: "e.g. Cairo Road, Lusaka" },
      { key: "demand", label: "What You Are Demanding", placeholder: "e.g. Payment of ZMW 25,000 owed for construction work completed" },
      { key: "reason", label: "Background / Reason", placeholder: "e.g. Completed roofing works in March 2026 per signed quote, payment not received" },
      { key: "deadline", label: "Deadline to Comply", placeholder: "e.g. 14 days from receipt of this letter" },
      { key: "date", label: "Date", placeholder: TODAY, type: "date" },
    ],
  },
  loan: {
    label: "Loan Agreement", icon: "💰", price: 70,
    fields: [
      { key: "lender_name", label: "Lender Full Name", placeholder: "e.g. James Zulu" },
      { key: "lender_nrc", label: "Lender NRC", placeholder: "e.g. 112233/44/1" },
      { key: "borrower_name", label: "Borrower Full Name", placeholder: "e.g. Faith Lungu" },
      { key: "borrower_nrc", label: "Borrower NRC", placeholder: "e.g. 556677/88/1" },
      { key: "amount", label: "Loan Amount (ZMW)", placeholder: "e.g. 10000" },
      { key: "interest", label: "Interest Rate (% per annum)", placeholder: "e.g. 20, or 0 for interest-free" },
      { key: "repayment", label: "Repayment Schedule", placeholder: "e.g. ZMW 1,000 per month for 12 months starting July 2026" },
      { key: "date", label: "Date", placeholder: TODAY, type: "date" },
    ],
  },
  power_of_attorney: {
    label: "Power of Attorney", icon: "✍️", price: 90,
    fields: [
      { key: "principal_name", label: "Principal Full Name (who is granting)", placeholder: "e.g. John Doe" },
      { key: "principal_nrc", label: "Principal NRC", placeholder: "e.g. 123456/78/1" },
      { key: "principal_address", label: "Principal Address", placeholder: "e.g. Plot 123, Woodlands, Lusaka" },
      { key: "agent_name", label: "Attorney/Agent Full Name", placeholder: "e.g. Michael Tembo" },
      { key: "agent_nrc", label: "Agent NRC", placeholder: "e.g. 998877/66/1" },
      { key: "powers", label: "Powers Granted", placeholder: "e.g. To sell, transfer and sign all documents relating to Plot 567, Woodlands, Lusaka on my behalf" },
      { key: "duration", label: "Duration", placeholder: "e.g. Until revoked in writing, or Until 31 December 2026" },
      { key: "date", label: "Date", placeholder: TODAY, type: "date" },
    ],
  },
};

export default function GeneratePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const config = DOC_CONFIG[type];
  const router = useRouter();
  const CACHE_KEY = `legaldocs_draft_${type}`;
  const [fields, setFields] = useState<Record<string, string>>({});
  const [requesterName, setRequesterName] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(CACHE_KEY);
      if (saved) {
        const { fields: f, requesterName: n, requesterPhone: p } = JSON.parse(saved);
        if (f) setFields(f);
        if (n) setRequesterName(n);
        if (p) setRequesterPhone(p);
      }
    } catch {}
  }, [CACHE_KEY]);

  // Persist to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ fields, requesterName, requesterPhone }));
    } catch {}
  }, [fields, requesterName, requesterPhone, CACHE_KEY]);

  if (!config) return <div className="p-8 text-center text-red-500">Unknown document type.</div>;

  function setField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doc_type: type, fields, requester_name: requesterName, requester_phone: requesterPhone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    // Clear cache on successful submission
    try { sessionStorage.removeItem(CACHE_KEY); } catch {}
    router.push(`/document/${data.doc_id}`);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50";

  return (
    <div className="min-h-screen" style={{ background: "#eff6ff" }}>
      <header style={{ background: "linear-gradient(135deg,#1e3a5f,#162d4a)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">LegalDocs ZM ⚖️</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{config.icon}</span>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{config.label}</h2>
            <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>ZMW {config.price}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">Fill in the details below. AI will generate a complete Zambian legal document.</p>

        <form onSubmit={submit} className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-gray-800">Document Details</h3>
            {config.fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                {f.rows ? (
                  <textarea value={fields[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder} rows={f.rows} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 resize-none" />
                ) : (
                  <input value={fields[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder} type={f.type ?? "text"} required className={inp} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800">Your Contact Details</h3>
            <p className="text-xs text-gray-400">So we can resend your document if needed</p>
            <input value={requesterName} onChange={(e) => setRequesterName(e.target.value)} placeholder="Your full name" required className={inp} />
            <input value={requesterPhone} onChange={(e) => setRequesterPhone(e.target.value)} placeholder="Your phone (e.g. 0976123456)" required className={inp} />
          </div>

          <div className="bg-white rounded-2xl p-4 border border-blue-100 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-1">💡 What happens next</p>
            <p>After submitting, your document is generated instantly. You will see a preview and pay <strong>ZMW {config.price}</strong> via MTN MoMo to unlock the full document.</p>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full text-white font-black py-4 rounded-xl text-sm disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#1e3a5f,#162d4a)" }}>
            {loading ? "Generating document..." : `Generate ${config.label} — ZMW ${config.price}`}
          </button>
        </form>
      </main>
    </div>
  );
}
