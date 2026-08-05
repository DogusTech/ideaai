import { getFirestore } from 'firebase/firestore';

const firebase = {
  auth: () => {
    return getFirestore();
  },
};

export default firebase;