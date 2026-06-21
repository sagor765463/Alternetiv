import { app } from "./firebase";
import { 
  getFirestore, 
  collection, 
  getDocs,
  getDoc,
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  query,
  updateDoc,
  increment
} from "firebase/firestore";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
const db = getFirestore(app);

// ----- Firestore Helpers -----

export async function getCollection(colName) {
  try {
    const q = query(collection(db, colName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // If index doesn't exist for orderBy, fallback to standard getDocs
    console.warn("Falling back to standard fetch without orderBy:", error.message);
    const snapshot = await getDocs(collection(db, colName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

export async function addDocument(colName, data) {
  const docRef = await addDoc(collection(db, colName), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function removeDocument(colName, id) {
  const docRef = doc(db, colName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    const fileUrl = data.panel_url || data.bypass_url || data.req_url;
    if (fileUrl) {
      await removeFile(fileUrl);
    }
  }
  
  await deleteDoc(docRef);
}

export async function updateDocument(colName, id, data) {
  const docRef = doc(db, colName, id);
  await updateDoc(docRef, data);
}

export async function getDocument(colName, id) {
  const docRef = doc(db, colName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function incrementReacts(colName, id, amount = 1) {
  const docRef = doc(db, colName, id);
  await updateDoc(docRef, {
    reacts: increment(amount)
  });
}

// ----- Storage Helpers (Uploadthing) -----

export async function uploadFile(file, folderPath) {
  if (!file) return null;
  if (file.name === "nofile.txt" || file.name === "dummy_nofile.txt") return "nofile.txt";

  try {
    const response = await utapi.uploadFiles([file]);

    if (response && response[0] && response[0].data) {
      return response[0].data.ufsUrl || response[0].data.url;
    } else {
      console.error("Uploadthing response:", JSON.stringify(response));
      const errMsg = response?.[0]?.error?.message || "Unknown Uploadthing error";
      throw new Error(`Uploadthing failed: ${errMsg}`);
    }
  } catch (error) {
    console.error("Uploadthing upload error:", error);
    throw new Error("Failed to upload file: " + error.message);
  }
}

export async function removeFile(fileUrl) {
  if (!fileUrl || fileUrl === "nofile.txt") return;

  try {
    // Extract fileKey from the Uploadthing URL
    // e.g. https://utfs.io/f/FILE_KEY or https://FILES.ufs.sh/f/FILE_KEY
    const urlParts = fileUrl.split("/f/");
    if (urlParts.length > 1) {
      const fileKey = urlParts[1].split("?")[0]; // remove query params if any
      await utapi.deleteFiles([fileKey]);
    }
  } catch (error) {
    console.error("Error deleting file from Uploadthing:", error);
  }
}
