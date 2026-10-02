import React, { useState } from "react";
import { SafetyProvider, useSafety } from "./context/SafetyContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import EvidenceModal from "./components/EvidenceModal";
import Login from "./components/Login"; 

import DashboardView from "./views/DashboardView";
import CameraInputView from "./views/CameraInputView";
import LiveMonitoringView from "./views/LiveMonitoringView";
import AlertsView from "./views/AlertsView";
import PersonnelAnomalyView from "./views/PersonnelAnomalyView";
import NearMissView from "./views/NearMissView";
import CameraHealthView from "./views/CameraHealthView";
import AnalyticsView from "./views/AnalyticsView";
import ConfigurationView from "./views/ConfigurationView";

function MainContent() {
  const { activeTab } = useSafety();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 pb-12">
      {activeTab === "dashboard" && <DashboardView />}
      {activeTab === "camera-input" && <CameraInputView />}
      {activeTab === "live-monitoring" && <LiveMonitoringView />}
      {activeTab === "alerts" && <AlertsView />}
      {activeTab === "personnel" && <PersonnelAnomalyView />}
      {activeTab === "near-miss" && <NearMissView />}
      {activeTab === "camera-health" && <CameraHealthView />}
      {activeTab === "analytics" && <AnalyticsView />}
      {activeTab === "config" && <ConfigurationView />}
    </main>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <EvidenceModal />
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <SafetyProvider>
      <AppLayout />
    </SafetyProvider>
  );
}