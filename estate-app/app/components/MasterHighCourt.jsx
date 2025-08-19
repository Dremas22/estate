"use client";
import AddClientsToBanks from "./addClientsToBanks";
import AddClientsToHomeAffairs from "./addClientsToHomeAffairs";
import Gateway from "./gateway";

const MasterHighCourtHomePage = () => {
  return (
    <div className="flex-col items-center justify-start bg-gray-100 px-6 py-10 w-full min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
        Master High Court
      </h1>
      <p className="text-center text-gray-600 text-lg mb-8">
        powered by Estate App
      </p>

      <div className="w-full max-w-7xl space-y-12">
        {/* Gateway */}
        <div>
          <Gateway />
        </div>

        {/* 2-column Grid: Home Affairs & Credit Score */}
        <div className="flex flex-col sm:flex-row sm:gap-8 gap-6 justify-center items-center">
         
            <AddClientsToHomeAffairs />
            <AddClientsToBanks />
          
        </div>
      </div>
    </div>
  );
};
export default MasterHighCourtHomePage;
