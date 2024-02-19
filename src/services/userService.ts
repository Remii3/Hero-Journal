import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { User } from '../types/types';

// Assuming Firebase has been initialized elsewhere in your project
const db = getFirestore();

/**
 * Fetches user data from Firestore based on UID.
 *
 * @param {string} uid The UID of the user whose data is to be fetched.
 * @returns {Promise<User>} A promise that resolves to the user data.
 */
export async function fetchUserData(uid: string): Promise<User> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data() as User; // Cast snapshot.data() to User type
  } else {
    throw new Error('User not found');
  }
}
