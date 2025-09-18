// -----------------------------------------------------------------------------
// Fetch quests from Firestore (descending by createdAt, max 20).
// -----------------------------------------------------------------------------

import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { LocalizedText } from "@/types/i18n";
import { coerceLText } from "@/lib/i18n-data";

import type { Quest, QuestTask, QuestImage } from "@/types/quest";

/** Firestore document shape */
type FirestoreQuest = {
  project: {
    name: LocalizedText;
    logoUrl: string;
  };
  title: LocalizedText;
  description?: LocalizedText;
  catchphrase?: LocalizedText;

  backgroundImages: QuestImage[];

  tasks: {
    id: string;
    label: LocalizedText;
    points: number;
    actionButton?: {
      label: LocalizedText;
      url: string;
    };
  }[];

  /** Quest-specific settings stored in Firestore */
  settings: {
    heroCarouselOrder: number | null;
    isVisible: boolean;
  };

  timestamps: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
};

/**
 * Fetch quests from Firestore
 * - Sorted by creation date (DESC)
 * - Limited to 20 docs
 * - Maps Firestore shape to domain `Quest`
 */
export const fetchQuests = async (): Promise<Quest[]> => {
  const q = query(
    collection(db, "quests"),
    orderBy("timestamps.createdAt", "desc"),
    limit(20),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => {
      const data = doc.data() as FirestoreQuest;

      // Map tasks with localized labels preserved
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

      // Compose domain Quest
      const quest: Quest = {
        id: doc.id,
        project: {
          name: coerceLText(data.project.name),
          logoUrl: data.project.logoUrl,
        },
        title: coerceLText(data.title),
        description: coerceLText(data.description ?? ""),
        catchphrase: coerceLText(data.catchphrase ?? ""),
        backgroundImages: data.backgroundImages,
        tasks,
        settings: {
          heroCarouselOrder: data.settings.heroCarouselOrder,
          isVisible: data.settings.isVisible,
        },
        timestamps: {
          createdAt: data.timestamps.createdAt.toDate(),
          updatedAt: data.timestamps.updatedAt.toDate(),
        },
      };

      return quest;
    })
    .filter((quest) => quest.settings.isVisible);
};
