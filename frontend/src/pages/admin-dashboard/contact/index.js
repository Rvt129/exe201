import React, { useState, useEffect } from "react";
import axios from "axios";
import "./contact.css";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/support/contact",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setContacts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách liên hệ. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/support/contact/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchContacts(); // Refresh the list
    } catch (err) {
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
    }
  };

  if (loading) {
    return (
      <div className="admin-contact-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách liên hệ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-contact-page">
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-button" onClick={fetchContacts}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contact-page">
      <div className="admin-contact-header">
        <h1 className="admin-contact-title">Quản lý liên hệ</h1>
        <div className="admin-contact-desc">
          Xem và quản lý các yêu cầu liên hệ từ khách hàng
        </div>
      </div>

      <div className="contact-stats">
        <div className="stat-card">
          <h3>Tổng số liên hệ</h3>
          <p className="stat-number">{contacts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Đang chờ xử lý</h3>
          <p className="stat-number">
            {contacts.filter((contact) => contact.status === "pending").length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Đang xử lý</h3>
          <p className="stat-number">
            {
              contacts.filter((contact) => contact.status === "in-progress")
                .length
            }
          </p>
        </div>
        <div className="stat-card">
          <h3>Đã xử lý</h3>
          <p className="stat-number">
            {contacts.filter((contact) => contact.status === "resolved").length}
          </p>
        </div>
      </div>

      <div className="contacts-table-container">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Người gửi</th>
              <th>Email</th>
              <th>Chủ đề</th>
              <th>Danh mục</th>
              <th>Nội dung</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="contact-row">
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.subject}</td>
                <td>{contact.category}</td>
                <td className="message-cell">
                  <div className="message">{contact.message}</div>
                </td>
                <td>
                  <span className={`status-${contact.status}`}>
                    {contact.status === "pending" && "Chờ xử lý"}
                    {contact.status === "in-progress" && "Đang xử lý"}
                    {contact.status === "resolved" && "Đã xử lý"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {contact.status === "pending" && (
                      <button
                        className="action-btn in-progress-btn"
                        onClick={() =>
                          handleStatusUpdate(contact._id, "in-progress")
                        }
                      >
                        Bắt đầu xử lý
                      </button>
                    )}
                    {contact.status === "in-progress" && (
                      <button
                        className="action-btn resolve-btn"
                        onClick={() =>
                          handleStatusUpdate(contact._id, "resolved")
                        }
                      >
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContact;
