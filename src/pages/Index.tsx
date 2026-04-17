import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/AppHeader";
import { KpiSidebar } from "@/components/KpiSidebar";
import { GlobalSettingsSheet } from "@/components/GlobalSettingsSheet";
import { TabProspect } from "@/components/tabs/TabProspect";
import { TabInterventions } from "@/components/tabs/TabInterventions";
import { TabFacturation } from "@/components/tabs/TabFacturation";
import { TabAchats } from "@/components/tabs/TabAchats";
import { TabResultats } from "@/components/tabs/TabResultats";
import { useSimulation } from "@/hooks/useSimulation";
import { LeadMagnetBanner } from "@/components/LeadMagnetBanner";
import { toast } from "sonner";
import { Building2, Wrench, Receipt, Package, BarChart3 } from "lucide-react";
import type { TimeScale } from "@/types/simulation";
import { DUREE_CONTRAT_MOIS } from "@/types/simulation";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("prospect");
  const [timeScale, setTimeScale] = useState<TimeScale>("mois");
  const sim = useSimulation();
  const dureeMois = DUREE_CONTRAT_MOIS[sim.state.prospect.dureeContrat] || 12;

  const handleSave = () => {
    toast.success("Simulation sauvegardée");
  };

  const handleNewProspect = () => {
    sim.resetSimulation();
    toast.info("Nouvelle simulation créée");
  };

  const tabs = [
    { id: "prospect",      label: "Prospect & Périmètre", icon: Building2 },
    { id: "interventions", label: "Interventions",         icon: Wrench    },
    { id: "facturation",   label: "Facturation",           icon: Receipt   },
    { id: "achats",        label: "Achats & Matières",     icon: Package   },
    { id: "resultats",     label: "Résultats",             icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "hsl(175, 15%, 2%)" }}>

      {/* Ambient orbs — hidden on mobile */}
      <div
        className="hidden md:block fixed pointer-events-none blur-[120px] z-0 rounded-full"
        style={{
          width: 384, height: 384,
          left: "8rem", top: "33%",
          background: "radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 70%)",
          animation: "orb-drift 11s ease-in-out infinite",
        }}
      />
      <div
        className="hidden md:block fixed pointer-events-none blur-[120px] z-0 rounded-full"
        style={{
          width: 384, height: 384,
          right: "8rem", bottom: "25%",
          background: "radial-gradient(circle, rgba(22,163,74,0.14) 0%, transparent 70%)",
          animation: "orb-drift-reverse 13s ease-in-out infinite",
        }}
      />

      <AppHeader
        kpis={sim.kpis}
        settings={sim.settings}
        timeScale={timeScale}
        dureeMois={dureeMois}
        onTimeScaleChange={setTimeScale}
        onOpenSettings={() => setSettingsOpen(true)}
        onNewProspect={handleNewProspect}
        onSave={handleSave}
      />
      <LeadMagnetBanner />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <main className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">

            {/* Tab navigation strip */}
            <div
              className="px-4 lg:px-6 flex-shrink-0"
              style={{
                background: "rgba(24,43,22,0.6)",
                backdropFilter: "blur(8px)",
                borderBottom: "1px solid rgba(34,197,94,0.12)",
              }}
            >
              <TabsList
                className="h-11 bg-transparent p-0 gap-0.5"
              >
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="
                      custom-tab relative h-11 rounded-none px-4 gap-2 text-[13px] font-medium
                      border-b-2 border-transparent
                      text-white/40 hover:text-white/80
                      data-[state=active]:border-green-500 data-[state=active]:text-green-400
                      data-[state=active]:bg-transparent data-[state=active]:shadow-none
                      transition-colors duration-150
                    "
                  >
                    <tab.icon
                      className="h-3.5 w-3.5"
                      style={{ color: activeTab === tab.id ? "#4ade80" : undefined }}
                    />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 max-w-5xl mx-auto animate-fade-in">
                <TabsContent value="prospect" className="mt-0">
                  <TabProspect data={sim.state.prospect} kpis={sim.kpis} onChange={sim.updateProspect} />
                </TabsContent>
                <TabsContent value="interventions" className="mt-0">
                  <TabInterventions
                    data={sim.state.interventions}
                    settings={sim.settings}
                    dureeContrat={sim.state.prospect.dureeContrat}
                    onChange={sim.updateInterventions}
                  />
                </TabsContent>
                <TabsContent value="facturation" className="mt-0">
                  <TabFacturation
                    data={sim.state.facturation}
                    dureeContrat={sim.state.prospect.dureeContrat}
                    onChange={sim.updateFacturation}
                  />
                </TabsContent>
                <TabsContent value="achats" className="mt-0">
                  <TabAchats
                    data={sim.state.achats}
                    settings={sim.settings}
                    onChange={sim.updateAchats}
                  />
                </TabsContent>
                <TabsContent value="resultats" className="mt-0">
                  <TabResultats
                    plLines={sim.plLines}
                    kpis={sim.kpis}
                    settings={sim.settings}
                    state={sim.state}
                    timeScale={timeScale}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </main>

        <KpiSidebar kpis={sim.kpis} settings={sim.settings} timeScale={timeScale} dureeMois={dureeMois} />
      </div>

      <GlobalSettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={sim.settings}
        onUpdate={sim.updateSettings}
      />
    </div>
  );
};

export default Index;
