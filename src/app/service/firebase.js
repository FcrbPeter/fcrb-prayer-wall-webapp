import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: "AIzaSyAjL6fsqUuTVAuh4_iYuQ732GAqm-sRvME",
	authDomain: "fcrb-prayer-wall.firebaseapp.com",
	projectId: "fcrb-prayer-wall",
	storageBucket: "fcrb-prayer-wall.appspot.com",
	messagingSenderId: "471892166684",
	appId: "1:471892166684:web:ff545185d0c6be9a8b77d9",
	measurementId: "G-795TX3PTN5"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseAnalytics = getAnalytics(firebaseApp);

export const addPrayNote = async ({name, type, content}) => {
	const key = collection(firebaseFirestore, 'praynotes');
	return await addDoc(key, {
		name, type, content,
		created: new Date(),
	});
}

export const listenPrayNotes = (listener) => {
	const coll = collection(firebaseFirestore, 'praynotes');
	const q = query(
		coll,
		where('created', '>=', new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)),
		orderBy('created', 'desc')
	);
	return onSnapshot(q, listener);
}
