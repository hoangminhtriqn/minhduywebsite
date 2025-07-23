import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getPublicSettings,
  PublicSettings,
  Location,
} from "@/api/services/user/settings";

interface SettingsContextType {
  settings: PublicSettings | null;
  locations: Location[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settingsData = await getPublicSettings();
      setSettings(settingsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const locations = settings?.locations || [];

  return (
    <SettingsContext.Provider
      value={{ settings, locations, loading, refetch: fetchSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
