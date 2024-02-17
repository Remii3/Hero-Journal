import { Timestamp } from 'firebase/firestore';

export function convertTimestampToDate(timestamp: Timestamp): string {
  return new Date(timestamp.seconds * 1000).toISOString().split('T')[0];
}
