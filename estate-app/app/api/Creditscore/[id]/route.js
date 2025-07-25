//api/Creditscore/[id]/route.js
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const updates = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing client id" }), { status: 400 });
    }

    // Force only valid fields
    const validUpdates = {
      bankAccounts: Boolean(updates.bankAccounts),
      properties: Boolean(updates.properties),
      policies: Boolean(updates.policies),
    };

    const clientDocRef = doc(db, "Creditscore", id);
    await updateDoc(clientDocRef, validUpdates);

    return new Response(JSON.stringify({ message: "Updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
