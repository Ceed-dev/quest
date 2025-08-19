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

import type { LocalizedText } from "@/types/i18n";
import { coerceLText } from "@/lib/i18n-data";

// Types
import type { Quest, QuestTask } from "@/types/quest";

type FirestoreQuest = {
  project: {
    name: LocalizedText;
    logoUrl: string;
  };
  title: LocalizedText;
  description?: LocalizedText;
  catchphrase?: LocalizedText;
  backgroundImageUrl: string;
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
 * Sorted by creation date in descending order
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

    return {
      id: doc.id,
      project: {
        name: coerceLText(data.project?.name),
        logoUrl: data.project?.logoUrl,
      },
      title: coerceLText(data.title),
      description: coerceLText(data.description ?? ""),
      catchphrase: coerceLText(data.catchphrase ?? ""),
      backgroundImageUrl: data.backgroundImageUrl,
      tasks: data.tasks.map((task) => ({
        id: task.id,
        label: coerceLText(task.label),
        points: task.points,
        actionButton: task.actionButton
          ? {
              label: coerceLText(task.actionButton.label),
              url: task.actionButton.url,
            }
          : undefined,
      })) as QuestTask[],
      timestamps: {
        createdAt: data.timestamps.createdAt.toDate(),
        updatedAt: data.timestamps.updatedAt.toDate(),
      },
    } as Quest;
  });
};
