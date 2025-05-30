import { db } from "@/lib/firebase";
import { User } from "@/types/user";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Params = {
  walletAddress: string;
  email: string;
};

export async function handleCreateUser({
  walletAddress,
  email,
}: Params): Promise<boolean> {
  if (!walletAddress || !email) return false;

  const userRef = doc(db, "users", walletAddress);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: User = {
      email,
      socialIds: {
        x: "",
        discord: "",
      },
      timestamps: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    await setDoc(userRef, newUser);
    return true;
  }

  return false;
}
