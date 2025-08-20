"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Gateway = () => {
  const router = useRouter();
  const [clients, setClients] = useState([]); // now plural
  const [error, setError] = useState("");
  const [banksData, setBanksData] = useState(null);
  const [deedsData, setDeedsData] = useState(null);
  const [insurancesData, setInsurancesData] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    fetchAllDeceased();
  }, []);

  const fetchAllDeceased = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/CheckhomeAffairs", {
        method: "POST",
        body: JSON.stringify({}), // no ID sent
      });
      const data = await res.json();
      if (res.ok) {
        setClients(data); // assuming it's an array
      } else {
        setError(data.error || "Failed to fetch deceased people.");
      }
    } catch (err) {
      setError("Network error occurred.");
      console.error(err);
    }
  };

  //checks if deceased has bank accounts
  const handleCheckBanks = async (client) => {
    try {
      const res = await fetch("http://localhost:3000/api/Banks");
      const allClients = await res.json();

      const found = allClients.find((c) => c.idNumber === client.idNumber);

      if (!found) {
        setBanksData({ hasAssets: false });
      } else {
        const assets = [];
        if (found.bankAccount || found.bankAccounts)
          assets.push("Bank Account");

        setBanksData({
          hasAssets: assets.length > 0,
          assets,
          ...found,
        });
      }

      setShowOverlay(true);
    } catch (err) {
      console.error("Failed to fetch banks", err);
    }
  };

  // checks if deceased has properties at the deeds officce
  const handleCheckDeedsOffce = async (client) => {
    try {
      const res = await fetch("http://localhost:3000/api/DeedsOffice");
      const allClients = await res.json();

      const found = allClients.find((c) => c.idNumber === client.idNumber);

      if (!found) {
        setDeedsData({ hasAssets: false });
      } else {
        const assets = [];
        if (found.properties || found.properties) assets.push("Properties");

        setDeedsData({
          hasAssets: assets.length > 0,
          assets,
          ...found,
        });
      }

      setShowOverlay(true);
    } catch (err) {
      console.error("Failed to fetch Properties", err);
    }
  };

  // checks if deceased has insurances at the deeds officce
  const handleCheckInsurances = async (client) => {
    try {
      const res = await fetch("http://localhost:3000/api/Insurances");
      const allClients = await res.json();

      const found = allClients.find((c) => c.idNumber === client.idNumber);

      if (!found) {
        setInsurancesData({ hasAssets: false });
      } else {
        const assets = [];
        if (found.properties || found.properties) assets.push("Insurances");

        setInsurancesData({
          hasAssets: assets.length > 0,
          assets,
          ...found,
        });
      }

      setShowOverlay(true);
    } catch (err) {
      console.error("Failed to fetch Properties", err);
    }
  };

  const handleCheckAssets = (client) => {
    handleCheckBanks(client);
    handleCheckDeedsOffce(client);
    handleCheckInsurances(client);
  };

  // inside Gateway component

  // save deceased client to firebase (Master High Court)
  const handleSaveDeceasedClientsData = async (client) => {
    try {
      const res = await fetch("http://localhost:3000/api/MasterHighCourt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });

      if (!res.ok) {
        const text = await res.text(); // don’t force JSON if error
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      alert(
        `Client ${client.name} ${client.surname} saved successfully! (id: ${data.id})`
      );
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Error saving client data. Check console for details.");
    }
  };

  return (
    <div className="mt-10 items-center justify-center bg-gray-50 px-4">
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      {clients.length > 0 && (
        <div className="overflow-x-auto mt-6 max-w-5xl mx-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
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
              {clients.map((client, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="px-6 py-4">{client.name}</td>
                  <td className="px-6 py-4">{client.surname}</td>
                  <td className="px-6 py-4">{client.idNumber}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-sm bg-red-200 text-red-800">
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCheckAssets(client)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      view assets
                    </button>
                    <button
                      onClick={() => handleSaveDeceasedClientsData(client)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 ml-5"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Assests Info:
            </h2>
            {banksData?.hasAssets ? (
              <div className="space-y-2 text-center">
                <p className="text-gray-700">
                  <strong>
                    {banksData.name} {banksData.surname}
                  </strong>{" "}
                  had the following assets:
                </p>
                <ul className="text-left list-disc list-inside">
                  {banksData.assets.map((asset, index) => (
                    <li key={index}>{asset}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-700">
                This deceased has no banks assets recorded.
              </p>
            )}
            {deedsData?.hasAssets ? (
              <div className="space-y-2 text-center">
                <p className="text-gray-700">
                  <strong>
                    {deedsData.name} {deedsData.surname}
                  </strong>{" "}
                  had the following assets:
                </p>
                <ul className="text-left list-disc list-inside">
                  {deedsData.assets.map((asset, index) => (
                    <li key={index}>{asset}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-700">
                This deceased has no properties recorded.
              </p>
            )}
            {insurancesData?.hasAssets ? (
              <div className="space-y-2 text-center">
                <p className="text-gray-700">
                  <strong>
                    {insurancesData.name} {insurancesData.surname}
                  </strong>{" "}
                  had the following assets:
                </p>
                <ul className="text-left list-disc list-inside">
                  {insurancesData.assets.map((asset, index) => (
                    <li key={index}>{asset}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-700">
                This deceased has no Insurance assets recorded.
              </p>
            )}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowOverlay(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gateway;
