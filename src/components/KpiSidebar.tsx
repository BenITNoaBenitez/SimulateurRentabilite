import { formatCurrency, formatPercentage, getMarginColor } from "@/utils/calculations";
import type { KPIData, GlobalSettings, TimeScale } from "@/types/simulation";
import { getTimeScaleMultiplier, getTimeScaleSuffix } from "@/types/simulation";
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Percent, Zap, Wrench, Package, Users, Layers } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KpiSidebarProps {
  kpis: KPIData;
  settings: GlobalSettings;
  timeScale: TimeScale;
  dureeMois: number;
}

function KpiItem({ label, value, icon: Icon, tooltip, colorClass, accent }: {
  label: string;
  value: string;
  icon: React.ElementType;
  tooltip: string;
  colorClass?: string;
  accent?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="px-4 py-3.5 transition-colors cursor-default"
          style={{
            borderBottom: "1px solid rgba(34,197,94,0.1)",
            background: accent ? "rgba(34,197,94,0.06)" : "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = accent
              ? "rgba(34,197,94,0.1)"
              : "rgba(34,197,94,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = accent
              ? "rgba(34,197,94,0.06)"
              : "transparent";
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="h-5 w-5 rounded flex items-center justify-center flex-shrink-0"
              style={{
                background: accent ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.08)",
              }}
            >
              <Icon
                className="h-3 w-3"
                style={{ color: accent ? "#4ade80" : "rgba(148,163,184,0.8)" }}
              />
            </div>
            <span className="kpi-label" style={{ color: "rgba(148,163,184,0.8)" }}>{label}</span>
          </div>
          <div
            className={`kpi-value number-animate ${colorClass || ""}`}
            style={{ color: colorClass ? undefined : "#e2e8f0" }}
          >
            {value}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[220px] text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function KpiSidebar({ kpis, settings, timeScale, dureeMois }: KpiSidebarProps) {
  const marginBruteColor = getMarginColor(kpis.margeBrutePct, settings.margeBruteCible, settings.seuilAlerteMargeNette);
  const marginNetteColor = getMarginColor(kpis.margeNettePct, settings.margeNetteCible, settings.seuilAlerteMargeNette);
  const mult = getTimeScaleMultiplier(timeScale, dureeMois);
  const suffix = getTimeScaleSuffix(timeScale);

  return (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #182B16, #0d1a0c)",
        borderLeft: "1px solid rgba(34,197,94,0.12)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-4"
        style={{ borderBottom: "1px solid rgba(34,197,94,0.12)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: "#22c55e",
              animation: "pulse-green 2s ease-in-out infinite",
            }}
          />
          <h2
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "rgba(74,222,128,0.9)", fontFamily: "var(--font-display)" }}
          >
            Live KPIs
          </h2>
        </div>
      </div>

      <KpiItem
        label={`CA Net ${suffix}`}
        value={formatCurrency(kpis.caNetMensuel * mult)}
        icon={DollarSign}
        tooltip={`Chiffre d'affaires net ${suffix} après remises`}
        accent
      />
      <KpiItem
        label={`Coûts ${suffix}`}
        value={formatCurrency(kpis.coutTotalMensuel * mult)}
        icon={TrendingDown}
        tooltip={`Somme des coûts directs et indirects ${suffix}`}
      />
      <KpiItem
        label="Marge brute"
        value={formatPercentage(kpis.margeBrutePct)}
        icon={BarChart3}
        tooltip={`CA Net - Coûts directs / CA Net. Cible: ${settings.margeBruteCible}%`}
        colorClass={marginBruteColor}
      />
      <KpiItem
        label="Marge nette"
        value={formatPercentage(kpis.margeNettePct)}
        icon={Percent}
        tooltip={`Marge brute - Frais indirects / CA Net. Cible: ${settings.margeNetteCible}%`}
        colorClass={marginNetteColor}
        accent
      />
      <KpiItem
        label={`Marge nette ${suffix}`}
        value={formatCurrency(kpis.margeNetteMensuel * mult)}
        icon={DollarSign}
        tooltip={`Marge nette en euros ${suffix}`}
        colorClass={marginNetteColor}
      />
      <KpiItem
        label="Valeur attendue"
        value={formatCurrency(kpis.valeurAttendue)}
        icon={Target}
        tooltip="CA total x probabilité de signature"
      />
      <KpiItem
        label="Point mort"
        value={`${kpis.pointMortMois} mois`}
        icon={TrendingUp}
        tooltip="Nombre de mois avant que le client devienne rentable"
      />
      <KpiItem
        label="ROI contrat"
        value={formatPercentage(kpis.roiPct)}
        icon={Zap}
        tooltip="Retour sur investissement sur la durée du contrat"
      />

      {settings.margeDetaillee && (
        <>
          <div
            className="px-4 py-2"
            style={{ borderBottom: "1px solid rgba(34,197,94,0.1)" }}
          >
            <div
              className="text-[9px] uppercase tracking-widest"
              style={{ color: "rgba(148,163,184,0.6)" }}
            >
              Marges par catégorie
            </div>
          </div>
          <KpiItem
            label="Marge MO"
            value={formatPercentage(kpis.margeMOPct)}
            icon={Users}
            tooltip={`Marge sur main-d'oeuvre. Cible: ${settings.margeCibleMO}%`}
            colorClass={getMarginColor(kpis.margeMOPct, settings.margeCibleMO, settings.margeCibleMO * 0.5)}
          />
          <KpiItem
            label="Marge articles"
            value={formatPercentage(kpis.margeArticlesPct)}
            icon={Package}
            tooltip={`Marge sur articles/fournitures. Cible: ${settings.margeCibleArticles}%`}
            colorClass={getMarginColor(kpis.margeArticlesPct, settings.margeCibleArticles, settings.margeCibleArticles * 0.5)}
          />
          <KpiItem
            label="Marge sous-traitance"
            value={formatPercentage(kpis.margeSousTraitancePct)}
            icon={Wrench}
            tooltip={`Part sous-traitance / CA net. Cible: ${settings.margeCibleSousTraitance}%`}
            colorClass={getMarginColor(-kpis.margeSousTraitancePct, -settings.margeCibleSousTraitance, -settings.margeCibleSousTraitance * 2)}
          />
          <KpiItem
            label="Marge matière"
            value={formatPercentage(kpis.margeMatierePct)}
            icon={Layers}
            tooltip={`Marge sur matière première. Cible: ${settings.margeCibleMatiere}%`}
            colorClass={getMarginColor(kpis.margeMatierePct, settings.margeCibleMatiere, settings.margeCibleMatiere * 0.5)}
          />
        </>
      )}

      <div
        className="mt-auto px-4 py-4"
        style={{ borderTop: "1px solid rgba(34,197,94,0.12)" }}
      >
        <div
          className="text-[9px] uppercase tracking-widest"
          style={{ color: "rgba(34,197,94,0.5)" }}
        >
          Mis à jour en temps réel
        </div>
      </div>
    </aside>
  );
}
