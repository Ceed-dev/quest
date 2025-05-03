// External Firebase Firestore functions
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// Firebase instance
import { db } from "@/lib/firebase";

// Types
import type { Quest, AggregatedStat } from "@/types/quest";

// Utility for timestamp conversion
import { convertTimestamp } from "@/utils/convertTimestamp";

/**
 * Fetch public and active quests from Firestore
 * Sorted by creation date in descending order
 *
 * TODO: Implement cursor-based pagination with `startAfter(lastDoc)` for scalability
 * TODO: In the future, extend this function to accept dynamic parameters
 * (e.g., visibility, status, category, limit) to support flexible querying from various UI contexts
 */
export const fetchQuests = async (): Promise<Quest[]> => {
  const q = query(
    collection(db, "quests"),
    where("visibility", "==", "public"),
    where("status", "==", "active"),
    orderBy("timestamps.createdAt", "desc"),
    limit(20),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,

      // Normalize period timestamps
      period: {
        start: convertTimestamp(data.period.start),
        end: convertTimestamp(data.period.end),
      },

      // Normalize created/updated timestamps
      timestamps: {
        createdAt: convertTimestamp(data.timestamps.createdAt),
        updatedAt: convertTimestamp(data.timestamps.updatedAt),
      },

      // Normalize stats (reward + task)
      stats: {
        rewardStats: {
          ...data.stats.rewardStats,
          timestamps: {
            first: {
              ...data.stats.rewardStats.timestamps.first,
              at: convertTimestamp(data.stats.rewardStats.timestamps.first.at),
            },
            last: {
              ...data.stats.rewardStats.timestamps.last,
              at: convertTimestamp(data.stats.rewardStats.timestamps.last.at),
            },
          },
        },
        taskStats: Object.entries(data.stats.taskStats || {}).reduce(
          (acc, [taskId, stat]) => {
            const s = stat as AggregatedStat;

            acc[taskId] = {
              ...s,
              timestamps: {
                first: {
                  ...s.timestamps.first,
                  at: convertTimestamp(s.timestamps.first.at),
                },
                last: {
                  ...s.timestamps.last,
                  at: convertTimestamp(s.timestamps.last.at),
                },
              },
            };

            return acc;
          },
          {} as Record<string, AggregatedStat>,
        ),
      },
    } as Quest;
  });
};
