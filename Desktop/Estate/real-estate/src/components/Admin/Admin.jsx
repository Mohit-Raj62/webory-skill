import React, { useState } from "react";
import "./Admin.css";
import PropertyManagement from "./PropertyManagement";
import UserManagement from "./UserManagement";
import EnquiryManagement from "./EnquiryManagement";
import { useUser } from "../../context/UserContext";

const Admin = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("properties");

  // If user is not logged in or not an admin, don't show admin panel
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <section id="admin" className="admin-wrapper">
      <div className="admin-container">
        <div className="admin-sidebar">
          <h2>Admin Panel</h2>
          <nav>
            <button
              className={activeTab === "properties" ? "active" : ""}
              onClick={() => setActiveTab("properties")}
            >
              Properties
            </button>
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={activeTab === "enquiries" ? "active" : ""}
              onClick={() => setActiveTab("enquiries")}
            >
              Enquiries
            </button>
          </nav>
        </div>
        <div className="admin-content">
          {activeTab === "properties" && <PropertyManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "enquiries" && <EnquiryManagement />}
        </div>
      </div>
    </section>
  );
};

export default Admin;
