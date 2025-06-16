import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  updateUserAddress,
} from "../../../services/users";
import "./Profile.css";

function Profile() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    joinDate: "",
  });
  const [editInfo, setEditInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [editAddress, setEditAddress] = useState({
    street: "",
    ward: "",
    district: "",
    city: "",
    phone: "",
    name: "",
    isDefault: true,
    _id: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        const firstName = data.profile?.firstName || "";
        const lastName = data.profile?.lastName || "";
        const addressObj =
          (data.profile?.addresses || []).find((a) => a.isDefault) ||
          (data.profile?.addresses || [])[0] ||
          {};
        setUserInfo({
          email: data.email || "",
          firstName,
          lastName,
          phone: addressObj.phone || "",
          address: [
            addressObj.street,
            addressObj.ward,
            addressObj.district,
            addressObj.city,
          ]
            .filter(Boolean)
            .join(", "),
          joinDate: "", // Nếu có trường ngày tạo thì lấy thêm
        });
        setEditInfo({
          firstName,
          lastName,
          phone: addressObj.phone || "",
          address: [
            addressObj.street,
            addressObj.ward,
            addressObj.district,
            addressObj.city,
          ]
            .filter(Boolean)
            .join(", "),
          addressId: addressObj._id, // Thêm dòng này
        });
        setEditAddress({
          street: addressObj.street || "",
          ward: addressObj.ward || "",
          district: addressObj.district || "",
          city: addressObj.city || "",
          phone: addressObj.phone || "",
          name: addressObj.name || "",
          isDefault: addressObj.isDefault || true,
          _id: addressObj._id || "",
        });
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
        if (err.message?.includes("No authentication")) {
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleEditChange = (e) => {
    setEditInfo({ ...editInfo, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setEditInfo({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phone: userInfo.phone,
      address: userInfo.address,
    });
    setEditing(false);
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Cập nhật tên và số điện thoại
      await updateUserProfile({
        firstName: editInfo.firstName,
        lastName: editInfo.lastName,
        phone: editInfo.phone,
      });

      // Cập nhật địa chỉ nếu có addressId
      if (editInfo.addressId) {
        // Parse lại địa chỉ thành object
        const addressParts = editInfo.address.split(",").map((s) => s.trim());
        const addressObj = {
          street: addressParts[0] || "",
          ward: addressParts[1] || "",
          district: addressParts[2] || "",
          city: addressParts[3] || "",
          phone: editInfo.phone,
          name: `${editInfo.firstName} ${editInfo.lastName}`.trim(),
          isDefault: true,
        };
        await updateUserAddress(editInfo.addressId, addressObj);
      } else {
        await updateUserAddress(editAddress._id, {
          ...editAddress,
          isDefault: true,
        });
      }

      setUserInfo({
        ...userInfo,
        firstName: editInfo.firstName,
        lastName: editInfo.lastName,
        phone: editInfo.phone,
        address: editInfo.address,
      });
      setEditing(false);
      setSuccess("Cập nhật thông tin thành công!");
    } catch (err) {
      setError("Cập nhật thông tin thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Tài Khoản Của Tôi</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-section">
          <h2>Thông Tin Cá Nhân</h2>
          {!editing ? (
            <div className="info-grid">
              <div className="info-item">
                <label>Email:</label>
                <span>{userInfo.email}</span>
              </div>
              <div className="info-item">
                <label>Họ:</label>
                <span>{userInfo.firstName}</span>
              </div>
              <div className="info-item">
                <label>Tên:</label>
                <span>{userInfo.lastName}</span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{userInfo.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="info-item">
                <label>Địa chỉ:</label>
                <span>{userInfo.address || "Chưa cập nhật"}</span>
              </div>
              <div className="info-item info-actions">
                <button className="edit-btn" onClick={handleEdit}>
                  Cập nhật thông tin
                </button>
              </div>
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleSave}>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email:</label>
                  <span>{userInfo.email}</span>
                </div>
                <div className="info-item">
                  <label>Họ:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editInfo.firstName}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <label>Tên:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editInfo.lastName}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="info-item">
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    name="phone"
                    value={editInfo.phone}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="info-item">
                  <label>Địa chỉ:</label>
                  <input
                    type="text"
                    name="address"
                    value={editInfo.address}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="info-item">
                  <label>Họ và tên nhận hàng:</label>
                  <input
                    type="text"
                    name="name"
                    value={editAddress.name}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="info-item">
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    name="phone"
                    value={editAddress.phone}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="info-item">
                  <label>Địa chỉ (số nhà, đường):</label>
                  <input
                    type="text"
                    name="street"
                    value={editAddress.street}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, street: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="info-item">
                  <label>Phường/Xã:</label>
                  <input
                    type="text"
                    name="ward"
                    value={editAddress.ward}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, ward: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="info-item">
                  <label>Quận/Huyện:</label>
                  <input
                    type="text"
                    name="district"
                    value={editAddress.district}
                    onChange={(e) =>
                      setEditAddress({
                        ...editAddress,
                        district: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="info-item">
                  <label>Tỉnh/Thành phố:</label>
                  <input
                    type="text"
                    name="city"
                    value={editAddress.city}
                    onChange={(e) =>
                      setEditAddress({ ...editAddress, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="info-item info-actions">
                  <button className="save-btn" type="submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={handleCancel}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
