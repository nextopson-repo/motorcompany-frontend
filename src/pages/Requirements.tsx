import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RequirementCard from "../components/RequirementCard";
import type { RootState, AppDispatch } from "../store/store";
import { fetchAllRequirements, createRequirementEnquiry, deleteRequirement, type Requirement } from "../store/slices/requirementsSlice";
import { selectAuth } from "../store/slices/authSlices/authSlice";
import { Calendar1, ChevronDown, Plus } from "lucide-react";
import { openLogin } from "../store/slices/authSlices/loginModelSlice";

const Requirements: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error, totalCount } = useSelector(
    (state: RootState) => state.requirements
  );
  const { user, token } = useSelector(selectAuth);
  const [sortOption, setSortOption] = useState<string>("newToOld");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [deletingRequirementId, setDeletingRequirementId] = useState<string | null>(null);

  useEffect(() => {
    // Always fetch requirements - show them without login
    // Backend requires userId, but we handle missing userId gracefully
    dispatch(
      fetchAllRequirements({
        userId: user?.id,
        page: 1,
        limit: 20,
        sort: sortOption === "oldToNew" ? "oldToNew" : "newToOld",
      })
    );
  }, [dispatch, sortOption, user?.id]);

  const handleContact = async (requirement: Requirement) => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }

    const requirementId = requirement.requirementId || requirement.id;
    if (!requirementId) {
      console.error("Requirement ID not found");
      return;
    }

    // Create enquiry
    try {
      await dispatch(
        createRequirementEnquiry({
          userId: user.id,
          requirementId: requirementId,
        })
      ).unwrap();
    } catch (err: any) {
      console.error("Failed to create enquiry:", err);
      // Still open the phone dialer even if enquiry creation fails
    }

    // Open phone dialer
    const phoneNumber = requirement.user?.mobileNumber;
    if (phoneNumber) {
      window.location.href = `tel:+91${phoneNumber}`;
    } else {
      alert("Phone number not available");
    }
  };

  const handleDelete = async (requirementId: string) => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }

    setDeletingRequirementId(requirementId);

    try {
      await dispatch(
        deleteRequirement({
          userId: user.id,
          requirementId: requirementId,
        })
      ).unwrap();
      
      setDeletingRequirementId(null);
      
      // Refresh the requirements list
      dispatch(
        fetchAllRequirements({
          userId: user.id,
          page: 1,
          limit: 20,
          sort: sortOption === "oldToNew" ? "oldToNew" : "newToOld",
        })
      );
    } catch (err: any) {
      console.error("Failed to delete requirement:", err);
      setDeletingRequirementId(null);
    }
  };

  const handleToggleExpand = (requirementId: string) => {
    setExpandedCardId(expandedCardId === requirementId ? null : requirementId);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto my-12">
        <div className="text-center">Loading requirements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto my-12">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto my-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Requirements</h2>
          <p className="text-sm text-gray-500">Total: {totalCount}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!user || !token) {
                dispatch(openLogin());
              } else {
                navigate("/create-requirement");
              }
            }}
            className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post Requirement
          </button>
          <button
            onClick={() =>
              setSortOption(sortOption === "oldToNew" ? "newToOld" : "oldToNew")
            }
            className="text-sm border rounded-md px-4 py-2 hover:bg-gray-100 transition flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <Calendar1 className="w-4 h-4" /> Date
            </span>{" "}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Responsive Grid */}
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No requirements found.</p>
          <p className="text-sm mt-2">Be the first to post one!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
          {data
            .filter((item: Requirement) => {
              const itemId = item.requirementId || item.id || "";
              return itemId !== deletingRequirementId;
            })
            .map((item: Requirement) => {
              const cardId = item.requirementId || item.id || "";
              const isOwner = user?.id === item.user?.id;
              return (
                <RequirementCard
                  key={cardId}
                  {...item}
                  onContact={handleContact}
                  onDelete={handleDelete}
                  isExpanded={expandedCardId === cardId}
                  onToggleExpand={() => handleToggleExpand(cardId)}
                  isOwner={isOwner}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Requirements;