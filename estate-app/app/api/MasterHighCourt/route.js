import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    const docRef = await addDoc(collection(db, "masterOfHighCourt"), body);

    return NextResponse.json({ id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error saving client:", error);
    return NextResponse.json({ error: "Failed to save client" }, { status: 500 });
  }
}



