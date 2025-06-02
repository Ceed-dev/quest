import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateSHA256 } from "@/utils/hash";
import type { TaskSubmission } from "@/types/taskSubmission";

export async function fetchTaskSubmission({
  userId,
  questId,
  taskId,
}: {
  userId: string;
  questId: string;
  taskId: string;
}): Promise<TaskSubmission | null> {
  const docId = await generateSHA256(`${userId}-${questId}-${taskId}`);
  const docRef = doc(db, "taskSubmissions", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    return {
      userId: data.userId,
      questId: data.questId,
      taskId: data.taskId,
      imageUrl: data.imageUrl,
      points: data.points,
      status: data.status,
      timestamps: {
        submittedAt: data.timestamps.submittedAt.toDate(),
        approvedAt: data.timestamps.approvedAt
          ? data.timestamps.approvedAt.toDate()
          : null,
        rejectedAt: data.timestamps.rejectedAt
          ? data.timestamps.rejectedAt.toDate()
          : null,
      },
    } as TaskSubmission;
  } else {
    return null;
  }
}
