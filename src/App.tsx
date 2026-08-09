import React, { useState } from "react";
import { NavigationTab } from "./types";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/home/Hero";
import { TechDivisions } from "./components/home/TechDivisions";
import { ProductsGrid } from "./components/home/ProductsGrid";
import { SolutionsSection } from "./components/home/SolutionsSection";
import { ResearchLabPreview } from "./components/home/ResearchLabPreview";
import { CaseStudiesGrid } from "./components/home/CaseStudiesGrid";
import { TestimonialsSection } from "./components/home/TestimonialsSection";
import { ProjectConsultationForm } from "./components/home/ProjectConsultationForm";
import { AIWorkspace } from "./components/workspace/AIWorkspace";
import { QuantumDivisionView } from "./components/sections/QuantumDivisionView";
import { BlockchainDivisionView } from "./components/sections/BlockchainDivisionView";
import { CryptoDivisionView } from "./components/sections/CryptoDivisionView";
import { AlgorithmLabView } from "./components/sections/AlgorithmLabView";
import { DeveloperPortalView } from "./components/sections/DeveloperPortalView";
import { AdminDashboardView } from "./components/sections/AdminDashboardView";
import { LegalModal } from "./components/sections/LegalModal";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>("home");
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalDefaultTab, setLegalDefaultTab] = useState("privacy");

  const openLegalModal = (tabName: string = "privacy") => {
    setLegalDefaultTab(tabName);
    setLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openLegalModal={openLegalModal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === "home" && (
          <>
            <Hero setCurrentTab={setCurrentTab} />
            <TechDivisions setCurrentTab={setCurrentTab} />
            <ProductsGrid setCurrentTab={setCurrentTab} />
            <SolutionsSection setCurrentTab={setCurrentTab} />
            <ResearchLabPreview setCurrentTab={setCurrentTab} />
            <CaseStudiesGrid setCurrentTab={setCurrentTab} />
            <TestimonialsSection />
            <ProjectConsultationForm />
          </>
        )}

        {currentTab === "ai-workspace" && <AIWorkspace />}
        {currentTab === "quantum" && <QuantumDivisionView />}
        {currentTab === "blockchain" && <BlockchainDivisionView />}
        {currentTab === "web4" && <BlockchainDivisionView />}
        {currentTab === "cryptography" && <CryptoDivisionView />}
        {currentTab === "algorithms" && <AlgorithmLabView />}
        {currentTab === "research" && <AlgorithmLabView />}
        {currentTab === "products" && <ProductsGrid setCurrentTab={setCurrentTab} />}
        {currentTab === "solutions" && <SolutionsSection setCurrentTab={setCurrentTab} />}
        {currentTab === "developers" && <DeveloperPortalView />}
        {currentTab === "case-studies" && <CaseStudiesGrid setCurrentTab={setCurrentTab} />}
        {currentTab === "testimonials" && <TestimonialsSection />}
        {currentTab === "contact" && <ProjectConsultationForm />}
        {currentTab === "admin" && <AdminDashboardView />}
      </main>

      {/* Footer (Hidden when inside full-screen AI Workspace to preserve chat view space) */}
      {currentTab !== "ai-workspace" && (
        <Footer setCurrentTab={setCurrentTab} openLegalModal={openLegalModal} />
      )}

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalDefaultTab}
      />
    </div>
  );
}
