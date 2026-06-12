import Link from "next/link";

const DOC_TYPES = [
  { id: "affidavit",          label: "Affidavit",             icon: "📜", price: 30,  desc: "Sworn statement for courts, banks, embassies" },
  { id: "sale_agreement",     label: "Sale Agreement",        icon: "🏠", price: 100, desc: "Buy/sell property, vehicles or goods" },
  { id: "tenancy",            label: "Tenancy Agreement",     icon: "🔑", price: 60,  desc: "Landlord & tenant residential lease" },
  { id: "employment",         label: "Employment Contract",   icon: "💼", price: 80,  desc: "Hire staff — compliant with Zambian law" },
  { id: "nda",                label: "NDA",                   icon: "🤐", price: 80,  desc: "Protect confidential business information" },
  { id: "demand_letter",      label: "Demand Letter",         icon: "✉️", price: 50,  desc: "Formally demand payment or action" },
  { id: "loan",               label: "Loan Agreement",        icon: "💰", price: 70,  desc: "Personal or business loan with repayment terms" },
  { id: "power_of_attorney",  label: "Power of Attorney",     icon: "✍️", price: 90,  desc: "Authorise someone to act on your behalf" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#eff6ff", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #162d4a 100%)" }} className="text-white px-6 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(255,255,255,0.2)" }}>⚖️</div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">LegalDocs ZM</h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Zambian Legal Documents 🇿🇲</p>
            </div>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            AI-Powered · Zambia-Specific
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #162d4a 100%)" }} className="text-white px-6 pt-10 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
            ⚖️ Professional documents in minutes
          </div>
          <h2 className="text-4xl font-black mb-3 leading-tight">
            Legal documents.<br />
            <span style={{ color: "#bfdbfe" }}>No lawyer needed.</span>
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
            Fill in the details · AI drafts your document · Pay & download · Done in 2 minutes
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {["Affidavits", "Sale Agreements", "Tenancy Contracts", "NDAs", "Demand Letters", "Employment Contracts"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.2)" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Document types */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h3 className="text-xl font-black text-gray-800 mb-2">Choose a Document</h3>
        <p className="text-sm text-gray-500 mb-6">All documents are tailored to Zambian law</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOC_TYPES.map((doc) => (
            <Link key={doc.id} href={`/generate/${doc.id}`}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all group">
              <div className="text-4xl mb-3">{doc.icon}</div>
              <p className="font-black text-gray-900 mb-1 group-hover:text-blue-800 transition-colors">{doc.label}</p>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{doc.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black" style={{ color: "#1e3a5f" }}>ZMW {doc.price}</span>
                <span className="text-xs text-white font-bold px-2.5 py-1 rounded-full" style={{ background: "linear-gradient(135deg,#1e3a5f,#162d4a)" }}>
                  Generate →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-800 mb-6 text-center">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "📋", title: "Pick document", desc: "Choose the type of document you need" },
              { step: "2", icon: "✏️", title: "Fill details", desc: "Enter names, dates and specifics" },
              { step: "3", icon: "🤖", title: "AI drafts it", desc: "Claude AI generates a complete legal document" },
              { step: "4", icon: "💳", title: "Pay & copy", desc: "Pay via MTN MoMo and copy your document" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)" }}>
                  {s.icon}
                </div>
                <p className="font-black text-gray-800 text-sm mb-1">{s.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-xs" style={{ background: "#111827", color: "#9ca3af" }}>
        <p className="text-white font-black text-base mb-1">LegalDocs ZM ⚖️</p>
        <p className="mb-1">Powered by <span style={{ color: "#93c5fd" }}>ARCANUM TECH LIMITED</span> · TPIN: 2003723894 · Lusaka, Zambia</p>
        <p style={{ color: "#6b7280" }}>Documents are AI-generated guides. For complex matters consult a qualified Zambian lawyer.</p>
      </footer>
    </div>
  );
}
