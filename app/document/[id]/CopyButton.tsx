"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button onClick={copy}
      className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
      style={copied
        ? { background: "#dbeafe", color: "#1e3a5f" }
        : { background: "linear-gradient(135deg,#1e3a5f,#162d4a)", color: "white" }}>
      {copied ? "✓ Copied!" : "Copy Document"}
    </button>
  );
}
