import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

export function LeadMagnetBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative flex items-center justify-between gap-4 px-6 py-3 text-white flex-shrink-0"
      style={{
        background: "linear-gradient(90deg, rgba(24,43,22,0.95), rgba(13,26,12,0.95))",
        borderBottom: "1px solid rgba(34,197,94,0.14)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Left dot */}
      <div className="hidden sm:flex h-1.5 w-1.5 rounded-full flex-shrink-0 animate-pulse-green"
        style={{ background: "#22c55e" }}
      />

      <div className="flex items-center gap-4 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-semibold text-white">Vous simulez votre rentabilité.</span>
          <span className="ml-2 text-white/60">
            Commencer dès maintenant à identifier comment contrôler votre rentabilité et augmenter vos marges avec les automatisations &amp; l'IA.
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href="https://cal.com/noa-benitez-yvd7t0/audit-process-digitaux-gratuit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-sm px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff",
            boxShadow: "0 0 16px rgba(34,197,94,0.35)",
          }}
        >
          Audit gratuit — 30 min
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="transition-colors p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
