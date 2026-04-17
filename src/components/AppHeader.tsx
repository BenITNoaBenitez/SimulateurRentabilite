import { useState, useEffect } from "react";
import { Settings, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatCurrency, formatPercentage, getMarginColor } from "@/utils/calculations";
import type { KPIData, GlobalSettings, TimeScale } from "@/types/simulation";
import { TIME_SCALE_LABELS, getTimeScaleMultiplier, getTimeScaleSuffix } from "@/types/simulation";

interface AppHeaderProps {
  kpis: KPIData;
  settings: GlobalSettings;
  timeScale: TimeScale;
  dureeMois: number;
  onTimeScaleChange: (scale: TimeScale) => void;
  onOpenSettings: () => void;
  onNewProspect: () => void;
  onSave: () => void;
}

export function AppHeader({ kpis, settings, timeScale, dureeMois, onTimeScaleChange, onOpenSettings }: AppHeaderProps) {
  const mult = getTimeScaleMultiplier(timeScale, dureeMois);
  const suffix = getTimeScaleSuffix(timeScale);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex-shrink-0 transition-all duration-500"
      style={{
        background: scrolled
          ? "linear-gradient(180deg, rgba(24,43,22,0.97), rgba(10,20,10,0.97))"
          : "linear-gradient(180deg, rgba(24,43,22,0.85), rgba(10,20,10,0.85))",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(34,197,94,0.12)",
        boxShadow: scrolled
          ? "0 1px 0 rgba(24,43,22,0.4), 0 4px 24px rgba(0,0,0,0.18)"
          : "none",
      }}
    >
      {/* Top accent bar — animated gradient */}
      <div
        className="h-[2px] w-full animate-gradient-x"
        style={{
          background: "linear-gradient(90deg, #182B16, #22c55e, #4ade80, #22c55e, #182B16)",
          backgroundSize: "200% auto",
        }}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 lg:px-6 py-2.5">

        {/* ── Logo ─────────────────────────────── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative group" style={{ transition: "transform 300ms" }}>
            <img
              src="./Frame100.png"
              alt="BenIT"
              className="h-9 w-9 object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              style={{
                borderRadius: "14px",
                boxShadow: "0 0 0 1px rgba(34,197,94,0.25), 0 2px 8px rgba(0,0,0,0.4)",
              }}
            />
            {/* Glass overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "14px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
              }}
            />
          </div>

          <div className="hidden sm:block">
            <div
              className="text-[15px] font-bold leading-none tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-white">BenIT</span>
              <span className="text-green-400 ml-1">Plateforme</span>
            </div>
            <div
              className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgba(34,197,94,0.7)" }}
            >
              Automatisation · Outils
            </div>
          </div>
        </div>

        {/* ── KPI pills — centre ────────────────── */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-2">
          <KpiPill label={`CA Net${suffix}`} value={formatCurrency(kpis.caNetMensuel * mult)} />
          <KpiPill label={`Coûts${suffix}`} value={formatCurrency(kpis.coutTotalMensuel * mult)} />
          <KpiPill
            label="Marge brute"
            value={formatPercentage(kpis.margeBrutePct)}
            colorClass={getMarginColor(kpis.margeBrutePct, settings.margeBruteCible, settings.seuilAlerteMargeNette)}
          />
          <KpiPill
            label="Marge nette"
            value={formatPercentage(kpis.margeNettePct)}
            colorClass={getMarginColor(kpis.margeNettePct, settings.margeNetteCible, settings.seuilAlerteMargeNette)}
            highlight
          />
        </div>

        {/* ── Zone droite ───────────────────────── */}
        <div className="ml-auto flex items-center gap-1">
          {/* Time scale */}
          <div className="flex items-center gap-1.5 mr-1">
            <Calendar className="h-3.5 w-3.5 text-white/40" />
            <ToggleGroup
              type="single"
              value={timeScale}
              onValueChange={(v) => { if (v) onTimeScaleChange(v as TimeScale); }}
              className="h-8"
            >
              {(Object.keys(TIME_SCALE_LABELS) as TimeScale[]).map((key) => (
                <ToggleGroupItem
                  key={key}
                  value={key}
                  className="h-7 px-2.5 text-[11px] font-medium rounded-xl border-0
                    text-white/50 hover:text-white/90
                    data-[state=on]:text-green-400 data-[state=on]:bg-[rgba(34,197,94,0.15)]"
                >
                  {TIME_SCALE_LABELS[key]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Paramètres */}
          <button
            onClick={onOpenSettings}
            className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors duration-150
              text-white/40 hover:text-white/80 hover:bg-white/5"
            title="Paramètres"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function KpiPill({
  label,
  value,
  colorClass,
  highlight,
}: {
  label: string;
  value: string;
  colorClass?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
        highlight
          ? "border"
          : ""
      }`}
      style={
        highlight
          ? {
              background: "rgba(34,197,94,0.12)",
              borderColor: "rgba(34,197,94,0.28)",
              boxShadow: "0 0 12px rgba(34,197,94,0.1)",
            }
          : { background: "rgba(255,255,255,0.06)" }
      }
    >
      <span className="text-[10px] text-white/50 uppercase tracking-wider font-medium">{label}</span>
      <span
        className={`text-xs font-mono font-bold ${colorClass || "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}
