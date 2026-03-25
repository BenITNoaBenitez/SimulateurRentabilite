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

  return (
    <header className="h-16 border-b flex items-center justify-between px-5 flex-shrink-0" style={{ background: "linear-gradient(135deg, hsl(224,50%,10%), hsl(224,38%,17%))" }}>
      <div className="flex items-center gap-3">
        <img
          src="./Frame100.png"
          alt="BenIT"
          className="h-9 w-9 rounded-xl object-cover flex-shrink-0"
        />
        <div>
          <h1 className="text-base font-bold leading-none tracking-tight text-white">BenIT</h1>
          <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Simulateur de rentabilité</p>
        </div>
      </div>

      {/* KPI strip — compact pills */}
      <div className="hidden lg:flex items-center gap-2">
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

      <div className="flex items-center gap-2">
        {/* Time scale selector */}
        <div className="flex items-center gap-1.5 mr-1">
          <Calendar className="h-3.5 w-3.5 text-white/50" />
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
                className="h-7 px-2.5 text-[11px] font-medium text-white/70 hover:text-white data-[state=on]:bg-white/20 data-[state=on]:text-white border-0"
              >
                {TIME_SCALE_LABELS[key]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Button variant="ghost" size="sm" onClick={onOpenSettings} className="text-white/70 hover:text-white hover:bg-white/10">
          <Settings className="h-4 w-4" />
          <span className="hidden xl:inline ml-1.5">Paramètres</span>
        </Button>
      </div>
    </header>
  );
}

function KpiPill({ label, value, colorClass, highlight }: { label: string; value: string; colorClass?: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${highlight ? "bg-white/20 border border-white/30" : "bg-white/10"}`}>
      <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium">{label}</span>
      <span className={`text-xs font-mono font-bold text-white ${colorClass || ""}`}>{value}</span>
    </div>
  );
}
