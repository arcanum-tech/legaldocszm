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
        ? { background: "#dcfce7", color: "#15803d" }
        : { background: "linear-gradient(135deg,#15803d,#166534)", color: "white" }}>
      {copied ? "✓ Copied!" : "Copy Document"}
    </button>
  );
}
