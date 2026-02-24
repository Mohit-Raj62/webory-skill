import React, { useState } from "react";
import "./EnquiryManagement.css";

const EnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyId: "",
    message: "",
    status: "pending",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnquiries((prev) => [...prev, { ...formData, id: Date.now() }]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      propertyId: "",
      message: "",
      status: "pending",
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
      )
    );
  };

  const handleDelete = (id) => {
    setEnquiries((prev) => prev.filter((enquiry) => enquiry.id !== id));
  };

  return (
    <div className="enquiry-management">
      <h2>Enquiry Management</h2>

      <form onSubmit={handleSubmit} className="enquiry-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Property ID:</label>
          <input
            type="text"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Enquiry</button>
      </form>

      <div className="enquiries-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Property ID</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.name}</td>
                <td>{enquiry.email}</td>
                <td>{enquiry.phone}</td>
                <td>{enquiry.propertyId}</td>
                <td>{enquiry.message}</td>
                <td>
                  <select
                    value={enquiry.status}
                    onChange={(e) =>
                      handleStatusChange(enquiry.id, e.target.value)
                    }
                    className={`status-${enquiry.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(enquiry.id)}
                    className="delete-btn"
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
};

export default EnquiryManagement;
