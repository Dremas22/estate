// app/api/CheckhomeAffairs/route.js
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function POST(req) {
  try {
    const { idNumber } = await req.json();
    const snapshot = await getDocs(collection(db, "HomeAffairs"));

    const deceasedClients = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const isDeceased = data.status === "Deceased";

      // If idNumber is provided, filter by ID
      if (idNumber) {
        if (data.idNumber === idNumber && isDeceased) {
          deceasedClients.push({ id: doc.id, ...data });
        }
      } else {
        // No idNumber provided, get all deceased
        if (isDeceased) {
          deceasedClients.push({ id: doc.id, ...data });
        }
      }
    });

    if (deceasedClients.length > 0) {
      return new Response(JSON.stringify(deceasedClients), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ error: "No deceased clients found" }),
        { status: 404 }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
