import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Input, Button } from "../components/ui";
import type { MainLayoutContext } from "../layouts/MainLayout";

export default function SettingsPage() {
  const { showToast } = useOutletContext<MainLayoutContext>();
  const [brandName, setBrandName] = useState("HimShakti Organic");

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="border-b border-outline-border pb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight uppercase">Workspace Settings</h1>
        <p className="text-[11px] sm:text-xs text-secondary-text mt-1">
          Customize exporter brand profiles and default workspace preferences.
        </p>
      </div>

      <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
        <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
          Exporter Profile
        </h3>

        <div className="space-y-4">
          <Input
            label="Exporter Brand Name"
            id="settings-brand-name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />

          <Button variant="primary" onClick={() => showToast("Brand settings saved!", "success")}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
