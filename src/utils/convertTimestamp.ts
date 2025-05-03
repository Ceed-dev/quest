import { Timestamp } from "firebase/firestore";

/**
 * Convert Firestore Timestamp or Date to JavaScript Date
 */
export const convertTimestamp = (value: unknown): Date | null => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
};
