import React, { useEffect, useState } from "react";
import { Download, Calendar } from "lucide-react";
import LeadCard from "../LeadCard";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../store/slices/authSlices/authSlice";
import { fetchCarLeads } from "../../store/slices/leadsSlice";
import { useLocation } from "react-router-dom";

const MyLeads: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const { leads, loading } = useSelector((state: any) => state.leads);
  const location = useLocation();

  const navigationCarId = location.state?.carId || leads.carId || null;

  const leadsCarId = leads.carId;

  // 🔹 Local states for date filtering
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchCarLeads() as any);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (leads) setFilteredLeads(leads);
  }, [leads]);

  // 🔹 Date Filter Logic
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

  // useEffect(() => {
  //   if (!leads) {
  //     setError("Leads data not found.");
  //     setFilteredLeads([]);
  //     return;
  //   }

  //   let filtered = leads;
  //   if (carId) {
  //     filtered = leads.filter((lead: any) => lead.carId === carId);
  //     if (filtered.length === 0) {
  //       setError("No leads found for the selected car.");
  //     } else {
  //       setError(null);
  //     }
  //   } else {
  //     setError(null); 
  //   }

  //   setFilteredLeads(filtered);
  // }, [leads, carId]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-0">
      {/* Header */}
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

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-sm shadow-sm border border-gray-200 px-4 py-3 mb-4">
        <p className="text-gray-600 text-sm">
          Total Leads:{" "}
          <span className="font-semibold">{filteredLeads.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
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

      {/* Leads List */}
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
        ) : error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : filteredLeads.length > 0 ? (
          filteredLeads?.map((lead: any) => (
            <LeadCard
              key={lead.enquiryId}
              name={lead.fullName}
              city={lead.carAddress.city}
              timeAgo={new Date(lead.createdAt).toLocaleDateString("en-IN")}
              image={lead.userProfileUrl}
              phone={lead.mobileNumber}
              carId={lead.carId}
              carName={lead.carName}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No leads found.</p>
        )}
      </div>
    </div>
  );
};

export default MyLeads;
