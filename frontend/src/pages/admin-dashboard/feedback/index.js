import React, { useEffect, useState } from "react";
import feedbackService from "../../../services/feedback";
import "./AdminFeedbackPage.css";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching feedbacks...");
        const data = await feedbackService.getAllFeedbacks();
        console.log("Fetched feedbacks:", data);
        setFeedbacks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError(err.response?.data?.message || "Failed to fetch feedbacks.");
        setFeedbacks([]);
      }
      setIsLoading(false);
    };

    fetchFeedbacks();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-feedback-page">
        <h1>Đánh Giá Của Khách Hàng</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu đánh giá...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-feedback-page">
        <h1>Đánh Giá Của Khách Hàng</h1>
        <div className="error-container">
          <p className="error-message">❌ Lỗi: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-feedback-page">
      <h1>Đánh Giá Của Khách Hàng</h1>
      {feedbacks.length === 0 ? (
        <div className="no-feedbacks">
          <p>Chưa có đánh giá nào từ khách hàng.</p>
        </div>
      ) : (
        <div className="feedbacks-container">
          <div className="feedback-stats">
            <div className="stat-card">
              <h3>Tổng đánh giá</h3>
              <p className="stat-number-feedback">{feedbacks.length}</p>
            </div>
            <div className="stat-card">
              <h3>Điểm trung bình</h3>
              <p className="stat-number-feedback">
                {feedbacks.length > 0
                  ? (
                      feedbacks.reduce((sum, f) => {
                        const rating = Number(f.rating) || 0;
                        return sum + rating;
                      }, 0) / feedbacks.length
                    ).toFixed(1)
                  : 0}
                /5
              </p>
            </div>
            <div className="stat-card">
              <h3>Phân bố đánh giá</h3>
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = feedbacks.filter(
                    (f) => Number(f.rating) === star
                  ).length;
                  const percentage =
                    feedbacks.length > 0
                      ? ((count / feedbacks.length) * 100).toFixed(1)
                      : 0;
                  return (
                    <div key={star} className="rating-bar">
                      <span className="rating-label">{star}★</span>
                      <div className="rating-progress">
                        <div
                          className="rating-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="rating-count">({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="feedbacks-table-container">
            <table className="feedbacks-table">
              <thead>
                <tr>
                  <th>Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Điểm</th>
                  <th>Nhận xét</th>
                  <th>Ngày đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td>
                      {feedback.order?.orderNumber ||
                        (typeof feedback.order === "string"
                          ? feedback.order.substring(0, 8)
                          : "N/A")}
                    </td>
                    <td>
                      {feedback.user?.profile?.firstName &&
                      feedback.user?.profile?.lastName
                        ? `${feedback.user.profile.firstName} ${feedback.user.profile.lastName}`
                        : feedback.user?.email ||
                          (typeof feedback.user === "string"
                            ? feedback.user
                            : "Ẩn danh")}
                    </td>
                    <td>
                      <span className={`rating rating-${feedback.rating}`}>
                        {feedback.rating}/5
                        <span className="stars">
                          {"★".repeat(Number(feedback.rating) || 0)}
                          {"☆".repeat(5 - (Number(feedback.rating) || 0))}
                        </span>
                      </span>
                    </td>
                    <td className="comment-cell">
                      {feedback.comment ? (
                        <div className="comment">
                          {feedback.comment.length > 100
                            ? `${feedback.comment.substring(0, 100)}...`
                            : feedback.comment}
                        </div>
                      ) : (
                        <span className="no-comment">Không có nhận xét</span>
                      )}
                    </td>
                    <td>
                      {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;
