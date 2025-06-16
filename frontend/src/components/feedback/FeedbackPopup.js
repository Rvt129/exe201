import React, { useState } from "react";
import feedbackService from "../../services/feedback";
import "./FeedbackPopup.css"; // We'll create this CSS file next

const FeedbackPopup = ({ orderId, onClose, onSubmitSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await feedbackService.createFeedback({ orderId, rating, comment });
      setIsLoading(false);
      onSubmitSuccess(); // Callback for successful submission
      onClose(); // Close the popup
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Gửi đánh giá thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || rating);
      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? "filled" : ""}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Rất không hài lòng";
      case 2:
        return "Không hài lòng";
      case 3:
        return "Bình thường";
      case 4:
        return "Hài lòng";
      case 5:
        return "Rất hài lòng";
      default:
        return "";
    }
  };

  return (
    <div className="feedback-popup-overlay">
      <div className="feedback-popup">
        <h2>Đánh giá đơn hàng</h2>
        <p className="order-info">Mã đơn hàng: #{orderId}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rating">Đánh giá của bạn:</label>
            <div className="star-rating">{renderStars()}</div>
            <p className="rating-text">
              {getRatingText(hoveredRating || rating)}
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="comment">Nhận xét (tùy chọn):</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm và dịch vụ..."
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="popup-actions">
            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cancel-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;
