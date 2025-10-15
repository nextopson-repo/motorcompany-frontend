import React, { useState } from "react";
import { Users, Car, BarChart3, Settings, Menu, X } from "lucide-react";
import Navbar from "../layout/Navbar";
import CarListing from "../cars/CarListing";
import UsersTab from "./UsersTab";
import { useUsers, useVehicles } from "../../hooks/useApi";

const AdminPanel: React.FC = () => {
  const { vehicles } = useVehicles();
  const { users } = useUsers();
  const [activeTab, setActiveTab] = useState<
    "vehicles" | "users" | "dashboard"
  >("vehicles");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: "vehicles", label: "Vehicles", icon: Car, count: vehicles.length },
    { id: "users", label: "Users", icon: Users, count: users.length },
    { id: "dashboard", label: "Dashboard", icon: BarChart3, count: null },
  ];

  const renderTabContent = () => {

    const num = vehicles.reduce((sum, v) => sum + v.carPrice, 0);
    
    function formatCompactINR(num) {
      if (isNaN(num)) return "₹0";
      num = Math.floor(num);

      if (num >= 1e7) {
        // Crore
        return (num / 1e7).toFixed(2).replace(/\.00$/, "") + "Cr";
      } else if (num >= 1e5) {
        // Lakh
        return (num / 1e5).toFixed(2).replace(/\.00$/, "") + "L";
      } else if (num >= 1e3) {
        // Thousand
        return (num / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
      } else {
        // Below 1,000
        return num.toString();
      }
    }

    switch (activeTab) {
      case "vehicles":
        return <CarListing />;
      case "users":
        return <UsersTab />;
      case "dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Vehicles
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {vehicles.length}
                    </p>
                  </div>
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {/* {vehicles.reduce((sum, v) => sum + v.carPrice, 0).toLocaleString()} */}
                      {formatCompactINR(num)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Avg. Price
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹
                      {vehicles.length > 0
                        ? Math.round(
                            vehicles.reduce((sum, v) => sum + v.carPrice, 0) /
                              vehicles.length
                          ).toLocaleString()
                        : 0}
                    </p>
                  </div>
                  <Settings className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <CarListing />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(
                        tab.id as "vehicles" | "users" | "dashboard"
                      );
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </div>
                    {tab.count !== null && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AdminPanel;
