"use client";

import React, { useState, useEffect } from "react";

const AddClientsToCreditscore = () => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    idNumber: "",
    bankAccounts: false,
    properties: false,
    policies: false,
  });

  const [clientCredits, setClientCredits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddClient = async () => {
    setLoading(true);
    setError(null);
    try {
      const newClient = { ...form };

      const res = await fetch("/api/Creditscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add client");
      }

      await fetchClientsCredit();
      setForm({
        name: "",
        surname: "",
        idNumber: "",
        bankAccounts: false,
        properties: false,
        policies: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsCredit = async () => {
    try {
      const res = await fetch("/api/Creditscore");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch clients");
      setClientCredits(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchClientsCredit();
  }, []);

  return (
    <div className="bg-[#ced4da] p-4 sm:p-6 w-full max-w-screen-xl mx-auto mt-10 rounded-lg shadow">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Institutions
        </h1>

        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            name="surname"
            value={form.surname}
            onChange={handleChange}
            type="text"
            placeholder="Surname"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            type="text"
            placeholder="ID Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <div className="flex flex-col sm:flex-row sm:gap-6 gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="bankAccounts"
                checked={form.bankAccounts}
                onChange={handleChange}
              />
              Has Bank Account
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="policies"
                checked={form.policies}
                onChange={handleChange}
              />
              Has Policy
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="properties"
                checked={form.properties}
                onChange={handleChange}
              />
              Has Property
            </label>
          </div>

          <button
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
            onClick={handleAddClient}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </div>

      <div className="mt-8 overflow-x-auto w-full">
        <table className="min-w-full text-sm text-left border border-gray-300 bg-white rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Surname</th>
              <th className="px-4 py-3">ID Number</th>
              <th className="px-4 py-3">Bank Accounts</th>
              <th className="px-4 py-3">Policies</th>
              <th className="px-4 py-3">Properties</th>
            </tr>
          </thead>
          <tbody>
            {clientCredits.length > 0 ? (
              clientCredits.map((client) => (
                <tr key={client.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{client.name}</td>
                  <td className="px-4 py-3">{client.surname}</td>
                  <td className="px-4 py-3">{client.idNumber}</td>
                  <td className="px-4 py-3">
                    {client.bankAccounts ? "Yes" : "None"}
                  </td>
                  <td className="px-4 py-3">
                    {client.policies ? "Yes" : "None"}
                  </td>
                  <td className="px-4 py-3">
                    {client.properties ? "Yes" : "None"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No clients added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddClientsToCreditscore;
