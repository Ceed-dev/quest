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

// Types
import type { Quest, QuestTask } from "@/types/quest";

// Firestore raw type (for incoming data)
type FirestoreQuest = Omit<Quest, "id" | "timestamps" | "tasks"> & {
  timestamps: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
  tasks: {
    id: string;
    label: string;
    points: number;
  }[];
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
        name: data.project.name,
        logoUrl: data.project.logoUrl,
      },
      title: data.title,
      description: data.description,
      catchphrase: data.catchphrase,
      backgroundImageUrl: data.backgroundImageUrl,
      tasks: data.tasks.map((task) => ({
        id: task.id,
        label: task.label,
        points: task.points,
      })) as QuestTask[],
      timestamps: {
        createdAt: data.timestamps.createdAt.toDate(),
        updatedAt: data.timestamps.updatedAt.toDate(),
      },
    } as Quest;
  });
};
