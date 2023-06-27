import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "YOUR API KEY",
  authDomain: "YOUR AUTH DOMAIN",
  projectId: "YOUR PROJECT ID",
  storageBucket: "YOUR STORAGE BUCKET",
  messagingSenderId: "YOUR MESSAGING SENDER ID",
  appId: "YOUR APP ID",
};
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const PopupSignIn = () => signInWithPopup(auth, provider);
export const RedirectSignIn = () => signInWithRedirect(auth, provider);

export const db = getFirestore();
export const addCollectionAndDocuments = async (
  uid,
  docTitle,
  objectsToAdd
) => {
  const userDocRef = doc(db, "users", uid);
  const memoryListCollectionRef = collection(userDocRef, "memory-list");
  const memoryListItemRef = doc(memoryListCollectionRef, docTitle);
  await setDoc(memoryListItemRef, objectsToAdd, { merge: true });
  console.log("done");
};

export const deleteCollectionAndDocuments = async (
  uid,
  docTitle
) => {
  const userDocRef = doc(db, "users", uid);
  const memoryListCollectionRef = collection(userDocRef, "memory-list");
  const memoryListItemRef = doc(memoryListCollectionRef, docTitle);
  await deleteDoc(memoryListItemRef);
  console.log("dokumen telah dihapus");
};

export const addUser = async (uid, objectsToAdd) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, objectsToAdd, { merge: true });
  console.log("done add user");
};

export const updateDocument = async (uid, docTitle, objectsToUpdate) => {
  const userDocRef = doc(db, "users", uid);
  const memoryListCollectionRef = collection(userDocRef, "memory-list");
  const memoryListItemRef = doc(memoryListCollectionRef, docTitle);

  await setDoc(memoryListItemRef, objectsToUpdate, { merge: true });
  console.log("done");
};

export const getList = async (uid, docTitle) => {
  const userDocRef = doc(db, "users", uid);
  const memoryListItemRef = doc(
    collection(userDocRef, "memory-list"),
    docTitle
  );
  const docSnapshot = await getDoc(memoryListItemRef);
  if (docSnapshot.exists()) {
    console.log("getList", docSnapshot.data());
    const data = docSnapshot.data();
    return data;
  } else {
    console.log("tidak ada data");
    return { items: [] };
  }
};

export const getUser = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const docSnapshot = await getDoc(userDocRef);
  if (docSnapshot.exists()) {
    return "User already exists";
  } else {
    return "New user";
  }
};

export const getUserField = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const docSnapshot = await getDoc(userDocRef);
  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else {
    return "undefined";
  }
};

export const signOutUser = async () => await signOut(auth);
