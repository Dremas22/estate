import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// POST: Add new client
export async function POST(req) {
  try {
    const client = await req.json();

    if (!client.name || !client.surname || !client.idNumber) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // Save the correct boolean values from the client input
    const docRef = await addDoc(collection(db, "Deeds-Office"), {
      name: client.name,
      surname: client.surname,
      idNumber: client.idNumber,
      properties: !!client.properties,
      
    });

    return new Response(
      JSON.stringify({ message: "Client added", id: docRef.id }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// GET: Fetch all clients
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "Deeds-Office"));
    const clients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(clients), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
