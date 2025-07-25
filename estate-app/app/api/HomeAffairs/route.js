import { db } from "@/lib/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export async function POST(req) {
  try {
    const data = await req.json();
    const docRef = await addDoc(collection(db, "HomeAffairs"), data);
    return new Response(JSON.stringify({ id: docRef.id }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "HomeAffairs"));
    const clients = [];
    querySnapshot.forEach((doc) => {
      clients.push({ id: doc.id, ...doc.data() });
    });
    return new Response(JSON.stringify(clients), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// ✅ Add this for updating status
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();
    const docRef = doc(db, "HomeAffairs", id);
    await updateDoc(docRef, { status });
    return new Response(JSON.stringify({ message: "Status updated" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
