import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "@/types/user";

/**
 * Partially update the given user's social IDs in Firestore.
 */
export const updateUserSocialIds = async (
  user: User,
  newSocialIds: Partial<{ x: string; discord: string }>,
) => {
  if (!user?.walletAddress) return;

  const ref = doc(db, "users", user.walletAddress);

  const prevSocialIds = user.socialIds || {};
  const updatedSocialIds = { ...prevSocialIds, ...newSocialIds };

  await updateDoc(ref, {
    socialIds: updatedSocialIds,
    "timestamps.updatedAt": new Date(),
  });
};
