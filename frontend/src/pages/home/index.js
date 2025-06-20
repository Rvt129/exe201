import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./Home.css";

function Home() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".animate-section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Tạo Phong Cách <span className="gradient-text">Độc Đáo</span>
              <br />
              Cho Người Bạn Lông Xù
            </h1>
            <p className="hero-subtitle">
              Thiết kế trang phục tùy chỉnh với công cụ trực quan. Từ ý tưởng
              đến thực tế, chỉ trong vài cú click!
            </p>
            <div className="hero-actions">
              <Link to="/design" className="cta-button primary">
                <i className="fas fa-palette"></i>
                Bắt Đầu Thiết Kế
              </Link>
              <Link to="/products" className="cta-button secondary">
                <i className="fas fa-shopping-bag"></i>
                Khám Phá Sản Phẩm
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Thiết kế đã tạo</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1200+</span>
                <span className="stat-label">Khách hàng hạnh phúc</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Đánh giá tích cực</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-container">
              <div className="floating-element element-1">
                <i className="fas fa-heart"></i>
              </div>
              <div className="floating-element element-2">
                <i className="fas fa-star"></i>
              </div>
              <div className="floating-element element-3">
                <i className="fas fa-paw"></i>
              </div>
              <div className="hero-placeholder">
                <img
                  src={process.env.PUBLIC_URL + "/assets/logo-pawpal.jpg"}
                  alt="PetFashion Studio Logo"
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="why-choose"
        className={`why-section animate-section ${
          isVisible["why-choose"] ? "visible" : ""
        }`}
      >
        <div className="container">
          <div className="section-header">
            <h2>Tại Sao Chọn Chúng Tôi?</h2>
            <p>Những lý do khiến hàng nghìn khách hàng tin tưởng</p>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-magic"></i>
              </div>
              <h3>Sáng Tạo Không Giới Hạn</h3>
              <p>
                Công cụ thiết kế trực quan với hàng trăm mẫu và hiệu ứng. Thỏa
                sức sáng tạo theo phong cách riêng.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Chất Liệu Tuyệt Hảo</h3>
              <p>
                Vải organic cao cấp, an toàn cho da nhạy cảm. Thoáng khí, bền
                đẹp qua thời gian.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h3>Độc Quyền Phong Cách</h3>
              <p>
                Mỗi thiết kế là duy nhất. Không ai có thể sao chép phong cách
                của bạn và thú cưng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="process"
        className={`process-section animate-section ${
          isVisible["process"] ? "visible" : ""
        }`}
      >
        <div className="container">
          <div className="section-header">
            <h2>Quy Trình Đơn Giản</h2>
            <p>Chỉ 3 bước để có sản phẩm hoàn hảo</p>
          </div>
          <div className="process-steps">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-icon">
                <i className="fas fa-pencil-ruler"></i>
              </div>
              <h3>Thiết Kế & Tùy Chỉnh</h3>
              <p>
                Chọn sản phẩm, tùy chỉnh màu sắc, thêm họa tiết và text theo ý
                muốn.
              </p>
            </div>
            <div className="step-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Xem Trước & Đặt Hàng</h3>
              <p>
                Xem trước sản phẩm 3D, điều chỉnh nếu cần và tiến hành đặt hàng.
              </p>
            </div>
            <div className="step-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3>Nhận Hàng & Tỏa Sáng</h3>
              <p>
                Nhận sản phẩm chất lượng cao và cùng thú cưng khoe phong cách
                độc đáo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section
        id="collection"
        className={`collection-section animate-section ${
          isVisible["collection"] ? "visible" : ""
        }`}
      >
        <div className="container">
          <div className="section-header">
            <h2>Bộ Sưu Tập Nổi Bật</h2>
            <p>Những thiết kế được yêu thích nhất</p>
          </div>
          <div className="collection-grid">
            <div className="collection-item">
              <div className="collection-image">
                <div className="placeholder-image">
                  <i className="fas fa-tshirt"></i>
                  <span>Áo Thun Basic</span>
                </div>
              </div>
              <h4>Summer Vibes</h4>
              <p>Bộ sưu tập mùa hè tươi mát</p>
            </div>
            <div className="collection-item">
              <div className="collection-image">
                <div className="placeholder-image">
                  <i className="fas fa-vest"></i>
                  <span>Hoodie Ấm Áp</span>
                </div>
              </div>
              <h4>Cozy Winter</h4>
              <p>Thiết kế ấm áp cho mùa đông</p>
            </div>
            <div className="collection-item">
              <div className="collection-image">
                <div className="placeholder-image">
                  <i className="fas fa-crown"></i>
                  <span>Trang Phục Lễ Hội</span>
                </div>
              </div>
              <h4>Party Time</h4>
              <p>Trang phục lễ hội sang trọng</p>
            </div>
          </div>
          <div className="collection-cta">
            <Link to="/products" className="cta-button outline">
              Khám Phá Thêm Thiết Kế
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className={`testimonials-section animate-section ${
          isVisible["testimonials"] ? "visible" : ""
        }`}
      >
        <div className="container">
          <div className="section-header">
            <h2>Khách Hàng Nói Gì?</h2>
            <p>Những chia sẻ chân thực từ cộng đồng pet lovers</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-item">
              <div className="testimonial-content">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>
                  "Milo của mình trở thành ngôi sao của cả khu phố với chiếc áo
                  tùy chỉnh. Chất lượng vải tuyệt vời!"
                </p>
                <div className="testimonial-author">
                  <strong>Chị Lan Anh</strong>
                  <span>Mẹ của Milo (Golden Retriever)</span>
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <div className="testimonial-content">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>
                  "Công cụ thiết kế rất dễ sử dụng. Em đã tạo được 5 mẫu áo khác
                  nhau cho Luna chỉ trong 1 buổi tối!"
                </p>
                <div className="testimonial-author">
                  <strong>Anh Minh</strong>
                  <span>Ba của Luna (French Bulldog)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="container">
          <div className="final-cta-content">
            <h2>Sẵn Sàng Tạo Phong Cách Độc Đáo?</h2>
            <p>Tham gia cùng hàng nghìn pet parents đã tin tưởng chúng tôi</p>
            <Link to="/design" className="cta-button primary large">
              <i className="fas fa-rocket"></i>
              Bắt Đầu Ngay Hôm Nay
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>PetFashion Studio</h3>
              <p>Nơi tình yêu thú cưng gặp gỡ thời trang</p>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/profile.php?id=61576657957296"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a
                  href="https://instagram.com"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://youtube.com"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Sản Phẩm</h4>
              <ul>
                <li>
                  <a href="/design">Thiết Kế Tùy Chỉnh</a>
                </li>
                <li>
                  <a href="/products">Danh Mục Sản Phẩm</a>
                </li>
                <li>
                  <a href="/designs">Bộ Sưu Tập</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Hỗ Trợ</h4>
              <ul>
                <li>
                  <a href="#">Hướng Dẫn Thiết Kế</a>
                </li>
                <li>
                  <a href="#">Chính Sách Đổi Trả</a>
                </li>
                <li>
                  <a href="/support">Liên Hệ</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Liên Hệ</h4>
              <p>
                <i className="fas fa-phone"></i> 1900 xxx xxx
              </p>
              <p>
                <i className="fas fa-envelope"></i> hello@petfashion.vn
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i> TP. Hồ Chí Minh
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PetFashion Studio. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>

      {/* Floating Contact Icons */}
      <div className="floating-contact">
        <a
          href="https://www.facebook.com/profile.php?id=61576657957296"
          className="contact-icon messenger-icon"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat qua Facebook Messenger"
        >
          <i className="fab fa-facebook-messenger"></i>
          <span className="contact-tooltip">Chat Facebook</span>
        </a>
        <a
          href="https://zalo.me/your-zalo-number"
          className="contact-icon zalo-icon"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat qua Zalo"
        >
          <i className="fas fa-comment-dots"></i>
          <span className="contact-tooltip">Chat Zalo</span>
        </a>
      </div>
    </div>
  );
}

export default Home;
