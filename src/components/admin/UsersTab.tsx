import { useState, useMemo, useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { deleteUser as deleteUserLocal } from "../../store/slices/appSlice";
import { useUsers } from "../../hooks/useApi";
import { UserApiService } from "../../services/api";
import { LucideRefreshCw } from "lucide-react";

export default function UsersTab() {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const params = useMemo(() => ({ search: appliedQuery }), [appliedQuery]);
  const { users, loading, error, refetch } = useUsers(params);
  const [refreshing, setRefreshing] = useState(false);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return (
      <>
        {before}
        <mark className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
          {match}
        </mark>
        {after}
      </>
    );
  };

  // Live search with debounce
  useEffect(() => {
    const id = setTimeout(() => setAppliedQuery(query.trim()), 400);
    return () => clearTimeout(id);
  }, [query]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    const start = Date.now();
    await refetch();
    const elapsed = Date.now() - start;
    const remaining = 2500 - elapsed;
    if (remaining > 0) {
      setTimeout(() => setRefreshing(false), remaining);
    } else {
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const ok = await UserApiService.deleteUser(id);
    if (ok.success) {
      dispatch(deleteUserLocal(id));
      refetch();
    } else {
      alert(ok.error || "Failed to delete user");
    }
  };

  return (
    <div className="w-screen lg:w-auto px-4 py-2 lg:py-0">
      <div className="flex  flex-col lg:flex-row lg:justify-between ">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold mb-2 whitespace-nowrap">
            Temporary Users
          </h3>
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-busy={loading || refreshing}
            title={loading || refreshing ? "Refreshing..." : "Refresh"}
            className="px-3 py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed md:hidden"
          >
            <LucideRefreshCw
              className={loading || refreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
        <div className="flex  sm:items-center sm:gap-2 mb-3">
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-busy={loading || refreshing}
            title={loading || refreshing ? "Refreshing..." : "Refresh"}
            className="px-3 py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hidden md:block"
          >
            <LucideRefreshCw
              className={loading || refreshing ? "animate-spin" : ""}
            />
          </button>

          <div className="flex w-full pt-4 lg:pt-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or mobile"
              className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="ml-4 sm:mt-0 flex items-center gap-2">
              <button
                onClick={() => {
                  setQuery("");
                  setAppliedQuery("");
                  refetch();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      {loading && <div className="text-gray-600 mb-3">Loading users...</div>}
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-600 uppercase tracking-wider">
              <th className="px-4 py-3">Full Name</th>
              {/* <th className="px-4 py-3">Email</th> */}
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">User Type</th>
              <th className="px-4 py-3 hidden lg:block">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  {highlightMatch(user.fullName || "", query)}
                </td>
                {/* <td className="px-4 py-4">{user.email || "-"}</td> */}
                <td className="px-4 py-4">{user.mobileNumber}</td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.userType === "Owner"
                        ? "bg-blue-100 text-blue-700"
                        : user.userType === "Dealer"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {user.userType}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:block">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
