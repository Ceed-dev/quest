// -----------------------------------------------------------------------------
// Fetch quests from Firestore (descending by createdAt, max 20).
// Backward compatible: prefers `backgroundImages` and falls back to legacy
// `backgroundImageUrl` by wrapping it as a "wide" usage image.
// -----------------------------------------------------------------------------

import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  Timestamp,
} from "firebase/firestore";

// Firebase instance
import { db } from "@/lib/firebase";

// i18n helpers
import type { LocalizedText } from "@/types/i18n";
import { coerceLText } from "@/lib/i18n-data";

// Domain types
import type { Quest, QuestTask, QuestImage } from "@/types/quest";

/** Firestore document shape (kept backward compatible) */
type FirestoreQuest = {
  project: {
    name: LocalizedText;
    logoUrl: string;
  };
  title: LocalizedText;
  description?: LocalizedText;
  catchphrase?: LocalizedText;

  /** New field (preferred) */
  backgroundImages?: QuestImage[];
  /** Legacy field (fallback) */
  backgroundImageUrl?: string;

  tasks: {
    id: string;
    label: LocalizedText;
    points: number;
    actionButton?: {
      label: LocalizedText;
      url: string;
    };
  }[];

  timestamps: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
};

/**
 * Fetch quests from Firestore
 * - Sorted by creation date (desc)
 * - Limited to 20 docs
 * - Returns domain `Quest[]`
 */
export const fetchQuests = async (): Promise<Quest[]> => {
  const q = query(
    collection(db, "quests"),
    orderBy("timestamps.createdAt", "desc"),
    limit(20),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as FirestoreQuest;

    // Prefer array-based field; fallback to legacy single URL as "wide"
    const backgroundImages: QuestImage[] =
      data.backgroundImages && data.backgroundImages.length > 0
        ? data.backgroundImages
        : data.backgroundImageUrl
          ? [{ url: data.backgroundImageUrl, usage: "wide" }]
          : [];

    const tasks: QuestTask[] = data.tasks.map((task) => ({
      id: task.id,
      label: coerceLText(task.label),
      points: task.points,
      actionButton: task.actionButton
        ? {
            label: coerceLText(task.actionButton.label),
            url: task.actionButton.url,
          }
        : undefined,
    }));

    const quest: Quest = {
      id: doc.id,
      project: {
        name: coerceLText(data.project?.name),
        logoUrl: data.project?.logoUrl,
      },
      title: coerceLText(data.title),
      description: coerceLText(data.description ?? ""),
      catchphrase: coerceLText(data.catchphrase ?? ""),
      backgroundImages, // ← unified field
      tasks,
      timestamps: {
        createdAt: data.timestamps.createdAt.toDate(),
        updatedAt: data.timestamps.updatedAt.toDate(),
      },
    };

    return quest;
  });
};
