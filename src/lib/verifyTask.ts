import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateVerificationId } from "@/utils/hash";

export async function saveTaskVerification(
  walletAddress: string,
  questId: string,
  taskId: string,
): Promise<{ success: boolean; alreadyExists: boolean }> {
  const docId = await generateVerificationId(walletAddress, questId, taskId);
  const ref = doc(db, "verifications", docId);
  const existingSnap = await getDoc(ref);

  if (existingSnap.exists()) {
    return { success: false, alreadyExists: true };
  }

  await setDoc(ref, {
    walletAddress,
    questId,
    taskId,
    createdAt: new Date(),
  });

  return { success: true, alreadyExists: false };
}
