import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface PartnerConfig {
  name: string;
  code: string;
  currency: string;
  brandingLabel: string;
  enabled: boolean;
}

export interface MatrixApp {
  id: string;
  name: string;
  currency: string;
  status: "Connected" | "Not connected" | "Disabled";
  partnerCode: string;
  placement: "Wallet screen" | "Withdraw menu" | "Home";
}

interface BwiState {
  partner: PartnerConfig;
  apps: MatrixApp[];
  savePartner: (partner: PartnerConfig) => void;
  updateApp: (id: string, changes: Partial<MatrixApp>) => void;
}

const initialPartner: PartnerConfig = {
  name: "[Partner]",
  code: "",
  currency: "[CCY]",
  brandingLabel: "[Partner]",
  enabled: true,
};

const initialApps: MatrixApp[] = [
  {
    id: "cardgoal",
    name: "CardGoal",
    currency: "NGN",
    status: "Connected",
    partnerCode: "CG",
    placement: "Withdraw menu",
  },
  {
    id: "tbay",
    name: "Tbay",
    currency: "GHS",
    status: "Disabled",
    partnerCode: "TB",
    placement: "Wallet screen",
  },
  {
    id: "new-partner",
    name: "New Partner App",
    currency: "[CCY]",
    status: "Not connected",
    partnerCode: "",
    placement: "Wallet screen",
  },
];

const BwiContext = createContext<BwiState | null>(null);

export function BwiProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState(initialPartner);
  const [apps, setApps] = useState(initialApps);

  const savePartner = (nextPartner: PartnerConfig) => {
    setPartner(nextPartner);
    setApps((current) =>
      current.map((app) =>
        app.id === "new-partner"
          ? {
              ...app,
              name: nextPartner.name || "[Partner]",
              currency: nextPartner.currency || "[CCY]",
              partnerCode: nextPartner.code,
              status: nextPartner.enabled ? app.status : "Disabled",
            }
          : app,
      ),
    );
  };

  const updateApp = (id: string, changes: Partial<MatrixApp>) => {
    setApps((current) =>
      current.map((app) => (app.id === id ? { ...app, ...changes } : app)),
    );
  };

  const value = useMemo(
    () => ({ partner, apps, savePartner, updateApp }),
    [partner, apps],
  );

  return <BwiContext.Provider value={value}>{children}</BwiContext.Provider>;
}

export function useBwi() {
  const context = useContext(BwiContext);
  if (!context) throw new Error("useBwi must be used inside BwiProvider");
  return context;
}