
import { create } from 'zustand';
//（状態管理ライブラリ）
// create() で作ったストアを React コンポーネント内で呼び出すと、
//そのストアが持っている state と actions を取得できます。
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const useSurveyStore = create((set) => ({
  surveys: [],//配列名
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
