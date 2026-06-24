"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="bg-foreground text-background px-4 py-2 rounded-full text-sm print:hidden"
    >
      Print
    </button>
  );
}
