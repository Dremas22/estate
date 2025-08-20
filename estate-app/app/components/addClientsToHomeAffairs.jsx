"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AddClientsToHomeAffairs = () => {
  const [form, setForm] = useState({ name: "", surname: "", idNumber: "" });
  const [clients, setClients] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddClient = async () => {
    const res = await fetch("http://localhost:3000/api/HomeAffairs", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      fetchClients();
      setForm({ name: "", surname: "", idNumber: "" });
    }
  };

  const fetchClients = async () => {
    const res = await fetch("http://localhost:3000/api/HomeAffairs");
    const data = await res.json();
    setClients(data);
    if (!res.ok) {
      console.error("Failed to fetch clients:", data);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const res = await fetch("http://localhost:3000/api/HomeAffairs", {
      method: "PATCH",
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      fetchClients();
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-[#ced4da] rounded-lg shadow">
      <div className=" w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
          Home Affairs
        </h1>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Name"
          className="bg-white mt-4 block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          name="surname"
          value={form.surname}
          onChange={handleChange}
          type="text"
          placeholder="Surname"
          className="bg-white mt-4 block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          name="idNumber"
          value={form.idNumber}
          onChange={handleChange}
          type="text"
          placeholder="ID Number"
          className="bg-white mt-4 block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
          onClick={handleAddClient}
        >
          Save
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-8 w-full">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Surname
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                ID Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="px-6 py-4">{client.name}</td>
                <td className="px-6 py-4">{client.surname}</td>
                <td className="px-6 py-4">{client.idNumber}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      client.status === "Deceased"
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(client.id, "Deceased")}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Deceased
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(client.id, "Alive")}
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel Deceased
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      
    </div>
  );
};

export default AddClientsToHomeAffairs;
