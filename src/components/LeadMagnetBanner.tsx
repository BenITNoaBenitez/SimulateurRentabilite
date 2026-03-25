import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

export function LeadMagnetBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative flex items-center justify-between gap-4 px-6 py-3.5 text-white flex-shrink-0"
      style={{ background: "linear-gradient(90deg, hsl(224,76%,36%), hsl(224,60%,28%))" }}>

      {/* Left — copy */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="hidden sm:flex h-2 w-2 rounded-full bg-white/60 animate-pulse flex-shrink-0" />
        <p className="text-sm leading-snug">
          <span className="font-semibold">Vous simulez votre rentabilité.</span>
          <span className="text-white/75 ml-2">Commencer dès maintenant à identifier comment contrôler votre rentabilité et augmenter vos marges avec les automatisations & l'IA.</span>
        </p>
      </div>

      {/* Right — CTA */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href="https://cal.com/noa-benitez-yvd7t0/audit-process-digitaux-gratuit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors shadow-sm whitespace-nowrap"
        >
          Audit gratuit — 30 min
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/50 hover:text-white transition-colors p-1 rounded"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
