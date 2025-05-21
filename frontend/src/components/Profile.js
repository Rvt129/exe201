import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const defaultProfile = {
  name: "Nguyen Van A",
  email: "nguyenvana@gmail.com",
  gender: "",
  phone: "",
  birthday: "",
  avatar: "/images/default-avatar.png", // Placeholder image
  addresses: [{ id: 1, label: "Nhà", detail: "Mặc định", isDefault: true }],
};

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditing(true);
  const handleSave = () => setEditing(false);

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setProfile((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses,
          { id: Date.now(), label: newAddress, detail: "", isDefault: false },
        ],
      }));
      setNewAddress("");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar} alt="avatar" />
        </div>
        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>
        <button
          className="order-history-btn"
          onClick={() => navigate("/orders")}
        >
          Đơn hàng của tôi
        </button>
        <button
          className="edit-btn"
          onClick={editing ? handleSave : handleEdit}
        >
          {editing ? "Lưu" : "Sửa"}
        </button>
      </div>

      <div className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>Tên</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Nhập tên"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={profile.email} disabled />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Giới tính</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              value={profile.birthday}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Nhập ngày sinh"
            />
          </div>
        </div>
      </div>

      <div className="address-section">
        <h3>Địa chỉ giao hàng của tôi</h3>
        <div className="address-list">
          {profile.addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-item${addr.isDefault ? " default" : ""}`}
            >
              <span className="address-icon">🏠</span>
              <span>{addr.label}</span>
              {addr.isDefault && (
                <span className="address-default">Mặc định</span>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <div className="add-address-row">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Thêm địa chỉ giao hàng"
            />
            <button onClick={handleAddAddress}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
