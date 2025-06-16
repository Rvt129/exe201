import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import "./Support.css";
import {
  FiHeadphones,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiClock,
  FiMapPin,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiTruck,
  FiCreditCard,
  FiPackage,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import { MdDesignServices, MdPets } from "react-icons/md";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal",
  });
  const navigate = useNavigate();

  // FAQ Data
  const faqData = {
    general: [
      {
        id: 1,
        question: "PawPal Custom là gì?",
        answer:
          "PawPal Custom là nền tảng thiết kế và in ấn áo thú cưng theo yêu cầu. Chúng tôi cung cấp công cụ thiết kế trực tuyến để bạn tạo ra những chiếc áo độc đáo cho thú cưng của mình với chất lượng cao và giá cả hợp lý.",
      },
      {
        id: 2,
        question: "Làm thế nào để bắt đầu thiết kế?",
        answer:
          "Rất đơn giản! Bạn chỉ cần: 1) Đăng ký tài khoản miễn phí, 2) Chọn sản phẩm và màu sắc, 3) Sử dụng công cụ thiết kế để tạo mẫu, 4) Xem trước và đặt hàng. Toàn bộ quá trình chỉ mất vài phút!",
      },
      {
        id: 3,
        question: "Có cần kinh nghiệm thiết kế không?",
        answer:
          "Hoàn toàn không! Công cụ thiết kế của chúng tôi được thiết kế thân thiện với người dùng. Bạn có thể kéo thả, thêm text, hình ảnh và các hiệu ứng một cách dễ dàng mà không cần kiến thức chuyên môn.",
      },
    ],
    orders: [
      {
        id: 4,
        question: "Thời gian xử lý và giao hàng?",
        answer:
          "Thời gian xử lý: 2-3 ngày làm việc. Thời gian giao hàng: 3-5 ngày (nội thành), 5-7 ngày (ngoại thành). Chúng tôi sẽ cập nhật trạng thái đơn hàng qua email và SMS.",
      },
      {
        id: 5,
        question: "Có thể thay đổi đơn hàng sau khi đặt?",
        answer:
          "Bạn có thể thay đổi đơn hàng trong vòng 2 giờ sau khi đặt hàng nếu đơn hàng chưa được xử lý. Vui lòng liên hệ ngay với bộ phận hỗ trợ để được hỗ trợ.",
      },
      {
        id: 6,
        question: "Chính sách hoàn trả như thế nào?",
        answer:
          "Chúng tôi hỗ trợ hoàn trả trong 7 ngày nếu sản phẩm có lỗi do nhà sản xuất. Với sản phẩm thiết kế theo yêu cầu, chúng tôi chỉ hoàn trả khi có lỗi in ấn hoặc chất lượng vải.",
      },
    ],
    technical: [
      {
        id: 7,
        question: "Định dạng file nào được hỗ trợ?",
        answer:
          "Chúng tôi hỗ trợ các định dạng: PNG, JPG, JPEG, SVG. Độ phân giải tối thiểu 300 DPI cho chất lượng in tốt nhất. File không được vượt quá 10MB.",
      },
      {
        id: 8,
        question: "Làm sao để thiết kế có chất lượng tốt?",
        answer:
          "Để có chất lượng in tốt nhất: 1) Sử dụng hình ảnh độ phân giải cao, 2) Tránh sử dụng quá nhiều màu sắc, 3) Đảm bảo text có kích thước đủ lớn, 4) Sử dụng màu tương phản cao.",
      },
      {
        id: 9,
        question: "Có thể in trên cả hai mặt không?",
        answer:
          "Hiện tại chúng tôi chỉ hỗ trợ in một mặt để đảm bảo chất lượng và độ bền tốt nhất. Chúng tôi đang phát triển tính năng in hai mặt trong tương lai.",
      },
    ],
    sizing: [
      {
        id: 10,
        question: "Làm sao để chọn size phù hợp?",
        answer:
          "Hãy đo kích thước thú cưng: chiều dài lưng (từ cổ đến gốc đuôi), vòng ngực (phần rộng nhất). So sánh với bảng size của chúng tôi. Khi nghi ngờ, hãy chọn size lớn hơn một chút.",
      },
      {
        id: 11,
        question: "Nếu chọn nhầm size thì sao?",
        answer:
          "Nếu sản phẩm không vừa, bạn có thể đổi size trong vòng 7 ngày (sản phẩm chưa sử dụng, còn nguyên tag). Chi phí vận chuyển đổi hàng sẽ được chúng tôi hỗ trợ 50%.",
      },
    ],
  };

  // Contact categories
  const contactCategories = [
    { value: "general", label: "Câu hỏi chung" },
    { value: "order", label: "Vấn đề đơn hàng" },
    { value: "technical", label: "Hỗ trợ kỹ thuật" },
    { value: "billing", label: "Thanh toán & Hóa đơn" },
    { value: "feedback", label: "Góp ý & Phản hồi" },
  ];

  // Filter FAQs based on search
  const getFilteredFAQs = () => {
    if (!searchQuery) return faqData;

    const filtered = {};
    Object.keys(faqData).forEach((category) => {
      const filteredItems = faqData[category].filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    return filtered;
  };

  const handleFAQToggle = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/support/contact",
        contactForm
      );

      if (response.status === 201) {
        alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong 24 giờ.");
        setContactForm({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
          priority: "normal",
        });
      }
    } catch (error) {
      // Log chi tiết lỗi để biết đang sai gì
      if (error.response) {
        console.error("📍 Backend trả về lỗi:", error.response.data);
        console.error("📍 Status:", error.response.status);
      } else if (error.request) {
        console.error("📍 Không nhận được phản hồi từ server:", error.request);
      } else {
        console.error("📍 Lỗi khi thiết lập yêu cầu:", error.message);
      }

      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
    }
  };

  const renderFAQSection = () => {
    const filteredFAQs = getFilteredFAQs();

    return (
      <div className="faq-section">
        <div className="section-header">
          <h2>Câu hỏi thường gặp</h2>
          <p>Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến</p>
        </div>

        <div className="faq-search">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="faq-content">
          {Object.keys(filteredFAQs).map((category) => (
            <div key={category} className="faq-category">
              <h3 className="category-title">
                {category === "general" && "Câu hỏi chung"}
                {category === "orders" && "Đơn hàng & Giao hàng"}
                {category === "technical" && "Hỗ trợ kỹ thuật"}
                {category === "sizing" && "Hướng dẫn chọn size"}
              </h3>

              <div className="faq-list">
                {filteredFAQs[category].map((faq) => (
                  <div
                    key={faq.id}
                    className={`faq-item ${
                      expandedFAQ === faq.id ? "active" : ""
                    }`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => handleFAQToggle(faq.id)}
                    >
                      <span>{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContactSection = () => (
    <div className="contact-section">
      <div className="section-header">
        <h2>Liên hệ hỗ trợ</h2>
        <p>Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn</p>
      </div>

      <div className="contact-grid">
        <div className="contact-methods">
          <h3>Các kênh hỗ trợ</h3>

          <div className="contact-method">
            <div className="method-icon">
              <FiPhone />
            </div>
            <div className="method-info">
              <h4>Hotline 24/7</h4>
              <p>1900 1234</p>
              <small>Miễn phí từ điện thoại cố định</small>
            </div>
          </div>

          <div className="contact-method">
            <div className="method-icon">
              <FiMail />
            </div>
            <div className="method-info">
              <h4>Email hỗ trợ</h4>
              <p>support@pawpalcustom.com</p>
              <small>Phản hồi trong 2-4 giờ</small>
            </div>
          </div>

          <div className="contact-method">
            <div className="method-icon">
              <FiMessageCircle />
            </div>
            <div className="method-info">
              <h4>Live Chat</h4>
              <p>Trò chuyện trực tiếp</p>
              <small>8:00 - 22:00 hàng ngày</small>
            </div>
          </div>

          <div className="support-hours">
            <h4>
              <FiClock /> Giờ hỗ trợ
            </h4>
            <div className="hours-list">
              <div className="hours-item">
                <span>Thứ 2 - Thứ 6:</span>
                <span>8:00 - 22:00</span>
              </div>
              <div className="hours-item">
                <span>Thứ 7 - Chủ nhật:</span>
                <span>9:00 - 21:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Danh mục</label>
                <select
                  value={contactForm.category}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, category: e.target.value })
                  }
                >
                  <option value="">Chọn danh mục</option>
                  {contactCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Độ ưu tiên</label>
                <select
                  value={contactForm.priority}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, priority: e.target.value })
                  }
                >
                  <option value="low">Thấp</option>
                  <option value="normal">Bình thường</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tiêu đề *</label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                placeholder="Mô tả ngắn gọn vấn đề của bạn"
              />
            </div>

            <div className="form-group">
              <label>Nội dung *</label>
              <textarea
                required
                rows={6}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
              />
            </div>

            <button type="submit" className="submit-btn">
              <FiMail />
              Gửi yêu cầu hỗ trợ
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderGuidesSection = () => (
    <div className="guides-section">
      <div className="section-header">
        <h2>Hướng dẫn & Tài liệu</h2>
        <p>Tìm hiểu cách sử dụng dịch vụ của chúng tôi một cách hiệu quả</p>
      </div>

      <div className="guides-grid">
        <div className="guide-card">
          <div className="guide-icon">
            <MdDesignServices />
          </div>
          <h3>Hướng dẫn thiết kế</h3>
          <p>
            Học cách sử dụng công cụ thiết kế để tạo ra những mẫu áo độc đáo
          </p>
          <div className="guide-links">
            <a href="/guides/design-basics">Cơ bản về thiết kế</a>
            <a href="/guides/design-tips">Mẹo thiết kế hay</a>
            <a href="/guides/color-theory">Lý thuyết màu sắc</a>
          </div>
        </div>

        <div className="guide-card">
          <div className="guide-icon">
            <MdPets />
          </div>
          <h3>Hướng dẫn chọn size</h3>
          <p>Cách đo và chọn kích thước phù hợp cho từng loại thú cưng</p>
          <div className="guide-links">
            <a href="/guides/measure-pet">Cách đo thú cưng</a>
            <a href="/guides/size-chart">Bảng size chi tiết</a>
            <a href="/guides/fit-tips">Lời khuyên về độ vừa vặn</a>
          </div>
        </div>

        <div className="guide-card">
          <div className="guide-icon">
            <FiPackage />
          </div>
          <h3>Quy trình đặt hàng</h3>
          <p>Từ thiết kế đến nhận hàng - tất cả những gì bạn cần biết</p>
          <div className="guide-links">
            <a href="/guides/ordering">Cách đặt hàng</a>
            <a href="/guides/payment">Phương thức thanh toán</a>
            <a href="/guides/shipping">Vận chuyển & Giao hàng</a>
          </div>
        </div>

        <div className="guide-card">
          <div className="guide-icon">
            <FiTruck />
          </div>
          <h3>Chăm sóc sản phẩm</h3>
          <p>Hướng dẫn bảo quản để sản phẩm bền đẹp theo thời gian</p>
          <div className="guide-links">
            <a href="/guides/care">Hướng dẫn giặt ủi</a>
            <a href="/guides/storage">Cách bảo quản</a>
            <a href="/guides/troubleshooting">Xử lý sự cố</a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="support-page">
        {/* Hero Section */}
        <div className="support-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                <FiHeadphones className="hero-icon" />
                Trung tâm hỗ trợ
              </h1>
              <p>
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 với đội ngũ chuyên
                nghiệp và tận tâm
              </p>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <FiUsers />
                <div>
                  <span className="stat-number">50,000+</span>
                  <span className="stat-label">Khách hàng hài lòng</span>
                </div>
              </div>
              <div className="stat-item">
                <FiStar />
                <div>
                  <span className="stat-number">4.9/5</span>
                  <span className="stat-label">Đánh giá dịch vụ</span>
                </div>
              </div>
              <div className="stat-item">
                <FiHeart />
                <div>
                  <span className="stat-number">2 giờ</span>
                  <span className="stat-label">Thời gian phản hồi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="quick-help">
          <div className="container">
            <h2>Hỗ trợ nhanh</h2>
            <div className="quick-help-grid">
              <button
                className="quick-help-card"
                onClick={() => setActiveTab("faq")}
              >
                <FiSearch />
                <h3>Tìm câu trả lời</h3>
                <p>Tìm kiếm trong FAQ</p>
              </button>
              <button
                className="quick-help-card"
                onClick={() => setActiveTab("contact")}
              >
                <FiMessageCircle />
                <h3>Liên hệ hỗ trợ</h3>
                <p>Gửi yêu cầu hỗ trợ</p>
              </button>
              <button
                className="quick-help-card"
                onClick={() => setActiveTab("guides")}
              >
                <FiPackage />
                <h3>Hướng dẫn sử dụng</h3>
                <p>Tài liệu & video</p>
              </button>
              <button
                className="quick-help-card"
                onClick={() => window.open("tel:19001234")}
              >
                <FiPhone />
                <h3>Gọi hotline</h3>
                <p>1900 1234</p>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="support-tabs">
          <div className="container">
            <div className="tabs-nav">
              <button
                className={`tab-btn ${activeTab === "faq" ? "active" : ""}`}
                onClick={() => setActiveTab("faq")}
              >
                <FiSearch />
                FAQ
              </button>
              <button
                className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
                onClick={() => setActiveTab("contact")}
              >
                <FiMail />
                Liên hệ
              </button>
              <button
                className={`tab-btn ${activeTab === "guides" ? "active" : ""}`}
                onClick={() => setActiveTab("guides")}
              >
                <FiPackage />
                Hướng dẫn
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="support-content">
          <div className="container">
            {activeTab === "faq" && renderFAQSection()}
            {activeTab === "contact" && renderContactSection()}
            {activeTab === "guides" && renderGuidesSection()}
          </div>
        </div>

        {/* Contact Info Footer */}
        <div className="support-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Liên hệ trực tiếp</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <FiPhone />
                    <span>Hotline: 1900 1234</span>
                  </div>
                  <div className="contact-item">
                    <FiMail />
                    <span>Email: support@pawpalcustom.com</span>
                  </div>
                  <div className="contact-item">
                    <FiMapPin />
                    <span>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</span>
                  </div>
                </div>
              </div>

              <div className="footer-section">
                <h3>Cam kết dịch vụ</h3>
                <ul>
                  <li>✓ Hỗ trợ 24/7 qua tất cả kênh</li>
                  <li>✓ Phản hồi trong vòng 2 giờ</li>
                  <li>✓ Đội ngũ chuyên nghiệp, tận tâm</li>
                  <li>✓ Giải quyết thỏa đáng 100% vấn đề</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
