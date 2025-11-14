import React, { useEffect, useState } from "react";
import { Download, Calendar } from "lucide-react";
import LeadCard from "../LeadCard";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../store/slices/authSlices/authSlice";
import { fetchCarLeads } from "../../store/slices/leadsSlice";
import { useLocation, useNavigate } from "react-router-dom";

// ===================== PREMIUM POPUP =====================
const PremiumPopup = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-6 rounded-md shadow-xl w-80 text-center space-y-4 animate-scaleIn">
        <h2 className="text-lg font-semibold text-gray-800">Unlock Premium Leads</h2>

        <p className="text-sm text-gray-600 leading-tight">
          Get full access to all contact details and premium category leads by upgrading your plan.
        </p>

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-sm text-gray-700 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition"
            onClick={() => navigate("/settings/buy-packages")}
          >
            Purchase Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================== MAIN PAGE =====================
const MyLeads: React.FC = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const { leads, loading } = useSelector((state: any) => state.leads);
  const location = useLocation();

  const navigationCarId = location.state?.carId || leads.carId || null;
  const leadsCarId = leads.carId;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  // FETCH LEADS
  useEffect(() => {
    if (!user) return;

    if (navigationCarId) {
      dispatch(fetchCarLeads({ carId: navigationCarId }) as any);
    } else {
      dispatch(fetchCarLeads({ userId: user.id }) as any);
    }
  }, [dispatch, user, navigationCarId]);

  // Sync leads to filtered list
  useEffect(() => {
    if (leads) setFilteredLeads(leads);
  }, [leads]);

  // FILTER BY DATE
  const handleDateFilter = () => {
    if (!fromDate && !toDate) return setFilteredLeads(leads);

    const from = fromDate ? new Date(fromDate).getTime() : 0;
    const to = toDate ? new Date(toDate).getTime() : Date.now();

    const filtered = leads.filter((lead: any) => {
      const created = new Date(lead.createdAt).getTime();
      return created >= from && created <= to;
    });

    setFilteredLeads(filtered);
  };

  const activeCarId = navigationCarId || leadsCarId;

  useEffect(() => {
    if (leads && activeCarId) {
      const filtered = leads.filter((lead: any) => lead.carId === activeCarId);
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(leads);
    }
  }, [leads, activeCarId]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-0">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          My Leads{" "}
          <span className="text-gray-500 text-sm block lg:hidden">
            ({filteredLeads.length})
          </span>
        </h2>

        <button className="mt-3 sm:mt-0 bg-gray-800 text-white text-sm px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-700">
          <Download className="w-4 h-4" />
          Download Leads
        </button>
      </div>

      {/* DATE FILTER */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-sm shadow-sm border border-gray-200 px-4 py-3 mb-4">
        <p className="text-gray-600 text-sm">
          Total Leads: <span className="font-semibold">{filteredLeads.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-700 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Date:</span>
          </div>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-sm px-2 py-1 text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-sm px-2 py-1 text-sm"
          />
          <button
            onClick={handleDateFilter}
            className="bg-gray-800 text-white text-sm px-3 py-1 rounded-sm hover:bg-gray-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* LEADS LIST */}
      <div className="flex flex-col gap-3 mt-4">
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-100 rounded-md animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-1/3" />
                  <div className="h-3 bg-gray-300 rounded w-1/4" />
                </div>
              </div>
            ))}
          </>
        ) : filteredLeads.length > 0 ? (
          filteredLeads.map((lead, index) => {
            const isLocked = index >= 5; // first 5 free

            return (
              <div
                key={lead.enquiryId}
                className={`relative transition ${
                  isLocked ? "opacity-50 " : ""
                }`}
              >
                <LeadCard
                  name={lead.fullName}
                  city={lead.carAddress.city}
                  timeAgo={new Date(lead.createdAt).toLocaleDateString("en-IN")}
                  image={lead.userProfileUrl}
                  phone={lead.mobileNumber}
                  carId={lead.carId}
                  carName={lead.carName}
                  onLockedClick={() => {
                    if (isLocked) setShowPopup(true);
                  }}
                />

                {/* LOCK OVERLAY */}
                {isLocked && (
                  <div
                    className="absolute inset-0 bg-black/10 flex items-center justify-center cursor-pointer"
                    onClick={() => setShowPopup(true)}
                  >
                    {/* <span className="text-white text-sm bg-black/70 px-3 py-1 rounded-sm">
                      Premium Lead — Unlock Now
                    </span> */}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-6">No leads found.</p>
        )}
      </div>

      {/* POPUP */}
      {showPopup && <PremiumPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default MyLeads;


// import React, { useEffect, useState } from "react";
// import { Download, Calendar } from "lucide-react";
// import LeadCard from "../LeadCard";
// import { useDispatch, useSelector } from "react-redux";
// import { selectAuth } from "../../store/slices/authSlices/authSlice";
// import { fetchCarLeads } from "../../store/slices/leadsSlice";
// import { useLocation } from "react-router-dom";

// const MyLeads: React.FC = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector(selectAuth);
//   const { leads, loading } = useSelector((state: any) => state.leads);
//   const location = useLocation();

//   const navigationCarId = location.state?.carId || leads.carId || null;

//   const leadsCarId = leads.carId;

//   // 🔹 Local states for date filtering
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
//   const [error] = useState<string | null>(null);

//  useEffect(() => {
//   if (!user) return;

//   if (navigationCarId) {
//     // ✅ fetch leads for specific car
//     dispatch(fetchCarLeads({ carId: navigationCarId }) as any);
//   } else {
//     // ✅ fetch all leads
//    dispatch(fetchCarLeads({ userId: user}) as any );
//   }
// }, [dispatch, user, navigationCarId]);


//   useEffect(() => {
//     if (leads) setFilteredLeads(leads);
//   }, [leads]);

//   // 🔹 Date Filter Logic
//   const handleDateFilter = () => {
//     if (!fromDate && !toDate) return setFilteredLeads(leads);

//     const from = fromDate ? new Date(fromDate).getTime() : 0;
//     const to = toDate ? new Date(toDate).getTime() : Date.now();

//     const filtered = leads.filter((lead: any) => {
//       const created = new Date(lead.createdAt).getTime();
//       return created >= from && created <= to;
//     });

//     setFilteredLeads(filtered);
//   };

//   const activeCarId = navigationCarId || leadsCarId;

//   useEffect(() => {
//   if (leads && activeCarId) {
//     const filtered = leads.filter((lead: any) => lead.carId === activeCarId);
//     setFilteredLeads(filtered);
//   } else {
//     setFilteredLeads(leads);
//   }
// }, [leads, activeCarId]);

//   return (
//     <div className="w-full min-h-screen p-4 sm:p-6 lg:p-0">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//           My Leads{" "}
//           <span className="text-gray-500 text-sm block lg:hidden">
//             ({filteredLeads.length})
//           </span>
//         </h2>

//         <button className="mt-3 sm:mt-0 bg-gray-800 text-white text-sm px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-700">
//           <Download className="w-4 h-4" />
//           Download Leads
//         </button>
//       </div>

//       {/* 🔹 Filters */}
//       <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-sm shadow-sm border border-gray-200 px-4 py-3 mb-4">
//         <p className="text-gray-600 text-sm">
//           Total Leads:{" "}
//           <span className="font-semibold">{filteredLeads.length}</span>
//         </p>

//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-2 text-gray-700 text-sm">
//             <Calendar className="w-4 h-4" />
//             <span>Date:</span>
//           </div>

//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border rounded-sm px-2 py-1 text-sm"
//           />
//           <span className="text-gray-500">to</span>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border rounded-sm px-2 py-1 text-sm"
//           />
//           <button
//             onClick={handleDateFilter}
//             className="bg-gray-800 text-white text-sm px-3 py-1 rounded-sm hover:bg-gray-700"
//           >
//             Apply
//           </button>
//         </div>
//       </div>

//       {/* Leads List */}
//       <div className="flex flex-col gap-3 mt-4">
//         {loading ? (
//           <>
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-3 p-3 bg-gray-100 rounded-md animate-pulse"
//               >
//                 <div className="w-12 h-12 bg-gray-300 rounded-full" />
//                 <div className="flex-1 space-y-2">
//                   <div className="h-3 bg-gray-300 rounded w-1/3" />
//                   <div className="h-3 bg-gray-300 rounded w-1/4" />
//                 </div>
//               </div>
//             ))}
//           </>
//         ) : error ? (
//           <p className="text-center text-red-500 py-4">{error}</p>
//         ) : filteredLeads.length > 0 ? (
//           filteredLeads?.map((lead: any) => (
//             <LeadCard
//               key={lead.enquiryId}
//               name={lead.fullName}
//               city={lead.carAddress.city}
//               timeAgo={new Date(lead.createdAt).toLocaleDateString("en-IN")}
//               image={lead.userProfileUrl}
//               phone={lead.mobileNumber}
//               carId={lead.carId}
//               carName={lead.carName}
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-500 py-6">No leads found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyLeads;
