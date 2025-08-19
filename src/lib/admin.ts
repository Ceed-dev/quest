import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Quest } from "@/types/quest";
import { TaskSubmission } from "@/types/taskSubmission";
import { getLText } from "@/lib/i18n-data";
import type { Locale } from "@/types/i18n";

const ADMIN_LOCALE: Locale = "en";

export type OverviewStats = {
  totalQuests: number;
  totalTasks: number;
  totalSubmissions: number;
  totalUsers: number;
};

export type QuestStats = {
  id: string;
  name: string;
  projectName: string;
  taskCount: number;
  submissionCount: number;
  uniqueSubmitters: number;
  lastSubmissionDate: string;
};

export type AdminStats = {
  overview: OverviewStats;
  quests: QuestStats[];
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const [questsSnap, submissionsSnap, usersSnap] = await Promise.all([
    getDocs(collection(db, "quests")),
    getDocs(collection(db, "taskSubmissions")),
    getDocs(collection(db, "users")),
  ]);

  const quests: Quest[] = questsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamps: {
      createdAt: (doc.data().timestamps.createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().timestamps.updatedAt as Timestamp).toDate(),
    },
  })) as Quest[];

  const submissions: TaskSubmission[] = submissionsSnap.docs.map((doc) => ({
    ...doc.data(),
    timestamps: {
      submittedAt: (doc.data().timestamps.submittedAt as Timestamp).toDate(),
      approvedAt: doc.data().timestamps.approvedAt
        ? (doc.data().timestamps.approvedAt as Timestamp).toDate()
        : null,
      rejectedAt: doc.data().timestamps.rejectedAt
        ? (doc.data().timestamps.rejectedAt as Timestamp).toDate()
        : null,
    },
  })) as TaskSubmission[];

  const totalQuests = quests.length;
  const totalTasks = quests.reduce((sum, quest) => sum + quest.tasks.length, 0);
  const totalSubmissions = submissions.length;
  const totalUsers = usersSnap.size;

  const questStats: QuestStats[] = quests.map((quest) => {
    const relatedSubmissions = submissions.filter(
      (s) => s.questId === quest.id,
    );
    const uniqueUserIds = new Set(relatedSubmissions.map((s) => s.userId));
    const lastSubmissionDate = relatedSubmissions.length
      ? new Date(
          Math.max(
            ...relatedSubmissions.map((s) =>
              s.timestamps.submittedAt.getTime(),
            ),
          ),
        ).toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

    return {
      id: quest.id,
      name: getLText(quest.title, ADMIN_LOCALE),
      projectName: getLText(quest.project.name, ADMIN_LOCALE),
      taskCount: quest.tasks.length,
      submissionCount: relatedSubmissions.length,
      uniqueSubmitters: uniqueUserIds.size,
      lastSubmissionDate,
    };
  });

  return {
    overview: {
      totalQuests,
      totalTasks,
      totalSubmissions,
      totalUsers,
    },
    quests: questStats,
  };
};
