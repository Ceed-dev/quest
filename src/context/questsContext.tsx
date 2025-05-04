"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Quest } from "@/types/quest";
import { fetchQuests } from "@/lib/fetchQuests";

// Define the shape of the context
type QuestsContextType = {
  quests: Quest[]; // List of all quests
  isLoading: boolean; // Fetching status
  error: Error | null; // Any fetching error
};

// Create the context
const QuestsContext = createContext<QuestsContextType | undefined>(undefined);

// Provider component
export const QuestsProvider = ({ children }: { children: ReactNode }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchQuests();
        setQuests(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <QuestsContext.Provider value={{ quests, isLoading, error }}>
      {children}
    </QuestsContext.Provider>
  );
};

// Hook for consuming the context
export const useQuestsContext = (): QuestsContextType => {
  const context = useContext(QuestsContext);
  if (!context) {
    throw new Error("useQuestsContext must be used within a QuestsProvider");
  }
  return context;
};
