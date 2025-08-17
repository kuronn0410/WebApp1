// store/surveyStore.js
import { create } from 'zustand';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const useSurveyStore = create((set) => ({
  surveys: [],
  subscribeSurveys: () => {
    const unsub = onSnapshot(collection(db, 'surveys'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ surveys: list });
    });
    return unsub;
  }
}));
