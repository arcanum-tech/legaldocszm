import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PRICES: Record<string, number> = {
  affidavit: 30,
  sale_agreement: 100,
  nda: 80,
  employment: 80,
  tenancy: 60,
  demand_letter: 50,
  loan: 70,
  power_of_attorney: 90,
};

const PROMPTS: Record<string, (fields: Record<string, string>) => string> = {
  affidavit: (f) => `Draft a formal Zambian affidavit for use in Zambian courts. Use proper legal language.
Deponent full name: ${f.deponent_name}
NRC number: ${f.nrc}
Address: ${f.address}
Statement of facts: ${f.statement}
Today's date: ${f.date}
Include: title "AFFIDAVIT", numbered paragraphs, deponent signature line, commissioner of oaths section.`,

  sale_agreement: (f) => `Draft a Zambian sale agreement for movable or immovable property.
Seller name: ${f.seller_name}, NRC: ${f.seller_nrc}, Address: ${f.seller_address}
Buyer name: ${f.buyer_name}, NRC: ${f.buyer_nrc}, Address: ${f.buyer_address}
Property/Item: ${f.property_description}
Purchase price: ZMW ${f.price}
Payment terms: ${f.payment_terms}
Date: ${f.date}
Include: recitals, warranties, signature blocks for both parties and two witnesses.`,

  nda: (f) => `Draft a Zambian Non-Disclosure Agreement.
Disclosing party: ${f.disclosing_party}
Receiving party: ${f.receiving_party}
Confidential information relates to: ${f.subject}
Duration: ${f.duration}
Date: ${f.date}
Include: definitions, obligations, exclusions, remedies, governing law (Laws of Zambia), signature blocks.`,

  employment: (f) => `Draft a Zambian employment contract compliant with the Employment Code Act No. 3 of 2019.
Employer: ${f.employer}, Address: ${f.employer_address}
Employee: ${f.employee_name}, NRC: ${f.employee_nrc}
Position: ${f.position}
Start date: ${f.start_date}
Salary: ZMW ${f.salary} per month
Working hours: ${f.hours}
Probation period: ${f.probation}
Include: duties, leave entitlements, termination, confidentiality, governing law.`,

  tenancy: (f) => `Draft a Zambian residential tenancy agreement.
Landlord: ${f.landlord_name}, NRC/ID: ${f.landlord_nrc}
Tenant: ${f.tenant_name}, NRC: ${f.tenant_nrc}
Property address: ${f.property_address}
Monthly rent: ZMW ${f.rent}
Deposit: ZMW ${f.deposit}
Tenancy start: ${f.start_date}, Duration: ${f.duration}
Include: rent payment terms, maintenance obligations, termination notice, governing law (Zambia).`,

  demand_letter: (f) => `Draft a formal Zambian legal demand letter.
Sender: ${f.sender_name}, Address: ${f.sender_address}
Recipient: ${f.recipient_name}, Address: ${f.recipient_address}
Amount owed / obligation: ${f.demand}
Reason: ${f.reason}
Deadline to comply: ${f.deadline}
Date: ${f.date}
Professional but firm tone. Reference legal consequences of non-compliance.`,

  loan: (f) => `Draft a Zambian loan agreement.
Lender: ${f.lender_name}, NRC: ${f.lender_nrc}
Borrower: ${f.borrower_name}, NRC: ${f.borrower_nrc}
Loan amount: ZMW ${f.amount}
Interest rate: ${f.interest}% per annum
Repayment schedule: ${f.repayment}
Date: ${f.date}
Include: disbursement, interest calculation, default provisions, governing law (Laws of Zambia).`,

  power_of_attorney: (f) => `Draft a Zambian General/Special Power of Attorney.
Principal: ${f.principal_name}, NRC: ${f.principal_nrc}, Address: ${f.principal_address}
Attorney/Agent: ${f.agent_name}, NRC: ${f.agent_nrc}
Powers granted: ${f.powers}
Duration: ${f.duration}
Date: ${f.date}
Include: revocation clause, witness lines, commissioner of oaths section.`,
};

export async function POST(req: NextRequest) {
  const { doc_type, fields, requester_name, requester_phone, requester_email } = await req.json();

  if (!doc_type || !fields) return NextResponse.json({ error: "Missing doc_type or fields" }, { status: 400 });

  const promptFn = PROMPTS[doc_type];
  if (!promptFn) return NextResponse.json({ error: "Unknown document type" }, { status: 400 });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: "You are a Zambian legal document drafter. Produce complete, professional legal documents. Use formal legal English. Include all standard clauses for Zambia. Output PLAIN TEXT only — no markdown, no asterisks, no hashes, no dashes for headings, no &nbsp;, no HTML. Use UPPERCASE for section headings. Use a line of underscores (_______________) for signature lines. Separate sections with blank lines. Output only the document itself — no preamble, no commentary.",
    messages: [{ role: "user", content: promptFn(fields) }],
  });

  const content = response.content[0].type === "text" ? response.content[0].text : "";

  const { data: doc, error } = await supabaseAdmin.from("legal_documents").insert([{
    doc_type,
    title: `${doc_type.replace(/_/g, " ").toUpperCase()} - ${fields.deponent_name || fields.seller_name || fields.sender_name || fields.principal_name || fields.disclosing_party || fields.employer || fields.lender_name || "Document"}`,
    fields,
    content,
    requester_name,
    requester_phone,
    requester_email,
    amount_paid_zmw: PRICES[doc_type] ?? 50,
    is_paid: false,
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ doc_id: doc.id, content, price: PRICES[doc_type] ?? 50 });
}
