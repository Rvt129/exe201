const API_URL = process.env.REACT_APP_API_URL + "/api/orders/payos";

// Tạo link thanh toán PayOS
export const createPayOSOrder = async (orderData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  const responseData = await response.json();
  if (!response.ok || responseData.error !== 0) {
    throw new Error(
      responseData.message || "Không tạo được đơn thanh toán PayOS"
    );
  }
  return responseData;
};

// Lấy thông tin link thanh toán
export const getPayOSOrder = async (orderId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();
  if (!response.ok || responseData.error !== 0) {
    throw new Error(
      responseData.message || "Không lấy được thông tin thanh toán PayOS"
    );
  }
  return responseData.data;
};

// Hủy link thanh toán
export const cancelPayOSOrder = async (orderId, cancellationReason) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cancellationReason }),
  });
  const responseData = await response.json();
  if (!response.ok || responseData.error !== 0) {
    throw new Error(
      responseData.message || "Không hủy được link thanh toán PayOS"
    );
  }
  return responseData.data;
};

// Xác thực webhook (thường dùng cho admin)
export const confirmPayOSWebhook = async (webhookUrl) => {
  const response = await fetch(`${API_URL}/confirm-webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ webhookUrl }),
  });
  const responseData = await response.json();
  if (!response.ok || responseData.error !== 0) {
    throw new Error(
      responseData.message || "Không xác thực được webhook PayOS"
    );
  }
  return responseData.data; // Backend returns data: null on success
};

// New service function to get system Order ID from PayOS numeric code
export const getSystemOrderIdFromPayOSCode = async (payOSNumericOrderCode) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/get-system-order-id/${payOSNumericOrderCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const responseData = await response.json();
  if (!response.ok || responseData.error !== 0) {
    throw new Error(
      responseData.message || "Không lấy được ID đơn hàng hệ thống từ mã PayOS"
    );
  }
  return responseData.data; // Expected: { systemOrderId: "mongoDbIdString" }
};
