# **Phân Tích Use Case và Yêu Cầu Phi Chức Năng cho Hệ Thống Web Bán Quần Áo Thú Cưng Tùy Chỉnh**

## **1\. Giới Thiệu**

### **1.1. Tổng Quan Dự Án: Nền Tảng "Pet-a-Porter Custom Design"**

Dự án này tập trung vào việc xây dựng một nền tảng thương mại điện tử chuyên biệt, "Pet-a-Porter Custom Design," với một đề xuất bán hàng độc đáo: cho phép khách hàng tự thiết kế hình ảnh để in lên quần áo cho thú cưng. Chức năng cốt lõi của nền tảng bao gồm việc khách hàng lựa chọn mẫu áo, sử dụng công cụ thiết kế trực tuyến để thêm chữ hoặc hình ảnh, lưu các thiết kế này vào bộ sưu tập cá nhân, và cuối cùng là thực hiện quy trình mua hàng. Hệ thống sẽ được phát triển dựa trên các công nghệ MongoDB, JavaScript, React và Express.js. Việc lựa chọn các công nghệ này sẽ định hướng một số cân nhắc kỹ thuật trong quá trình xác định các trường hợp sử dụng và yêu cầu phi chức năng.

### **1.2. Mục Đích và Phạm Vi của Tài Liệu Use Case**

Tài liệu này nhằm mục đích cung cấp một mô tả chi tiết về tất cả các chức năng của hệ thống từ góc độ người dùng, bao gồm Khách hàng và Quản trị viên, tuân thủ theo các tiêu chuẩn của Phân tích Nghiệp vụ (BA). Mục tiêu là để "mô tả cách hệ thống tương tác với người dùng và các bên liên quan để đạt được các mục tiêu cụ thể" 1 và đóng vai trò như một "bản hướng dẫn cho team dev" 2, đảm bảo sự rõ ràng và hiểu biết chung giữa tất cả các bên liên quan trong quá trình phát triển.

Phạm vi của tài liệu này bao gồm tất cả các trang và chức năng đã được xác định cho phía khách hàng (Trang chủ, Trang thiết kế, Giỏ hàng, Lịch sử đơn hàng, Thanh toán, Bộ sưu tập của tôi, Hồ sơ của tôi) và phía quản trị viên (Quản lý đơn hàng, Quản lý bộ sưu tập, Quản lý doanh thu).

### **1.3. Định Nghĩa, Từ Viết Tắt**

* **UC**: Use Case (Trường hợp sử dụng)  
* **NFR**: Non-Functional Requirement (Yêu cầu phi chức năng)  
* **PII**: Personally Identifiable Information (Thông tin nhận dạng cá nhân)  
* **UGC**: User-Generated Content (Nội dung do người dùng tạo ra)  
* **Admin**: Administrator (Quản trị viên)  
* **BA**: Business Analyst (Chuyên viên Phân tích Nghiệp vụ)  
* **2FA**: Two-Factor Authentication (Xác thực hai yếu tố)  
* **XSS**: Cross-Site Scripting  
* **CSRF**: Cross-Site Request Forgery  
* **API**: Application Programming Interface (Giao diện lập trình ứng dụng)

### **1.4. Quy Ước Tài Liệu**

Mỗi trường hợp sử dụng (UC) trong tài liệu này sẽ được cấu trúc theo một mẫu chuẩn, bao gồm các thành phần chính như Tên UC, Tác nhân, Tiền điều kiện, Các bước thực hiện, và Hậu điều kiện.3 Các mối quan hệ giữa các UC, như quan hệ \<\<include\>\> (bao gồm) và \<\<extend\>\> (mở rộng), sẽ được sử dụng để mô tả sự phụ thuộc hoặc tùy chọn giữa các chức năng, theo định nghĩa trong các tài liệu tham khảo.5

## **2\. Các Tác Nhân Hệ Thống**

### **2.1. Xác Định Tác Nhân**

Trong ngữ cảnh của mô hình hóa trường hợp sử dụng, một Tác nhân (Actor) được hiểu là "người dùng hoặc một đối tượng bên ngoài tương tác với hệ thống" 1 hoặc "thành phần bên ngoài tương tác với hệ thống".3 Tác nhân không nhất thiết là một chức danh công việc cụ thể mà là một "vai trò" 4 tương tác với hệ thống để đạt được một mục tiêu nào đó.

Các tác nhân chính được xác định cho hệ thống "Pet-a-Porter Custom Design" bao gồm:

* **Khách hàng (Customer):** Một cá nhân duyệt trang web, thiết kế quần áo, quản lý các bộ sưu tập cá nhân và thực hiện giao dịch mua hàng.  
* **Quản trị viên (Administrator \- Admin):** Một nhân viên của công ty, chịu trách nhiệm quản lý đơn hàng, giám sát các bộ sưu tập do người dùng tạo ra và theo dõi doanh thu của hệ thống.

### **2.2. Mục Tiêu và Tương Tác Chính của Tác Nhân**

Việc phân định rõ ràng vai trò của Khách hàng và Quản trị viên giúp xác định các khu vực chức năng riêng biệt của ứng dụng và thiết lập các ranh giới bảo mật cần thiết. Ví dụ, một Quản trị viên có quyền "Quản lý Đơn hàng," một khả năng không có sẵn cho Khách hàng. Sự phân chia này là cơ bản cho an ninh và tổ chức hệ thống, phù hợp với khái niệm "Boundary of system" (Ranh giới của hệ thống) 7, nơi các tác nhân giúp định nghĩa những ranh giới này bằng cách minh họa ai có thể truy cập vào cái gì. Ranh giới của Khách hàng là dữ liệu cá nhân và khả năng mua hàng của họ, trong khi ranh giới của Quản trị viên bao gồm dữ liệu toàn hệ thống và quyền kiểm soát hoạt động.

Bảng dưới đây tóm tắt các tác nhân của hệ thống, vai trò và mục tiêu chính của họ:

**Bảng T2.1 \- Tóm Tắt Các Tác Nhân Hệ Thống**

| ID Tác nhân | Tên Tác nhân | Mô tả (Vai trò và Trách nhiệm) | Mục tiêu chính trong Hệ thống |
| :---- | :---- | :---- | :---- |
| ACT-01 | Khách hàng | Người dùng cuối tương tác với trang web để duyệt sản phẩm, tùy chỉnh thiết kế quần áo cho thú cưng, quản lý bộ sưu tập và đặt hàng. | Tìm kiếm và xem sản phẩm; Tự thiết kế quần áo; Lưu và quản lý các thiết kế cá nhân; Đặt hàng và thanh toán; Theo dõi đơn hàng; Quản lý thông tin cá nhân. |
| ACT-02 | Quản trị viên | Nhân viên có quyền truy cập vào các chức năng quản trị của hệ thống. | Quản lý đơn hàng của khách; Giám sát và quản lý nội dung do người dùng tạo (thiết kế); Quản lý các mẫu áo cơ sở; Theo dõi và báo cáo doanh thu. |

Bảng này cung cấp một tham chiếu nhanh chóng, ở mức độ cao cho tất cả các bên liên quan để hiểu hệ thống phục vụ ai và mục tiêu chính của họ là gì. Đây là một phần nền tảng cho việc phát triển trường hợp sử dụng, đảm bảo rằng tất cả các UC tiếp theo đều được liên kết trở lại với một tác nhân cụ thể và mục tiêu của họ, phù hợp với cách tiếp cận lấy người dùng làm trung tâm.1 Việc xác định tác nhân là một bước quan trọng ("Bước 2: Xác định các Actor" 3), và bảng này chính thức hóa bước đó, cung cấp một tài liệu tham khảo nhất quán.

## **3\. Các Trường Hợp Sử Dụng Phía Khách Hàng**

Mỗi trường hợp sử dụng (UC) dưới đây được mô tả chi tiết, bao gồm các yếu tố theo tiêu chuẩn như ID, tên, tác nhân, mô tả, độ ưu tiên, tiền điều kiện, hậu điều kiện, luồng chính, các luồng thay thế và luồng ngoại lệ.3

### **3.1. Quản Lý Tài Khoản**

#### **UC-C01: Đăng Ký Tài Khoản Mới**

* **ID Use Case:** UC-C01  
* **Tên Use Case:** Đăng Ký Tài Khoản Mới  
* **Tác nhân:** Khách hàng (Chưa đăng nhập)  
* **Mô tả:** Cho phép người dùng mới tạo một tài khoản trên hệ thống bằng cách cung cấp các thông tin cần thiết.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng chưa có tài khoản trên hệ thống.  
  * Người dùng đang ở trang đăng ký.  
* **Hậu điều kiện (Thành công):**  
  * Tài khoản mới của người dùng được tạo trong hệ thống.  
  * Người dùng được tự động đăng nhập (tùy chọn) hoặc được chuyển đến trang đăng nhập.  
  * Một email xác thực (tùy chọn) được gửi đến địa chỉ email đã đăng ký.  
* **Hậu điều kiện (Thất bại):**  
  * Tài khoản không được tạo.  
  * Người dùng vẫn ở trang đăng ký với thông báo lỗi tương ứng.  
* **Luồng chính (Basic Path):**  
  1. Người dùng chọn tùy chọn "Đăng ký".  
  2. Hệ thống hiển thị biểu mẫu đăng ký yêu cầu: Họ tên, Địa chỉ email, Mật khẩu, Xác nhận mật khẩu.  
  3. Người dùng nhập thông tin vào biểu mẫu.  
  4. Người dùng nhấn nút "Đăng ký".  
  5. Hệ thống \<\<bao gồm\>\> UC-S02: Xác thực Dữ liệu Đầu vào (kiểm tra tính hợp lệ của email, độ mạnh mật khẩu, mật khẩu xác nhận khớp).  
  6. Hệ thống kiểm tra xem địa chỉ email đã tồn tại trong hệ thống chưa.  
  7. Nếu dữ liệu hợp lệ và email chưa tồn tại, hệ thống tạo tài khoản mới cho người dùng, lưu trữ thông tin (mật khẩu được hash).  
  8. Hệ thống hiển thị thông báo đăng ký thành công.  
  9. (Tùy chọn) Hệ thống tự động đăng nhập người dùng và chuyển hướng đến trang chủ hoặc trang tài khoản.  
  10. (Tùy chọn) Hệ thống gửi email xác thực đến địa chỉ email của người dùng.  
* **Luồng thay thế:**  
  * **5a. Dữ liệu không hợp lệ:**  
    1. Hệ thống hiển thị thông báo lỗi cụ thể cho từng trường không hợp lệ (ví dụ: "Email không đúng định dạng", "Mật khẩu quá yếu").  
    2. Người dùng sửa lại thông tin và gửi lại. Quay lại bước 3\.  
  * **6a. Email đã tồn tại:**  
    1. Hệ thống hiển thị thông báo "Địa chỉ email này đã được sử dụng".  
    2. Người dùng có thể chọn đăng nhập hoặc sử dụng email khác. Quay lại bước 3 hoặc chuyển sang UC-C02.  
* **Luồng ngoại lệ:**  
  * **7a. Lỗi hệ thống khi tạo tài khoản:**  
    1. Hệ thống hiển thị thông báo lỗi chung (ví dụ: "Đã có lỗi xảy ra, vui lòng thử lại sau").  
    2. Người dùng có thể thử lại sau.  
* **Bao gồm (Includes):** UC-S02: Xác thực Dữ liệu Đầu vào.  
* **Mở rộng (Extends):** Không có.

#### **UC-C02: Đăng Nhập Người Dùng**

* **ID Use Case:** UC-C02  
* **Tên Use Case:** Đăng Nhập Người Dùng  
* **Tác nhân:** Khách hàng (Chưa đăng nhập)  
* **Mô tả:** Cho phép người dùng đã có tài khoản truy cập vào hệ thống.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã có tài khoản trên hệ thống.  
  * Người dùng đang ở trang đăng nhập.  
* **Hậu điều kiện (Thành công):**  
  * Người dùng được xác thực thành công.  
  * Hệ thống tạo một phiên làm việc cho người dùng.  
  * Người dùng được chuyển hướng đến trang chủ hoặc trang trước đó họ định truy cập.  
* **Hậu điều kiện (Thất bại):**  
  * Người dùng không được đăng nhập.  
  * Người dùng vẫn ở trang đăng nhập với thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng chọn tùy chọn "Đăng nhập".  
  2. Hệ thống hiển thị biểu mẫu đăng nhập yêu cầu: Địa chỉ email, Mật khẩu.  
  3. Người dùng nhập thông tin đăng nhập.  
  4. Người dùng nhấn nút "Đăng nhập".  
  5. Hệ thống \<\<bao gồm\>\> UC-S01: Xác Thực Người Dùng.  
  6. Nếu xác thực thành công, hệ thống tạo phiên làm việc và chuyển hướng người dùng.  
* **Luồng thay thế:**  
  * **5a. Xác thực thất bại (sai email/mật khẩu):**  
    1. Hệ thống hiển thị thông báo "Email hoặc mật khẩu không chính xác".  
    2. Người dùng có thể thử nhập lại. Quay lại bước 3\.  
    3. Người dùng có thể chọn "Quên mật khẩu" (chuyển sang UC-C03).  
* **Luồng ngoại lệ:**  
  * **5b. Tài khoản bị khóa/vô hiệu hóa:**  
    1. Hệ thống hiển thị thông báo "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."  
  * **5c. Lỗi hệ thống khi xác thực:**  
    1. Hệ thống hiển thị thông báo lỗi chung.  
* **Bao gồm (Includes):** UC-S01: Xác Thực Người Dùng.  
* **Mở rộng (Extends):** Không có.

#### **UC-C03: Khôi Phục Mật Khẩu**

* **ID Use Case:** UC-C03  
* **Tên Use Case:** Khôi Phục Mật Khẩu  
* **Tác nhân:** Khách hàng (Chưa đăng nhập hoặc đã đăng nhập nhưng quên mật khẩu)  
* **Mô tả:** Cho phép người dùng đặt lại mật khẩu đã quên.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Người dùng đã có tài khoản và đã đăng ký địa chỉ email.  
  * Người dùng chọn chức năng "Quên mật khẩu".  
* **Hậu điều kiện (Thành công):**  
  * Người dùng nhận được hướng dẫn (ví dụ: email với liên kết đặt lại mật khẩu).  
  * Mật khẩu của người dùng được cập nhật thành công sau khi làm theo hướng dẫn.  
* **Hậu điều kiện (Thất bại):**  
  * Mật khẩu không được đặt lại.  
  * Người dùng nhận được thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng nhấp vào liên kết "Quên mật khẩu".  
  2. Hệ thống hiển thị trang yêu cầu nhập địa chỉ email đã đăng ký.  
  3. Người dùng nhập địa chỉ email và nhấn "Gửi".  
  4. Hệ thống \<\<bao gồm\>\> UC-S02: Xác thực Dữ liệu Đầu vào (kiểm tra định dạng email).  
  5. Hệ thống kiểm tra xem email có tồn tại trong cơ sở dữ liệu không.  
  6. Nếu email tồn tại, hệ thống tạo một mã token đặt lại mật khẩu duy nhất, có thời hạn sử dụng.  
  7. Hệ thống gửi email đến địa chỉ email của người dùng, chứa một liên kết duy nhất để đặt lại mật khẩu (bao gồm token).  
  8. Người dùng mở email và nhấp vào liên kết.  
  9. Hệ thống xác thực token (kiểm tra tính hợp lệ và thời hạn).  
  10. Nếu token hợp lệ, hệ thống hiển thị biểu mẫu cho phép người dùng nhập mật khẩu mới và xác nhận mật khẩu mới.  
  11. Người dùng nhập mật khẩu mới và xác nhận.  
  12. Người dùng nhấn "Đặt lại mật khẩu".  
  13. Hệ thống \<\<bao gồm\>\> UC-S02: Xác thực Dữ liệu Đầu vào (kiểm tra độ mạnh mật khẩu mới, mật khẩu xác nhận khớp).  
  14. Hệ thống cập nhật mật khẩu mới (đã hash) cho tài khoản người dùng và vô hiệu hóa token.  
  15. Hệ thống hiển thị thông báo đặt lại mật khẩu thành công và gợi ý người dùng đăng nhập lại.  
* **Luồng thay thế:**  
  * **5a. Email không tồn tại trong hệ thống:**  
    1. Hệ thống hiển thị thông báo "Địa chỉ email không tồn tại trong hệ thống."  
    2. Người dùng có thể thử nhập lại email khác hoặc đăng ký tài khoản mới. Quay lại bước 3\.  
  * **9a. Token không hợp lệ hoặc đã hết hạn:**  
    1. Hệ thống hiển thị thông báo "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."  
    2. Người dùng có thể yêu cầu gửi lại liên kết. Quay lại bước 1\.  
  * **13a. Mật khẩu mới không hợp lệ:**  
    1. Hệ thống hiển thị thông báo lỗi cụ thể (ví dụ: "Mật khẩu quá yếu", "Mật khẩu xác nhận không khớp").  
    2. Người dùng sửa lại thông tin. Quay lại bước 11\.  
* **Luồng ngoại lệ:**  
  * **7a. Lỗi hệ thống khi gửi email:**  
    1. Hệ thống hiển thị thông báo lỗi chung.  
  * **14a. Lỗi hệ thống khi cập nhật mật khẩu:**  
    1. Hệ thống hiển thị thông báo lỗi chung.  
* **Bao gồm (Includes):** UC-S02: Xác thực Dữ liệu Đầu vào.  
* **Mở rộng (Extends):** Không có.

#### **UC-C24: Xem/Chỉnh Sửa Hồ Sơ Người Dùng**

* **ID Use Case:** UC-C24  
* **Tên Use Case:** Xem/Chỉnh Sửa Hồ Sơ Người Dùng  
* **Tác nhân:** Khách hàng (Đã đăng nhập)  
* **Mô tả:** Cho phép người dùng xem và cập nhật thông tin cá nhân, địa chỉ giao hàng.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập vào hệ thống.  
  * Người dùng truy cập trang "Hồ sơ của tôi" hoặc "Thông tin cá nhân".  
* **Hậu điều kiện (Thành công):**  
  * Thông tin cá nhân của người dùng được cập nhật trong hệ thống.  
  * Hệ thống hiển thị thông tin đã cập nhật.  
* **Hậu điều kiện (Thất bại):**  
  * Thông tin không được cập nhật.  
  * Hệ thống hiển thị thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng điều hướng đến trang hồ sơ cá nhân.  
  2. Hệ thống hiển thị thông tin hiện tại của người dùng: Họ tên, Email (thường không cho sửa), Địa chỉ giao hàng mặc định, Số điện thoại (tùy chọn).  
  3. Người dùng chọn "Chỉnh sửa" thông tin muốn thay đổi.  
  4. Hệ thống cho phép người dùng nhập thông tin mới vào các trường tương ứng.  
  5. Người dùng nhấn "Lưu thay đổi".  
  6. Hệ thống \<\<bao gồm\>\> UC-S02: Xác thực Dữ liệu Đầu vào (ví dụ: định dạng số điện thoại, các trường bắt buộc cho địa chỉ).  
  7. Nếu dữ liệu hợp lệ, hệ thống cập nhật thông tin người dùng trong cơ sở dữ liệu.  
  8. Hệ thống hiển thị thông báo "Cập nhật thông tin thành công" và làm mới thông tin trên trang.  
* **Luồng thay thế:**  
  * **6a. Dữ liệu không hợp lệ:**  
    1. Hệ thống hiển thị thông báo lỗi cụ thể cho từng trường không hợp lệ.  
    2. Người dùng sửa lại thông tin. Quay lại bước 4\.  
* **Luồng ngoại lệ:**  
  * **7a. Lỗi hệ thống khi cập nhật thông tin:**  
    1. Hệ thống hiển thị thông báo lỗi chung.  
* **Bao gồm (Includes):** UC-S02: Xác thực Dữ liệu Đầu vào.  
* **Mở rộng (Extends):** Không có.

### **3.2. Duyệt Web và Khám Phá Sản Phẩm**

#### **UC-C04: Xem Trang Chủ**

* **ID Use Case:** UC-C04  
* **Tên Use Case:** Xem Trang Chủ  
* **Tác nhân:** Khách hàng (Đã đăng nhập hoặc chưa đăng nhập)  
* **Mô tả:** Hiển thị trang chính của website với các sản phẩm nổi bật, bộ sưu tập mới, chương trình khuyến mãi hoặc các thiết kế phổ biến của người dùng (nếu có). Cung cấp điều hướng đến các khu vực khác của trang web.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng truy cập vào địa chỉ URL gốc của trang web.  
* **Hậu điều kiện (Thành công):**  
  * Trang chủ được hiển thị đầy đủ nội dung.  
  * Người dùng có thể tương tác với các yếu tố trên trang chủ (ví dụ: nhấp vào sản phẩm, banner).  
* **Hậu điều kiện (Thất bại):**  
  * Trang chủ không tải được hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng mở trình duyệt và truy cập vào URL của trang web.  
  2. Hệ thống truy xuất dữ liệu cần thiết cho trang chủ (ví dụ: danh sách sản phẩm nổi bật, banner khuyến mãi, các thiết kế được chọn lọc).  
  3. Hệ thống hiển thị trang chủ với các thành phần:  
     * Thanh điều hướng chính (menu).  
     * Khu vực hiển thị sản phẩm nổi bật/mới.  
     * Khu vực hiển thị banner quảng cáo/khuyến mãi.  
     * (Tùy chọn) Khu vực hiển thị các thiết kế tùy chỉnh phổ biến hoặc được giới thiệu.  
     * Chân trang (footer) với các liên kết thông tin.  
  4. Người dùng có thể nhấp vào các liên kết hoặc sản phẩm để điều hướng đến các trang khác.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **2a. Lỗi truy xuất dữ liệu:**  
    1. Hệ thống có thể hiển thị một phiên bản trang chủ rút gọn hoặc thông báo lỗi "Không thể tải nội dung trang chủ. Vui lòng thử lại sau."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

### **3.3. Công Cụ Thiết Kế Tùy Chỉnh**

Công cụ thiết kế là "tính năng nổi bật" của nền tảng. Do đó, khả năng sử dụng (usability) 8 và hiệu năng (performance) 10 của nó là tối quan trọng. Mỗi bước trong quá trình thiết kế phải trực quan và phản hồi nhanh chóng. Nếu tính năng cốt lõi này khó sử dụng (vi phạm các nguyên tắc về khả năng học hỏi, hiệu quả, phòng ngừa lỗi của 8) hoặc chậm chạp (vi phạm thời gian phản hồi của 12), trang web sẽ mất đi sức hấp dẫn chính. Điều này ảnh hưởng trực tiếp đến sự hài lòng của người dùng, có khả năng dẫn đến tỷ lệ thoát trang cao từ trang thiết kế và ít chuyển đổi mua hàng hơn, bất kể các chức năng thương mại điện tử khác hoạt động tốt đến đâu. Do đó, các UC liên quan đến công cụ thiết kế phải được chi tiết hóa với sự nhấn mạnh mạnh mẽ vào tương tác người dùng và phản hồi của hệ thống.

#### **UC-C05: Truy Cập Công Cụ Thiết Kế**

* **ID Use Case:** UC-C05  
* **Tên Use Case:** Truy Cập Công Cụ Thiết Kế  
* **Tác nhân:** Khách hàng (Đã đăng nhập hoặc chưa đăng nhập, nhưng một số chức năng như lưu có thể yêu cầu đăng nhập)  
* **Mô tả:** Cho phép người dùng điều hướng đến giao diện thiết kế tùy chỉnh.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trên một trang của website (ví dụ: trang chủ, trang chi tiết sản phẩm áo mockup).  
* **Hậu điều kiện (Thành công):**  
  * Giao diện công cụ thiết kế được hiển thị.  
  * Một mẫu áo mockup mặc định được tải lên khung thiết kế.  
* **Hậu điều kiện (Thất bại):**  
  * Công cụ thiết kế không tải được hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng nhấp vào một liên kết hoặc nút "Thiết kế ngay", "Tùy chỉnh sản phẩm" hoặc tương tự từ trang chủ, trang danh mục sản phẩm, hoặc trang chi tiết một mẫu áo cơ sở.  
  2. Hệ thống tải giao diện công cụ thiết kế.  
  3. Hệ thống hiển thị một mẫu áo mockup mặc định (ví dụ: áo thun trắng) trên khung thiết kế.  
  4. Hệ thống hiển thị các tùy chọn và công cụ thiết kế (ví dụ: chọn màu áo, thêm chữ, thêm ảnh).  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **2a. Lỗi tải giao diện thiết kế:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể tải công cụ thiết kế. Vui lòng thử lại sau."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C06: Chọn Mẫu Áo Cơ Sở và Màu Sắc**

* **ID Use Case:** UC-C06  
* **Tên Use Case:** Chọn Mẫu Áo Cơ Sở và Màu Sắc  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Cho phép người dùng chọn loại áo (nếu có nhiều loại) và màu sắc cho áo thú cưng từ danh sách các tùy chọn có sẵn. Mockup sẽ cập nhật để phản ánh lựa chọn.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trong giao diện công cụ thiết kế (UC-C05).  
* **Hậu điều kiện (Thành công):**  
  * Mẫu áo và màu sắc được người dùng chọn được áp dụng cho mockup trên khung thiết kế.  
  * Lựa chọn được lưu trữ tạm thời cho phiên thiết kế hiện tại.  
* **Hậu điều kiện (Thất bại):**  
  * Lựa chọn không được áp dụng, mockup không thay đổi.  
* **Luồng chính (Basic Path):**  
  1. Hệ thống hiển thị danh sách các loại áo có sẵn (nếu có nhiều hơn một loại, ví dụ: áo thun, áo hoodie).  
  2. Người dùng chọn một loại áo (nếu có).  
  3. Hệ thống hiển thị danh sách các màu sắc có sẵn cho loại áo đã chọn.  
  4. Người dùng chọn một màu sắc.  
  5. Hệ thống cập nhật hình ảnh mockup trên khung thiết kế để hiển thị loại áo và màu sắc đã chọn.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **5a. Lỗi cập nhật mockup:**  
    1. Hệ thống có thể hiển thị thông báo lỗi nhỏ hoặc không thay đổi mockup.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C07: Thêm Chữ Vào Thiết Kế**

* **ID Use Case:** UC-C07  
* **Tên Use Case:** Thêm Chữ Vào Thiết Kế  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Cho phép người dùng thêm và tùy chỉnh văn bản trên thiết kế áo.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trong giao diện công cụ thiết kế (UC-C05).  
  * Một mẫu áo đã được chọn (UC-C06).  
* **Hậu điều kiện (Thành công):**  
  * Văn bản được thêm vào khung thiết kế và hiển thị trên mockup.  
  * Người dùng có thể tiếp tục chỉnh sửa văn bản (UC-C09).  
* **Hậu điều kiện (Thất bại):**  
  * Văn bản không được thêm.  
* **Luồng chính (Basic Path):**  
  1. Người dùng chọn tùy chọn "Thêm chữ".  
  2. Hệ thống hiển thị một hộp nhập văn bản và các tùy chọn định dạng (ví dụ: phông chữ, kích thước, màu chữ, căn lề).  
  3. Người dùng nhập nội dung văn bản.  
  4. Người dùng chọn các tùy chọn định dạng mong muốn.  
  5. Người dùng xác nhận việc thêm chữ (ví dụ: nhấn nút "Áp dụng" hoặc khi focus ra khỏi ô nhập liệu).  
  6. Hệ thống hiển thị đối tượng văn bản trên khung thiết kế (canvas) và trên mockup.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **6a. Lỗi hiển thị văn bản:**  
    1. Hệ thống có thể không hiển thị văn bản hoặc hiển thị không chính xác.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C08: Tải Ảnh Lên Thiết Kế**

* **ID Use Case:** UC-C08  
* **Tên Use Case:** Tải Ảnh Lên Thiết Kế  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Cho phép người dùng tải lên một hình ảnh từ thiết bị của họ để sử dụng trong thiết kế.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trong giao diện công cụ thiết kế (UC-C05).  
  * Một mẫu áo đã được chọn (UC-C06).  
* **Hậu điều kiện (Thành công):**  
  * Hình ảnh được tải lên, hiển thị trên khung thiết kế và mockup.  
  * Người dùng có thể tiếp tục chỉnh sửa hình ảnh (UC-C09).  
* **Hậu điều kiện (Thất bại):**  
  * Hình ảnh không được tải lên hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng chọn tùy chọn "Tải ảnh lên".  
  2. Hệ thống mở hộp thoại chọn tệp của hệ điều hành.  
  3. Người dùng chọn một tệp hình ảnh (ví dụ: JPG, PNG) từ thiết bị của họ và xác nhận.  
  4. Hệ thống tải tệp hình ảnh lên máy chủ (hoặc xử lý phía client tùy theo kiến trúc).  
  5. Hệ thống thực hiện kiểm tra cơ bản về tệp (ví dụ: định dạng, kích thước tệp – xem NFR-SEC-04).  
  6. Nếu tệp hợp lệ, hệ thống hiển thị hình ảnh trên khung thiết kế (canvas) và trên mockup.  
* **Luồng thay thế:**  
  * **5a. Tệp không hợp lệ (sai định dạng, quá lớn):**  
    1. Hệ thống hiển thị thông báo lỗi (ví dụ: "Định dạng tệp không được hỗ trợ" hoặc "Kích thước tệp quá lớn").  
    2. Người dùng có thể chọn tệp khác. Quay lại bước 2\.  
* **Luồng ngoại lệ:**  
  * **4a. Lỗi tải tệp lên:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể tải ảnh lên. Vui lòng thử lại."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.  
* **Lưu ý:** Việc tải ảnh lên là một dạng Nội dung do người dùng tạo ra (UGC). Cần có các biện pháp kiểm tra và xác thực phía máy chủ để đảm bảo an ninh.13

#### **UC-C09: Thao Tác Với Các Yếu Tố Thiết Kế**

* **ID Use Case:** UC-C09  
* **Tên Use Case:** Thao Tác Với Các Yếu Tố Thiết Kế  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Cho phép người dùng điều chỉnh các yếu tố (văn bản, hình ảnh) trên khung thiết kế như thay đổi kích thước, vị trí, xoay, thay đổi thứ tự lớp.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trong giao diện công cụ thiết kế (UC-C05).  
  * Có ít nhất một yếu tố thiết kế (văn bản hoặc hình ảnh) đã được thêm vào khung thiết kế (UC-C07, UC-C08).  
* **Hậu điều kiện (Thành công):**  
  * Các thay đổi đối với yếu tố thiết kế được áp dụng và hiển thị trên khung thiết kế và mockup.  
* **Hậu điều kiện (Thất bại):**  
  * Thay đổi không được áp dụng.  
* **Luồng chính (Basic Path):**  
  1. Người dùng chọn một yếu tố thiết kế (văn bản hoặc hình ảnh) trên khung thiết kế.  
  2. Hệ thống hiển thị các điều khiển thao tác cho yếu tố đó (ví dụ: các điểm neo để thay đổi kích thước, điều khiển xoay).  
  3. Người dùng thực hiện một hoặc nhiều thao tác sau:  
     * Kéo để di chuyển yếu tố.  
     * Kéo các điểm neo để thay đổi kích thước.  
     * Sử dụng điều khiển xoay để xoay yếu tố.  
     * Sử dụng các tùy chọn để thay đổi thứ tự lớp (đưa lên trên, đưa xuống dưới).  
     * Xóa yếu tố.  
  4. Hệ thống cập nhật trực quan yếu tố trên khung thiết kế và trên mockup theo thời gian thực hoặc gần thời gian thực (xem NFR-PERF-01).  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **4a. Lỗi cập nhật hiển thị:**  
    1. Hệ thống có thể không phản ánh thay đổi hoặc phản ánh không chính xác.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C10: Xem Trước Thiết Kế Trên Mockup**

* **ID Use Case:** UC-C10  
* **Tên Use Case:** Xem Trước Thiết Kế Trên Mockup  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Cung cấp một bản xem trước trực quan, cập nhật liên tục về cách thiết kế hiện tại sẽ trông như thế nào trên mẫu áo đã chọn.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trong giao diện công cụ thiết kế (UC-C05).  
* **Hậu điều kiện (Thành công):**  
  * Mockup được cập nhật chính xác để phản ánh trạng thái hiện tại của thiết kế trên khung vẽ.  
* **Hậu điều kiện (Thất bại):**  
  * Mockup không được cập nhật hoặc cập nhật không chính xác.  
* **Luồng chính (Basic Path):**  
  1. Trong suốt quá trình người dùng thực hiện các thay đổi trên khung thiết kế (UC-C06, UC-C07, UC-C08, UC-C09), hệ thống tự động cập nhật hình ảnh mockup.  
  2. Mockup hiển thị thiết kế của người dùng được đặt trên hình ảnh của mẫu áo đã chọn, giúp người dùng hình dung sản phẩm cuối cùng.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **1a. Độ trễ khi cập nhật mockup:**  
    1. Nếu có độ trễ đáng kể, trải nghiệm người dùng có thể bị ảnh hưởng (xem NFR-PERF-02).  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C11: Lưu Thiết Kế Vào "Bộ Sưu Tập Của Tôi"**

* **ID Use Case:** UC-C11  
* **Tên Use Case:** Lưu Thiết Kế Vào "Bộ Sưu Tập Của Tôi"  
* **Tác nhân:** Khách hàng (Phải đăng nhập)  
* **Mô tả:** Cho phép người dùng lưu thiết kế hiện tại vào bộ sưu tập cá nhân của họ. Hệ thống sẽ chuyển đổi nội dung trên khung thiết kế thành chuỗi base64 và lưu trữ nó.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập vào hệ thống.  
  * Người dùng đang ở trong giao diện công cụ thiết kế (UC-C05) và đã tạo một thiết kế.  
  * Mẫu áo cơ sở và màu sắc đã được chọn (UC-C06).  
* **Hậu điều kiện (Thành công):**  
  * Thiết kế được lưu dưới dạng chuỗi base64, liên kết với tài khoản người dùng và thông tin mẫu áo.  
  * Thiết kế xuất hiện trong trang "Bộ sưu tập của tôi" (UC-C12).  
  * Người dùng nhận được thông báo lưu thành công.  
* **Hậu điều kiện (Thất bại):**  
  * Thiết kế không được lưu.  
  * Người dùng nhận được thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng hoàn tất thiết kế và nhấn nút "Lưu vào bộ sưu tập" (hoặc tương tự).  
  2. Hệ thống chụp lại nội dung trên khung thiết kế (canvas).  
  3. Hệ thống chuyển đổi hình ảnh chụp được thành một chuỗi dữ liệu base64.  
  4. Hệ thống lưu trữ chuỗi base64 này cùng với ID người dùng, ID mẫu áo đã chọn, màu sắc và các siêu dữ liệu liên quan (ví dụ: tên thiết kế do người dùng đặt \- tùy chọn) vào cơ sở dữ liệu (MongoDB).  
  5. Hệ thống hiển thị thông báo "Thiết kế đã được lưu thành công vào bộ sưu tập của bạn."  
* **Luồng thay thế:**  
  * **1a. Người dùng chưa đăng nhập:**  
    1. Hệ thống nhắc người dùng đăng nhập hoặc đăng ký để lưu thiết kế.  
    2. Nếu người dùng đăng nhập/đăng ký thành công, quay lại bước 1\.  
* **Luồng ngoại lệ:**  
  * **3a. Lỗi chuyển đổi sang base64:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể xử lý thiết kế. Vui lòng thử lại."  
  * **4a. Lỗi lưu vào cơ sở dữ liệu:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể lưu thiết kế. Vui lòng thử lại sau."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.  
* **Lưu ý:** Quyết định sử dụng base64 để lưu thiết kế có những tác động cần xem xét. Mặc dù thuận tiện cho việc tạo và hiển thị phía client bằng JavaScript và React, base64 làm tăng kích thước dữ liệu hình ảnh khoảng 33% so với dữ liệu nhị phân. Điều này ảnh hưởng đến:  
  * **Lưu trữ (MongoDB):** Lưu trữ nhiều chuỗi base64 lớn sẽ tiêu tốn nhiều không gian cơ sở dữ liệu hơn theo thời gian.13  
  * **Hiệu năng API/Tải trang:** Khi truy xuất "Bộ sưu tập của tôi" hoặc các mặt hàng trong giỏ hàng có thiết kế tùy chỉnh, việc truyền các chuỗi base64 này làm tăng kích thước phản hồi API và có thể làm chậm quá trình hiển thị trang.10  
  * **Xử lý trong tương lai:** Nếu cần thao tác với các hình ảnh này ở phía máy chủ sau này (ví dụ: để tối ưu hóa cho việc in ấn, công cụ xem xét của quản trị viên), chuỗi base64 phải được giải mã trở lại thành định dạng hình ảnh, thêm một bước xử lý. Đây không nhất thiết là một lựa chọn "tồi", nhưng những tác động của nó phải được ghi nhận trong các Yêu cầu Phi Chức năng (NFR) về hiệu năng và khả năng mở rộng.

### **3.4. Quản Lý Bộ Sưu Tập**

#### **UC-C12: Xem "Bộ Sưu Tập Của Tôi"**

* **ID Use Case:** UC-C12  
* **Tên Use Case:** Xem "Bộ Sưu Tập Của Tôi"  
* **Tác nhân:** Khách hàng (Đã đăng nhập)  
* **Mô tả:** Hiển thị tất cả các thiết kế đã được người dùng lưu, thường là hình ảnh thiết kế trên mockup tương ứng.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập vào hệ thống.  
  * Người dùng điều hướng đến trang "Bộ sưu tập của tôi".  
* **Hậu điều kiện (Thành công):**  
  * Tất cả các thiết kế đã lưu của người dùng được hiển thị.  
  * Người dùng có thể tương tác với các thiết kế (ví dụ: chọn để chỉnh sửa, xóa, thêm vào giỏ hàng).  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải danh sách thiết kế hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng truy cập trang "Bộ sưu tập của tôi".  
  2. Hệ thống truy vấn cơ sở dữ liệu để lấy tất cả các thiết kế (dưới dạng chuỗi base64 và siêu dữ liệu liên quan) thuộc về người dùng hiện tại.  
  3. Hệ thống hiển thị mỗi thiết kế dưới dạng một mục, thường là hình ảnh mockup với thiết kế đã được áp dụng.  
  4. Đối với mỗi thiết kế, hệ thống cung cấp các tùy chọn như "Chỉnh sửa", "Xóa", "Thêm vào giỏ hàng".  
* **Luồng thay thế:**  
  * **3a. Người dùng chưa có thiết kế nào:**  
    1. Hệ thống hiển thị thông báo "Bạn chưa có thiết kế nào trong bộ sưu tập. Hãy bắt đầu sáng tạo\!" cùng với một liên kết đến công cụ thiết kế.  
* **Luồng ngoại lệ:**  
  * **2a. Lỗi truy xuất dữ liệu từ cơ sở dữ liệu:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể tải bộ sưu tập của bạn. Vui lòng thử lại sau."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C13: Chỉnh Sửa/Xóa Thiết Kế Từ "Bộ Sưu Tập Của Tôi"**

* **ID Use Case:** UC-C13  
* **Tên Use Case:** Chỉnh Sửa/Xóa Thiết Kế Từ "Bộ Sưu Tập Của Tôi"  
* **Tác nhân:** Khách hàng (Đã đăng nhập)  
* **Mô tả:** Cho phép người dùng mở lại một thiết kế đã lưu trong công cụ thiết kế để chỉnh sửa thêm hoặc xóa nó khỏi bộ sưu tập của họ.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập và đang ở trang "Bộ sưu tập của tôi" (UC-C12).  
  * Có ít nhất một thiết kế trong bộ sưu tập.  
* **Hậu điều kiện (Thành công):**  
  * **Chỉnh sửa:** Thiết kế được tải lại vào công cụ thiết kế, sẵn sàng để chỉnh sửa.  
  * **Xóa:** Thiết kế được xóa khỏi bộ sưu tập của người dùng và không còn hiển thị.  
* **Hậu điều kiện (Thất bại):**  
  * Hành động không thành công, thiết kế vẫn giữ nguyên hoặc không thể mở để chỉnh sửa.  
* **Luồng chính (Chỉnh sửa):**  
  1. Người dùng chọn tùy chọn "Chỉnh sửa" cho một thiết kế cụ thể trong bộ sưu tập.  
  2. Hệ thống truy xuất dữ liệu thiết kế (bao gồm chuỗi base64 và thông tin mẫu áo/màu sắc).  
  3. Hệ thống chuyển hướng người dùng đến công cụ thiết kế (UC-C05).  
  4. Hệ thống tải lại mẫu áo, màu sắc và các yếu tố thiết kế (từ base64 hoặc dữ liệu cấu trúc nếu có) vào khung thiết kế.  
  5. Người dùng có thể tiếp tục chỉnh sửa (UC-C07, UC-C08, UC-C09) và lưu lại (UC-C11 \- có thể ghi đè hoặc lưu thành bản mới).  
* **Luồng chính (Xóa):**  
  1. Người dùng chọn tùy chọn "Xóa" cho một thiết kế cụ thể trong bộ sưu tập.  
  2. Hệ thống hiển thị hộp thoại xác nhận "Bạn có chắc chắn muốn xóa thiết kế này không?"  
  3. Người dùng xác nhận xóa.  
  4. Hệ thống xóa bản ghi thiết kế tương ứng khỏi cơ sở dữ liệu.  
  5. Hệ thống làm mới danh sách bộ sưu tập, không còn hiển thị thiết kế đã xóa.  
  6. Hệ thống hiển thị thông báo "Thiết kế đã được xóa thành công."  
* **Luồng thay thế:**  
  * **Xóa \- 3a. Người dùng hủy bỏ việc xóa:**  
    1. Hộp thoại xác nhận đóng lại, không có hành động nào được thực hiện.  
* **Luồng ngoại lệ:**  
  * **Chỉnh sửa \- 4a. Lỗi tải lại thiết kế:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể mở thiết kế để chỉnh sửa."  
  * **Xóa \- 4a. Lỗi xóa thiết kế khỏi cơ sở dữ liệu:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể xóa thiết kế. Vui lòng thử lại sau."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

### **3.5. Giỏ Hàng và Thanh Toán**

#### **UC-C14: Thêm Thiết Kế Từ "Bộ Sưu Tập Của Tôi" Vào Giỏ Hàng**

* **ID Use Case:** UC-C14  
* **Tên Use Case:** Thêm Thiết Kế Từ "Bộ Sưu Tập Của Tôi" Vào Giỏ Hàng  
* **Tác nhân:** Khách hàng (Đã đăng nhập)  
* **Mô tả:** Cho phép người dùng chọn một thiết kế cụ thể từ bộ sưu tập của họ và thêm nó vào giỏ hàng để mua, có thể chỉ định số lượng.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập và đang ở trang "Bộ sưu tập của tôi" (UC-C12) hoặc xem chi tiết một thiết kế.  
  * Giỏ hàng đã được khởi tạo (có thể trống).  
* **Hậu điều kiện (Thành công):**  
  * Thiết kế đã chọn (dưới dạng một mặt hàng sản phẩm tùy chỉnh) được thêm vào giỏ hàng với số lượng chỉ định.  
  * Số lượng mặt hàng trong biểu tượng giỏ hàng (nếu có) được cập nhật.  
  * Người dùng nhận được thông báo thành công.  
* **Hậu điều kiện (Thất bại):**  
  * Mặt hàng không được thêm vào giỏ hàng.  
  * Người dùng nhận được thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng chọn một thiết kế từ bộ sưu tập của họ.  
  2. Người dùng chọn tùy chọn "Thêm vào giỏ hàng" cho thiết kế đó.  
  3. Hệ thống có thể yêu cầu người dùng nhập số lượng (mặc định là 1).  
  4. Người dùng nhập số lượng (nếu có) và xác nhận.  
  5. Hệ thống tạo một mục hàng trong giỏ hàng, liên kết với thiết kế đã chọn (bao gồm thông tin mẫu áo, màu sắc, và dữ liệu thiết kế base64) và số lượng.  
  6. Hệ thống tính toán lại tổng giá trị giỏ hàng.  
  7. Hệ thống hiển thị thông báo "Sản phẩm đã được thêm vào giỏ hàng."  
  8. (Tùy chọn) Hiển thị một bản tóm tắt nhỏ của giỏ hàng hoặc một liên kết đến giỏ hàng.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **5a. Lỗi thêm vào giỏ hàng (ví dụ: lỗi cơ sở dữ liệu, sản phẩm không còn tồn tại):**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C15: Thêm Toàn Bộ Bộ Sưu Tập Vào Giỏ Hàng**

* **ID Use Case:** UC-C15  
* **Tên Use Case:** Thêm Toàn Bộ Bộ Sưu Tập Vào Giỏ Hàng  
* **Tác nhân:** Khách hàng (Đã đăng nhập)  
* **Mô tả:** Cho phép người dùng thêm tất cả các thiết kế từ một bộ sưu tập cụ thể (hoặc bộ sưu tập chính của họ) vào giỏ hàng. Mỗi thiết kế trong bộ sưu tập được coi là một mặt hàng riêng biệt.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập và đang ở trang "Bộ sưu tập của tôi" (UC-C12).  
  * Bộ sưu tập có ít nhất một thiết kế.  
* **Hậu điều kiện (Thành công):**  
  * Tất cả các thiết kế trong bộ sưu tập được thêm vào giỏ hàng dưới dạng các mục hàng riêng biệt (mỗi mục có số lượng mặc định, ví dụ: 1).  
  * Giỏ hàng được cập nhật.  
  * Người dùng nhận được thông báo thành công.  
* **Hậu điều kiện (Thất bại):**  
  * Không có mặt hàng nào được thêm hoặc chỉ một phần được thêm.  
  * Người dùng nhận được thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng chọn tùy chọn "Thêm toàn bộ bộ sưu tập vào giỏ hàng" (hoặc tương tự) trên trang bộ sưu tập.  
  2. Hệ thống lặp qua từng thiết kế trong bộ sưu tập của người dùng.  
  3. Đối với mỗi thiết kế, hệ thống tạo một mục hàng trong giỏ hàng với số lượng mặc định (ví dụ: 1), tương tự như UC-C14 bước 5\.  
  4. Sau khi xử lý tất cả các thiết kế, hệ thống tính toán lại tổng giá trị giỏ hàng.  
  5. Hệ thống hiển thị thông báo "Toàn bộ bộ sưu tập đã được thêm vào giỏ hàng."  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **3a. Lỗi khi thêm một hoặc nhiều thiết kế vào giỏ hàng:**  
    1. Hệ thống có thể cố gắng thêm càng nhiều càng tốt và báo cáo lỗi cho những mục không thành công, hoặc hủy toàn bộ thao tác.  
    2. Hệ thống hiển thị thông báo lỗi thích hợp.  
* **Bao gồm (Includes):** Lặp lại logic của UC-C14 cho mỗi mục.  
* **Mở rộng (Extends):** Không có.  
* **Lưu ý:** Chức năng "Thêm toàn bộ bộ sưu tập" có thể phức tạp. Nếu một người dùng có 10 thiết kế trong một bộ sưu tập và nhấp vào "Thêm toàn bộ bộ sưu tập", điều này có tạo ra 10 mục hàng trong giỏ hàng không? Số lượng cho mỗi mục được xử lý như thế nào? UC này cần được định nghĩa cẩn thận để tránh sự mơ hồ cho các nhà phát triển về cách một "bộ sưu tập" chuyển thành các mục trong giỏ hàng và sau đó thành một đơn hàng. Điều này cũng có những tác động về hiệu năng đối với việc cập nhật giỏ hàng.

#### **UC-C16: Xem Giỏ Hàng**

* **ID Use Case:** UC-C16  
* **Tên Use Case:** Xem Giỏ Hàng  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Hiển thị nội dung hiện tại của giỏ hàng, bao gồm danh sách các mặt hàng, số lượng, giá của từng mặt hàng, và tổng giá trị đơn hàng.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã thêm ít nhất một mặt hàng vào giỏ hàng hoặc truy cập trực tiếp vào trang giỏ hàng.  
* **Hậu điều kiện (Thành công):**  
  * Trang giỏ hàng được hiển thị với tất cả các thông tin chính xác.  
  * Người dùng có thể tiến hành cập nhật giỏ hàng (UC-C17) hoặc thanh toán (UC-C18).  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải trang giỏ hàng hoặc hiển thị thông tin không chính xác.  
* **Luồng chính (Basic Path):**  
  1. Người dùng nhấp vào biểu tượng giỏ hàng hoặc liên kết "Xem giỏ hàng".  
  2. Hệ thống truy xuất thông tin các mặt hàng hiện có trong giỏ hàng của người dùng (hoặc phiên làm việc nếu chưa đăng nhập và cho phép mua hàng ẩn danh).  
  3. Hệ thống hiển thị danh sách các mặt hàng, mỗi mặt hàng bao gồm:  
     * Hình ảnh thu nhỏ của thiết kế trên mockup.  
     * Mô tả ngắn (ví dụ: "Áo thun thú cưng tùy chỉnh \- Màu trắng \- Size M").  
     * Giá đơn vị.  
     * Số lượng (có thể chỉnh sửa).  
     * Giá thành tiền cho mặt hàng đó.  
  4. Hệ thống hiển thị tổng phụ, chi phí vận chuyển (nếu đã tính), và tổng cộng cuối cùng của đơn hàng.  
  5. Hệ thống cung cấp các nút hành động như "Tiếp tục mua sắm", "Cập nhật giỏ hàng", "Tiến hành thanh toán".  
* **Luồng thay thế:**  
  * **2a. Giỏ hàng trống:**  
    1. Hệ thống hiển thị thông báo "Giỏ hàng của bạn đang trống" cùng với một liên kết để duyệt sản phẩm hoặc bắt đầu thiết kế.  
* **Luồng ngoại lệ:**  
  * **2b. Lỗi truy xuất thông tin giỏ hàng:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể tải thông tin giỏ hàng. Vui lòng thử lại."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C17: Cập Nhật Giỏ Hàng**

* **ID Use Case:** UC-C17  
* **Tên Use Case:** Cập Nhật Giỏ Hàng  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Cho phép người dùng thay đổi số lượng của các mặt hàng trong giỏ hàng hoặc xóa các mặt hàng khỏi giỏ hàng.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trang xem giỏ hàng (UC-C16).  
  * Giỏ hàng có ít nhất một mặt hàng.  
* **Hậu điều kiện (Thành công):**  
  * Giỏ hàng được cập nhật với số lượng mới hoặc mặt hàng đã bị xóa.  
  * Tổng giá trị đơn hàng được tính toán lại và hiển thị.  
* **Hậu điều kiện (Thất bại):**  
  * Thay đổi không được áp dụng.  
* **Luồng chính (Thay đổi số lượng):**  
  1. Người dùng thay đổi giá trị trong ô số lượng của một mặt hàng.  
  2. Người dùng nhấp vào nút "Cập nhật giỏ hàng" (hoặc hệ thống tự động cập nhật khi thay đổi).  
  3. Hệ thống cập nhật số lượng cho mặt hàng đó trong giỏ hàng.  
  4. Hệ thống tính toán lại giá thành tiền cho mặt hàng đó và tổng giá trị đơn hàng.  
  5. Hệ thống làm mới hiển thị giỏ hàng.  
* **Luồng chính (Xóa mặt hàng):**  
  1. Người dùng nhấp vào nút "Xóa" (hoặc biểu tượng thùng rác) bên cạnh một mặt hàng.  
  2. Hệ thống xóa mặt hàng đó khỏi giỏ hàng.  
  3. Hệ thống tính toán lại tổng giá trị đơn hàng.  
  4. Hệ thống làm mới hiển thị giỏ hàng.  
* **Luồng thay thế:**  
  * **1a. Nhập số lượng không hợp lệ (ví dụ: số âm, không phải số):**  
    1. Hệ thống bỏ qua thay đổi hoặc đặt lại về giá trị hợp lệ gần nhất (ví dụ: 1\) và có thể hiển thị thông báo.  
* **Luồng ngoại lệ:**  
  * **3a / 2a. Lỗi cập nhật giỏ hàng:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể cập nhật giỏ hàng. Vui lòng thử lại."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C18: Tiến Hành Thanh Toán**

* **ID Use Case:** UC-C18  
* **Tên Use Case:** Tiến Hành Thanh Toán  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Bắt đầu quy trình thanh toán cho các mặt hàng trong giỏ hàng. Có thể yêu cầu đăng nhập nếu người dùng chưa đăng nhập và không hỗ trợ thanh toán ẩn danh.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đang ở trang xem giỏ hàng (UC-C16) hoặc một điểm khác có tùy chọn thanh toán (ví dụ: mini-cart).  
  * Giỏ hàng có ít nhất một mặt hàng.  
* **Hậu điều kiện (Thành công):**  
  * Người dùng được chuyển hướng đến bước đầu tiên của quy trình thanh toán (ví dụ: nhập thông tin giao hàng \- UC-C19).  
* **Hậu điều kiện (Thất bại):**  
  * Người dùng vẫn ở trang giỏ hàng hoặc nhận thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng nhấp vào nút "Tiến hành thanh toán" (hoặc tương tự).  
  2. Hệ thống kiểm tra xem người dùng đã đăng nhập chưa.  
  3. Nếu người dùng chưa đăng nhập và hệ thống yêu cầu đăng nhập để thanh toán: a. Hệ thống chuyển hướng người dùng đến trang đăng nhập (UC-C02) hoặc đăng ký (UC-C01). b. Sau khi đăng nhập/đăng ký thành công, hệ thống chuyển người dùng đến bước tiếp theo của quy trình thanh toán.  
  4. Nếu người dùng đã đăng nhập hoặc hệ thống cho phép thanh toán ẩn danh, hệ thống chuyển người dùng đến trang nhập thông tin giao hàng (UC-C19).  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **4a. Lỗi chuyển hướng hoặc lỗi hệ thống:**  
    1. Hệ thống hiển thị thông báo lỗi.  
* **Bao gồm (Includes):** (Có thể) UC-S01: Xác Thực Người Dùng (nếu yêu cầu đăng nhập).  
* **Mở rộng (Extends):** Không có.

#### **UC-C19: Nhập Thông Tin Giao Hàng**

* **ID Use Case:** UC-C19  
* **Tên Use Case:** Nhập Thông Tin Giao Hàng  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Thu thập hoặc xác nhận địa chỉ giao hàng của khách hàng.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã bắt đầu quy trình thanh toán (UC-C18).  
* **Hậu điều kiện (Thành công):**  
  * Thông tin giao hàng hợp lệ được lưu trữ cho đơn hàng hiện tại.  
  * Người dùng được chuyển đến bước tiếp theo (ví dụ: chọn phương thức thanh toán hoặc nhập thông tin thanh toán \- UC-C20).  
* **Hậu điều kiện (Thất bại):**  
  * Người dùng vẫn ở trang nhập thông tin giao hàng với thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Hệ thống hiển thị biểu mẫu nhập thông tin giao hàng, yêu cầu: Họ tên người nhận, Số điện thoại, Địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố).  
  2. Nếu người dùng đã đăng nhập và có địa chỉ đã lưu, hệ thống có thể tự động điền hoặc cho phép chọn từ sổ địa chỉ.  
  3. Người dùng nhập hoặc xác nhận thông tin giao hàng.  
  4. Người dùng nhấn "Tiếp tục" (hoặc tương tự).  
  5. Hệ thống \<\<bao gồm\>\> UC-S02: Xác thực Dữ liệu Đầu vào (kiểm tra các trường bắt buộc, định dạng).  
  6. Nếu dữ liệu hợp lệ, hệ thống lưu trữ tạm thời thông tin giao hàng cho đơn hàng và chuyển người dùng đến bước tiếp theo.  
* **Luồng thay thế:**  
  * **2a. Người dùng chọn sử dụng địa chỉ đã lưu:**  
    1. Người dùng chọn một địa chỉ từ danh sách các địa chỉ đã lưu.  
    2. Hệ thống tự động điền thông tin vào biểu mẫu. Người dùng có thể chỉnh sửa nếu cần.  
  * **3a. Người dùng muốn lưu địa chỉ này cho lần sau (nếu là người dùng đã đăng nhập):**  
    1. Người dùng chọn tùy chọn "Lưu địa chỉ này".  
    2. Sau khi xác thực thành công (bước 5), hệ thống cũng lưu địa chỉ này vào sổ địa chỉ của người dùng.  
  * **5a. Dữ liệu không hợp lệ:**  
    1. Hệ thống hiển thị thông báo lỗi cụ thể cho từng trường không hợp lệ.  
    2. Người dùng sửa lại thông tin. Quay lại bước 3\.  
* **Luồng ngoại lệ:**  
  * **6a. Lỗi hệ thống khi lưu thông tin:**  
    1. Hệ thống hiển thị thông báo lỗi chung.  
* **Bao gồm (Includes):** UC-S02: Xác thực Dữ liệu Đầu vào.  
* **Mở rộng (Extends):** Không có.

#### **UC-C20: Nhập Thông Tin Thanh Toán**

* **ID Use Case:** UC-C20  
* **Tên Use Case:** Nhập Thông Tin Thanh Toán  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Cung cấp giao diện để người dùng chọn phương thức thanh toán và nhập thông tin thanh toán cần thiết (ví dụ: chi tiết thẻ tín dụng, hoặc chuyển hướng đến cổng thanh toán).  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã cung cấp thông tin giao hàng hợp lệ (UC-C19).  
* **Hậu điều kiện (Thành công):**  
  * Thông tin thanh toán được thu thập hoặc người dùng được chuyển hướng thành công đến cổng thanh toán.  
  * Người dùng có thể tiến hành xác nhận đơn hàng (UC-C21).  
* **Hậu điều kiện (Thất bại):**  
  * Không thể xử lý thông tin thanh toán hoặc chuyển hướng thất bại.  
* **Luồng chính (Basic Path \- ví dụ: thanh toán qua cổng tích hợp):**  
  1. Hệ thống hiển thị các phương thức thanh toán được chấp nhận (ví dụ: Thẻ tín dụng/ghi nợ, Ví điện tử XYZ, Chuyển khoản ngân hàng).  
  2. Người dùng chọn một phương thức thanh toán.  
  3. **Nếu chọn Thẻ tín dụng/ghi nợ (nhập trực tiếp trên trang \- yêu cầu tuân thủ PCI DSS):** a. Hệ thống hiển thị các trường nhập: Số thẻ, Tên trên thẻ, Ngày hết hạn, Mã CVV. b. Người dùng nhập thông tin thẻ. c. Người dùng nhấn "Tiếp tục" hoặc "Xác nhận thanh toán". d. Hệ thống \<\<bao gồm\>\> UC-S02: Xác thực Dữ liệu Đầu vào (kiểm tra định dạng số thẻ, ngày hết hạn).  
  4. **Nếu chọn Ví điện tử XYZ hoặc cổng thanh toán khác:** a. Hệ thống chuyển hướng người dùng đến trang web của cổng thanh toán. b. Người dùng thực hiện các bước thanh toán trên trang của cổng. c. Sau khi hoàn tất, cổng thanh toán chuyển hướng người dùng trở lại trang web của cửa hàng với trạng thái giao dịch.  
  5. Người dùng được chuyển đến trang xác nhận đơn hàng.  
* **Luồng thay thế:**  
  * **3d1. Thông tin thẻ không hợp lệ:**  
    1. Hệ thống hiển thị thông báo lỗi.  
    2. Người dùng sửa lại thông tin. Quay lại bước 3b.  
* **Luồng ngoại lệ:**  
  * **4a1. Lỗi chuyển hướng đến cổng thanh toán:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể kết nối đến cổng thanh toán. Vui lòng thử lại."  
  * **4c1. Cổng thanh toán trả về lỗi hoặc hủy giao dịch:**  
    1. Hệ thống hiển thị thông báo từ cổng thanh toán (ví dụ: "Giao dịch bị từ chối", "Số dư không đủ").  
    2. Người dùng có thể chọn phương thức thanh toán khác hoặc thử lại.  
* **Bao gồm (Includes):** UC-S02: Xác thực Dữ liệu Đầu vào (cho thẻ), (Gián tiếp) UC-S03: Xử Lý Thanh Toán (sẽ được gọi ở UC-C21).  
* **Mở rộng (Extends):** Không có.

#### **UC-C21: Đặt Hàng**

* **ID Use Case:** UC-C21  
* **Tên Use Case:** Đặt Hàng  
* **Tác nhân:** Khách hàng  
* **Mô tả:** Hoàn tất quy trình mua hàng. Đơn hàng được tạo trong hệ thống và người dùng nhận được xác nhận.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Người dùng đã cung cấp thông tin giao hàng (UC-C19) và thông tin thanh toán (UC-C20).  
  * Người dùng đang ở trang xác nhận đơn hàng, hiển thị tóm tắt đơn hàng (sản phẩm, tổng tiền, địa chỉ giao hàng, phương thức thanh toán).  
* **Hậu điều kiện (Thành công):**  
  * Đơn hàng được tạo trong hệ thống với trạng thái "Chờ xử lý" hoặc tương tự.  
  * Thanh toán được xử lý thành công (nếu áp dụng).  
  * Giỏ hàng của người dùng được xóa (hoặc các mặt hàng đã đặt được đánh dấu).  
  * Người dùng nhận được email xác nhận đơn hàng.  
  * Người dùng được chuyển đến trang cảm ơn/xác nhận đơn hàng thành công.  
* **Hậu điều kiện (Thất bại):**  
  * Đơn hàng không được tạo.  
  * Người dùng nhận được thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng xem lại thông tin đơn hàng trên trang xác nhận.  
  2. Người dùng nhấn nút "Đặt hàng" (hoặc "Hoàn tất đơn hàng", "Xác nhận thanh toán").  
  3. Hệ thống \<\<bao gồm\>\> UC-S03: Xử Lý Thanh Toán (nếu chưa được xử lý trước đó, ví dụ: trường hợp thanh toán bằng thẻ nhập trực tiếp, hệ thống sẽ gửi yêu cầu đến cổng thanh toán tại bước này).  
  4. Nếu thanh toán thành công (hoặc phương thức là "Thanh toán khi nhận hàng" \- COD): a. Hệ thống tạo một bản ghi đơn hàng mới trong cơ sở dữ liệu, bao gồm tất cả chi tiết (thông tin khách hàng, sản phẩm với thiết kế base64, địa chỉ, thông tin thanh toán, tổng tiền, trạng thái đơn hàng). b. Hệ thống giảm số lượng tồn kho của các mẫu áo cơ sở (nếu quản lý tồn kho). c. Hệ thống xóa các mặt hàng đã đặt khỏi giỏ hàng của người dùng. d. Hệ thống gửi email xác nhận đơn hàng cho người dùng. e. Hệ thống chuyển hướng người dùng đến trang "Đặt hàng thành công" hiển thị mã đơn hàng và thông tin tóm tắt.  
* **Luồng thay thế:**  
  * **3a. Thanh toán thất bại:**  
    1. Hệ thống hiển thị thông báo lỗi từ UC-S03 (ví dụ: "Thanh toán không thành công. Vui lòng kiểm tra lại thông tin thẻ hoặc chọn phương thức khác.").  
    2. Người dùng có thể quay lại bước chọn phương thức thanh toán (UC-C20) hoặc chỉnh sửa thông tin.  
* **Luồng ngoại lệ:**  
  * **4a1. Lỗi hệ thống khi tạo đơn hàng:**  
    1. Hệ thống hiển thị thông báo lỗi chung. Cần có cơ chế để đảm bảo người dùng không bị trừ tiền nếu đơn hàng không được tạo.  
  * **4d1. Lỗi gửi email xác nhận:**  
    1. Đây là lỗi không nghiêm trọng, đơn hàng vẫn được tạo. Hệ thống có thể thử gửi lại sau hoặc thông báo cho quản trị viên.  
* **Bao gồm (Includes):** UC-S03: Xử Lý Thanh Toán.  
* **Mở rộng (Extends):** Không có.

### **3.6. Quản Lý Đơn Hàng (Phía Khách Hàng)**

#### **UC-C22: Xem Lịch Sử Đơn Hàng**

* **ID Use Case:** UC-C22  
* **Tên Use Case:** Xem Lịch Sử Đơn Hàng  
* **Tác nhân:** Khách hàng (Đã đăng nhập)  
* **Mô tả:** Hiển thị danh sách tất cả các đơn hàng đã đặt trước đó của người dùng.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập vào hệ thống.  
  * Người dùng điều hướng đến trang "Lịch sử đơn hàng" hoặc "Đơn hàng của tôi".  
* **Hậu điều kiện (Thành công):**  
  * Danh sách các đơn hàng đã đặt của người dùng được hiển thị với các thông tin tóm tắt.  
  * Người dùng có thể chọn xem chi tiết một đơn hàng cụ thể (UC-C23).  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải lịch sử đơn hàng hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng truy cập trang "Lịch sử đơn hàng".  
  2. Hệ thống truy vấn cơ sở dữ liệu để lấy danh sách các đơn hàng thuộc về người dùng hiện tại.  
  3. Hệ thống hiển thị danh sách đơn hàng, mỗi đơn hàng bao gồm các thông tin tóm tắt: Mã đơn hàng, Ngày đặt, Tổng tiền, Trạng thái đơn hàng (ví dụ: Đang xử lý, Đã giao, Đã hủy).  
  4. Mỗi đơn hàng có một liên kết để xem chi tiết.  
* **Luồng thay thế:**  
  * **2a. Người dùng chưa có đơn hàng nào:**  
    1. Hệ thống hiển thị thông báo "Bạn chưa có đơn hàng nào."  
* **Luồng ngoại lệ:**  
  * **2b. Lỗi truy xuất dữ liệu đơn hàng:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-C23: Xem Chi Tiết Đơn Hàng**

* **ID Use Case:** UC-C23  
* **Tên Use Case:** Xem Chi Tiết Đơn Hàng  
* **Tác nhân:** Khách hàng (Đã đăng nhập)  
* **Mô tả:** Hiển thị thông tin chi tiết cho một đơn hàng cụ thể, bao gồm danh sách sản phẩm, thiết kế, thông tin giao hàng và thanh toán.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Người dùng đã đăng nhập và đang ở trang "Lịch sử đơn hàng" (UC-C22) hoặc có mã đơn hàng.  
  * Người dùng chọn xem chi tiết một đơn hàng.  
* **Hậu điều kiện (Thành công):**  
  * Thông tin chi tiết của đơn hàng được hiển thị.  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải chi tiết đơn hàng hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Người dùng nhấp vào một đơn hàng cụ thể từ danh sách lịch sử đơn hàng.  
  2. Hệ thống truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của đơn hàng đó.  
  3. Hệ thống hiển thị các thông tin:  
     * Mã đơn hàng, Ngày đặt, Trạng thái.  
     * Thông tin người đặt hàng và người nhận hàng (địa chỉ, số điện thoại).  
     * Danh sách các sản phẩm đã đặt, mỗi sản phẩm bao gồm:  
       * Hình ảnh mockup với thiết kế tùy chỉnh.  
       * Mô tả sản phẩm (loại áo, màu, size).  
       * Số lượng, Đơn giá, Thành tiền.  
     * Phương thức thanh toán.  
     * Tổng tiền đơn hàng.  
     * (Tùy chọn) Thông tin vận chuyển (đơn vị vận chuyển, mã vận đơn nếu có).  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **2a. Đơn hàng không tồn tại hoặc không thuộc về người dùng:**  
    1. Hệ thống hiển thị thông báo "Không tìm thấy đơn hàng" hoặc "Bạn không có quyền xem đơn hàng này."  
  * **2b. Lỗi truy xuất dữ liệu chi tiết đơn hàng:**  
    1. Hệ thống hiển thị thông báo lỗi "Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau."  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

## **4\. Các Trường Hợp Sử Dụng Phía Quản Trị Viên**

### **4.1. Xác Thực Quản Trị Viên**

#### **UC-A01: Đăng Nhập Quản Trị Viên**

* **ID Use Case:** UC-A01  
* **Tên Use Case:** Đăng Nhập Quản Trị Viên  
* **Tác nhân:** Quản trị viên  
* **Mô tả:** Cho phép quản trị viên truy cập vào khu vực quản trị của hệ thống.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Quản trị viên có tài khoản quản trị hợp lệ.  
  * Quản trị viên đang ở trang đăng nhập quản trị (có thể là một URL riêng biệt).  
* **Hậu điều kiện (Thành công):**  
  * Quản trị viên được xác thực thành công.  
  * Hệ thống tạo một phiên làm việc quản trị.  
  * Quản trị viên được chuyển hướng đến trang tổng quan (dashboard) của khu vực quản trị.  
* **Hậu điều kiện (Thất bại):**  
  * Quản trị viên không được đăng nhập.  
  * Quản trị viên vẫn ở trang đăng nhập quản trị với thông báo lỗi.  
* **Luồng chính (Basic Path):**  
  1. Quản trị viên truy cập trang đăng nhập quản trị.  
  2. Hệ thống hiển thị biểu mẫu đăng nhập yêu cầu: Tên đăng nhập/Email, Mật khẩu.  
  3. Quản trị viên nhập thông tin đăng nhập.  
  4. Quản trị viên nhấn nút "Đăng nhập".  
  5. Hệ thống \<\<bao gồm\>\> UC-S01: Xác Thực Người Dùng (với kiểm tra vai trò quản trị).  
  6. Nếu xác thực thành công và người dùng có vai trò quản trị, hệ thống tạo phiên làm việc và chuyển hướng đến trang quản trị.  
* **Luồng thay thế:**  
  * **5a. Xác thực thất bại (sai thông tin hoặc không có quyền quản trị):**  
    1. Hệ thống hiển thị thông báo "Tên đăng nhập hoặc mật khẩu không chính xác" hoặc "Bạn không có quyền truy cập."  
    2. Quản trị viên có thể thử nhập lại. Quay lại bước 3\.  
* **Luồng ngoại lệ:**  
  * **5b. Tài khoản quản trị bị khóa:**  
    1. Hệ thống hiển thị thông báo "Tài khoản quản trị của bạn đã bị khóa."  
  * **5c. Lỗi hệ thống khi xác thực:**  
    1. Hệ thống hiển thị thông báo lỗi chung.  
* **Bao gồm (Includes):** UC-S01: Xác Thực Người Dùng.  
* **Mở rộng (Extends):** (Có thể) UC-SXX: Xác thực hai yếu tố (2FA) nếu được triển khai.

### **4.2. Quản Lý và Thực Hiện Đơn Hàng**

#### **UC-A02: Quản Lý Đơn Hàng**

* **ID Use Case:** UC-A02  
* **Tên Use Case:** Quản Lý Đơn Hàng  
* **Tác nhân:** Quản trị viên  
* **Mô tả:** Cho phép quản trị viên xem danh sách tất cả các đơn hàng, xem chi tiết từng đơn hàng (bao gồm cả thiết kế tùy chỉnh), và cập nhật trạng thái đơn hàng.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Quản trị viên đã đăng nhập vào khu vực quản trị (UC-A01).  
  * Quản trị viên điều hướng đến trang quản lý đơn hàng.  
* **Hậu điều kiện (Thành công):**  
  * Quản trị viên có thể xem và tương tác với các đơn hàng.  
  * Trạng thái đơn hàng được cập nhật (nếu có hành động).  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải danh sách đơn hàng hoặc thực hiện hành động.  
* **Luồng chính (Xem danh sách và chi tiết):**  
  1. Quản trị viên truy cập trang "Quản lý đơn hàng".  
  2. Hệ thống hiển thị danh sách tất cả các đơn hàng, có thể sắp xếp và lọc theo: Mã đơn hàng, Ngày đặt, Khách hàng, Trạng thái, Tổng tiền.  
  3. Quản trị viên chọn một đơn hàng để xem chi tiết.  
  4. Hệ thống hiển thị thông tin chi tiết của đơn hàng đó, tương tự như UC-C23, nhưng có thêm các tùy chọn quản lý. Đặc biệt, quản trị viên phải có khả năng xem được hình ảnh thiết kế tùy chỉnh (render từ base64 hoặc liên kết trực tiếp).  
* **Luồng chính (Cập nhật trạng thái đơn hàng):**  
  1. Từ trang chi tiết đơn hàng hoặc danh sách đơn hàng (nếu có hành động nhanh), quản trị viên chọn thay đổi trạng thái đơn hàng.  
  2. Hệ thống hiển thị danh sách các trạng thái có thể cập nhật (ví dụ: "Đang xử lý", "Đã xác nhận", "Đang giao hàng", "Đã giao hàng", "Đã hủy", "Hoàn tiền").  
  3. Quản trị viên chọn trạng thái mới và xác nhận.  
  4. Hệ thống cập nhật trạng thái đơn hàng trong cơ sở dữ liệu.  
  5. (Tùy chọn) Hệ thống gửi email thông báo cho khách hàng về việc thay đổi trạng thái đơn hàng.  
  6. Hệ thống làm mới hiển thị đơn hàng với trạng thái mới.  
* **Luồng thay thế:**  
  * **2a. Sử dụng bộ lọc/tìm kiếm:**  
    1. Quản trị viên nhập tiêu chí vào các trường lọc/tìm kiếm (ví dụ: tìm theo mã đơn hàng, tên khách hàng, trạng thái).  
    2. Hệ thống hiển thị danh sách đơn hàng phù hợp với tiêu chí.  
* **Luồng ngoại lệ:**  
  * **2b / 4a. Lỗi tải dữ liệu đơn hàng:**  
    1. Hệ thống hiển thị thông báo lỗi.  
  * **4a. Lỗi cập nhật trạng thái đơn hàng:**  
    1. Hệ thống hiển thị thông báo lỗi.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

### **4.3. Quản Lý Nội Dung và Bộ Sưu Tập**

#### **UC-A03: Xem Tất Cả Bộ Sưu Tập/Thiết Kế Do Người Dùng Tạo**

* **ID Use Case:** UC-A03  
* **Tên Use Case:** Xem Tất Cả Bộ Sưu Tập/Thiết Kế Do Người Dùng Tạo  
* **Tác nhân:** Quản trị viên  
* **Mô tả:** Cho phép quản trị viên duyệt hoặc tìm kiếm tất cả các thiết kế đã được người dùng tạo và lưu trên hệ thống. Chức năng này rất quan trọng cho việc kiểm duyệt nội dung.  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Quản trị viên đã đăng nhập vào khu vực quản trị (UC-A01).  
  * Quản trị viên điều hướng đến trang quản lý thiết kế của người dùng.  
* **Hậu điều kiện (Thành công):**  
  * Quản trị viên có thể xem danh sách các thiết kế do người dùng tạo.  
  * Quản trị viên có thể thực hiện các hành động quản lý trên các thiết kế này (UC-A04).  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải danh sách thiết kế hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Quản trị viên truy cập trang "Quản lý Thiết kế Người dùng" (hoặc tương tự).  
  2. Hệ thống hiển thị danh sách các thiết kế do người dùng tạo, có thể phân trang, sắp xếp và lọc theo: ID thiết kế, Ngày tạo, Tên người dùng, Từ khóa trong tên thiết kế (nếu có).  
  3. Mỗi thiết kế được hiển thị dưới dạng hình ảnh mockup (render từ base64) cùng với thông tin người tạo và ngày tạo.  
  4. Quản trị viên có thể chọn một thiết kế để xem chi tiết hơn hoặc thực hiện các hành động quản lý (ví dụ: "Xóa", "Ẩn", "Đánh dấu vi phạm").  
* **Luồng thay thế:**  
  * **2a. Sử dụng bộ lọc/tìm kiếm nâng cao:**  
    1. Quản trị viên sử dụng các công cụ tìm kiếm và lọc để tìm các thiết kế cụ thể.  
* **Luồng ngoại lệ:**  
  * **2b. Lỗi tải dữ liệu thiết kế:**  
    1. Hệ thống hiển thị thông báo lỗi.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.  
* **Lưu ý:** Việc quản trị viên "quản lí các bộ sưu tập đang có trên hệ thống" không chỉ dừng lại ở việc xem. Nó bao hàm một quy trình kiểm duyệt nội dung. Nếu một người dùng tạo ra một thiết kế không phù hợp (ví dụ: vi phạm bản quyền, nội dung phản cảm), quản trị viên cần có công cụ để tìm kiếm và xử lý hiệu quả. Các tài liệu về thực hành phát triển phần mềm an toàn và ứng phó sự cố 14 cũng có thể áp dụng cho các sự cố kiểm duyệt nội dung. Một giao diện danh sách đơn giản có thể không đủ quy mô để kiểm duyệt hiệu quả khi số lượng thiết kế tăng lên. Cần cân nhắc các tính năng tìm kiếm, lọc và hành động hàng loạt.

#### **UC-A04: Quản Lý Thiết Kế Toàn Hệ Thống/Người Dùng**

* **ID Use Case:** UC-A04  
* **Tên Use Case:** Quản Lý Thiết Kế Toàn Hệ Thống/Người Dùng  
* **Tác nhân:** Quản trị viên  
* **Mô tả:** Cho phép quản trị viên thực hiện các hành động trên các thiết kế của người dùng (ví dụ: xóa thiết kế không phù hợp, ẩn thiết kế) hoặc quản lý các mẫu thiết kế do hệ thống cung cấp (nếu có).  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Quản trị viên đang xem danh sách thiết kế người dùng (UC-A03) hoặc danh sách mẫu thiết kế của hệ thống.  
* **Hậu điều kiện (Thành công):**  
  * Hành động quản lý (xóa, ẩn, nổi bật) được thực hiện thành công trên thiết kế đã chọn.  
  * Danh sách thiết kế được cập nhật.  
* **Hậu điều kiện (Thất bại):**  
  * Hành động không thành công.  
* **Luồng chính (Xóa/Ẩn thiết kế người dùng):**  
  1. Quản trị viên chọn một hoặc nhiều thiết kế từ danh sách.  
  2. Quản trị viên chọn hành động "Xóa" hoặc "Ẩn".  
  3. Hệ thống yêu cầu xác nhận (ví dụ: "Bạn có chắc chắn muốn xóa (các) thiết kế này không? Hành động này không thể hoàn tác.").  
  4. Quản trị viên xác nhận.  
  5. Hệ thống thực hiện hành động:  
     * **Xóa:** Xóa vĩnh viễn bản ghi thiết kế khỏi cơ sở dữ liệu.  
     * **Ẩn:** Đánh dấu thiết kế là bị ẩn, không còn hiển thị cho người dùng hoặc công khai, nhưng vẫn còn trong cơ sở dữ liệu cho mục đích lưu trữ hoặc xem xét lại.  
  6. Hệ thống làm mới danh sách thiết kế.  
  7. Hệ thống hiển thị thông báo thành công.  
* **Luồng chính (Quản lý mẫu thiết kế của hệ thống \- nếu có):**  
  1. Quản trị viên truy cập khu vực quản lý mẫu thiết kế.  
  2. Quản trị viên có thể thêm mẫu mới (tải lên hình ảnh, đặt tên, mô tả), sửa đổi hoặc xóa các mẫu hiện có.  
* **Luồng thay thế:**  
  * **4a. Quản trị viên hủy bỏ hành động:**  
    1. Hộp thoại xác nhận đóng lại, không có hành động nào được thực hiện.  
* **Luồng ngoại lệ:**  
  * **5a. Lỗi khi thực hiện hành động trên thiết kế:**  
    1. Hệ thống hiển thị thông báo lỗi.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

#### **UC-A05: Quản Lý Mẫu Áo Mockup**

* **ID Use Case:** UC-A05  
* **Tên Use Case:** Quản Lý Mẫu Áo Mockup  
* **Tác nhân:** Quản trị viên  
* **Mô tả:** Cho phép quản trị viên thêm các loại áo mới, định nghĩa các màu sắc có sẵn cho từng loại, và tải lên/cập nhật hình ảnh mockup mà công cụ thiết kế sẽ sử dụng.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Quản trị viên đã đăng nhập vào khu vực quản trị (UC-A01).  
  * Quản trị viên điều hướng đến trang quản lý mẫu áo.  
* **Hậu điều kiện (Thành công):**  
  * Thông tin về mẫu áo (loại, màu, hình ảnh mockup) được thêm mới hoặc cập nhật trong hệ thống.  
  * Các thay đổi này sẽ được phản ánh trong công cụ thiết kế cho khách hàng.  
* **Hậu điều kiện (Thất bại):**  
  * Không thể thêm/cập nhật thông tin mẫu áo.  
* **Luồng chính (Thêm mẫu áo mới):**  
  1. Quản trị viên chọn "Thêm mẫu áo mới".  
  2. Hệ thống hiển thị biểu mẫu yêu cầu: Tên loại áo, Mô tả (tùy chọn).  
  3. Quản trị viên nhập thông tin và lưu.  
* **Luồng chính (Thêm/Quản lý màu sắc và mockup cho loại áo):**  
  1. Quản trị viên chọn một loại áo từ danh sách.  
  2. Hệ thống hiển thị danh sách các màu sắc hiện có cho loại áo đó.  
  3. Để thêm màu mới: a. Quản trị viên chọn "Thêm màu mới". b. Hệ thống yêu cầu: Tên màu, Mã màu (ví dụ: HEX), Tải lên hình ảnh mockup cho màu này. c. Quản trị viên nhập thông tin, tải ảnh lên và lưu.  
  4. Để sửa màu/mockup hiện có: a. Quản trị viên chọn màu cần sửa. b. Hệ thống cho phép thay đổi tên màu, mã màu, hoặc tải lên hình ảnh mockup mới. c. Quản trị viên lưu thay đổi.  
  5. Để xóa màu: a. Quản trị viên chọn màu cần xóa và xác nhận. b. Hệ thống xóa màu và mockup liên quan (cần kiểm tra xem màu này có đang được sử dụng trong thiết kế nào không trước khi xóa).  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **3c / 4c / 5b. Lỗi lưu trữ dữ liệu hoặc tải ảnh lên:**  
    1. Hệ thống hiển thị thông báo lỗi.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

### **4.4. Báo Cáo và Phân Tích**

#### **UC-A06: Xem Báo Cáo Doanh Thu**

* **ID Use Case:** UC-A06  
* **Tên Use Case:** Xem Báo Cáo Doanh Thu  
* **Tác nhân:** Quản trị viên  
* **Mô tả:** Hiển thị dữ liệu bán hàng, doanh thu theo thời gian, các sản phẩm bán chạy nhất (có thể dựa trên mẫu áo cơ sở, trừ khi các thiết kế tùy chỉnh được phân loại).  
* **Độ ưu tiên:** Cao  
* **Tiền điều kiện:**  
  * Quản trị viên đã đăng nhập vào khu vực quản trị (UC-A01).  
  * Quản trị viên điều hướng đến trang báo cáo doanh thu.  
* **Hậu điều kiện (Thành công):**  
  * Quản trị viên xem được các số liệu và biểu đồ liên quan đến doanh thu.  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải dữ liệu báo cáo hoặc hiển thị lỗi.  
* **Luồng chính (Basic Path):**  
  1. Quản trị viên truy cập trang "Báo cáo doanh thu".  
  2. Hệ thống cho phép quản trị viên chọn khoảng thời gian cho báo cáo (ví dụ: hôm nay, tuần này, tháng này, tùy chỉnh).  
  3. Quản trị viên chọn khoảng thời gian và nhấn "Xem báo cáo".  
  4. Hệ thống truy vấn cơ sở dữ liệu đơn hàng để tổng hợp dữ liệu doanh thu.  
  5. Hệ thống hiển thị các thông tin:  
     * Tổng doanh thu trong khoảng thời gian đã chọn.  
     * Số lượng đơn hàng.  
     * Giá trị trung bình đơn hàng.  
     * Biểu đồ doanh thu theo ngày/tuần/tháng.  
     * Danh sách các mẫu áo cơ sở bán chạy nhất (theo số lượng hoặc doanh thu).  
  6. (Tùy chọn) Quản trị viên có thể xuất báo cáo ra tệp (ví dụ: CSV, Excel).  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **4a. Lỗi truy xuất hoặc tổng hợp dữ liệu:**  
    1. Hệ thống hiển thị thông báo lỗi.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

### **4.5. Quản Lý Người Dùng (Bởi Quản Trị Viên)**

#### **UC-A07: Quản Lý Tài Khoản Người Dùng**

* **ID Use Case:** UC-A07  
* **Tên Use Case:** Quản Lý Tài Khoản Người Dùng  
* **Tác nhân:** Quản trị viên  
* **Mô tả:** Cho phép quản trị viên xem danh sách tài khoản khách hàng, tạm ngưng tài khoản (ví dụ: do lạm dụng công cụ thiết kế), hoặc đặt lại mật khẩu nếu cần thiết.  
* **Độ ưu tiên:** Trung bình  
* **Tiền điều kiện:**  
  * Quản trị viên đã đăng nhập vào khu vực quản trị (UC-A01).  
  * Quản trị viên điều hướng đến trang quản lý người dùng.  
* **Hậu điều kiện (Thành công):**  
  * Quản trị viên có thể xem và thực hiện các hành động trên tài khoản người dùng.  
* **Hậu điều kiện (Thất bại):**  
  * Không thể tải danh sách người dùng hoặc thực hiện hành động.  
* **Luồng chính (Xem danh sách và chi tiết):**  
  1. Quản trị viên truy cập trang "Quản lý Người dùng".  
  2. Hệ thống hiển thị danh sách tất cả các tài khoản khách hàng, có thể sắp xếp và lọc theo: Tên người dùng, Email, Ngày đăng ký, Trạng thái tài khoản (Hoạt động, Bị khóa).  
  3. Quản trị viên chọn một tài khoản để xem chi tiết (thông tin cá nhân, lịch sử đơn hàng tóm tắt, các thiết kế đã tạo).  
* **Luồng chính (Tạm ngưng/Kích hoạt tài khoản):**  
  1. Từ trang chi tiết người dùng hoặc danh sách, quản trị viên chọn hành động "Tạm ngưng tài khoản" hoặc "Kích hoạt tài khoản".  
  2. Hệ thống yêu cầu xác nhận.  
  3. Quản trị viên xác nhận.  
  4. Hệ thống cập nhật trạng thái tài khoản người dùng trong cơ sở dữ liệu.  
  5. Hệ thống hiển thị thông báo thành công.  
* **Luồng chính (Đặt lại mật khẩu người dùng):**  
  1. Quản trị viên chọn hành động "Đặt lại mật khẩu" cho một người dùng.  
  2. Hệ thống có thể tạo một mật khẩu tạm thời và gửi cho người dùng qua email, hoặc gửi một liên kết đặt lại mật khẩu tương tự UC-C03.  
  3. Hệ thống hiển thị thông báo về hành động đã thực hiện.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **2a / 3a. Lỗi tải dữ liệu người dùng:**  
    1. Hệ thống hiển thị thông báo lỗi.  
  * **4a. Lỗi cập nhật trạng thái tài khoản:**  
    1. Hệ thống hiển thị thông báo lỗi.  
* **Bao gồm (Includes):** Không có.  
* **Mở rộng (Extends):** Không có.

## **5\. Các Trường Hợp Sử Dụng Chung/Hệ Thống (Được \<\<bao gồm\>\>)**

Đây là các UC không thường được một tác nhân gọi trực tiếp mà được các UC khác bao gồm để thực hiện các chức năng phụ trợ hoặc lặp đi lặp lại.

#### **UC-S01: Xác Thực Người Dùng**

* **ID Use Case:** UC-S01  
* **Tên Use Case:** Xác Thực Người Dùng  
* **Tác nhân:** (Hệ thống \- được gọi bởi UC khác)  
* **Mô tả:** Xác minh thông tin đăng nhập của người dùng (ví dụ: email/mật khẩu, token). Nếu là quản trị viên, kiểm tra thêm vai trò.  
* **Được sử dụng bởi:** UC-C02: Đăng Nhập Người Dùng, UC-C18: Tiến Hành Thanh Toán (có thể), UC-A01: Đăng Nhập Quản Trị Viên.  
* **Tiền điều kiện:**  
  * Người dùng đã cung cấp thông tin đăng nhập.  
* **Hậu điều kiện (Thành công):**  
  * Thông tin đăng nhập được xác minh là hợp lệ.  
  * Vai trò người dùng (khách hàng/admin) được xác định.  
* **Hậu điều kiện (Thất bại):**  
  * Thông tin đăng nhập không hợp lệ.  
* **Luồng chính (Basic Path):**  
  1. Hệ thống nhận thông tin đăng nhập (email, mật khẩu).  
  2. Hệ thống truy vấn cơ sở dữ liệu để tìm người dùng có email tương ứng.  
  3. Nếu tìm thấy người dùng: a. Hệ thống so sánh mật khẩu đã hash trong cơ sở dữ liệu với hash của mật khẩu được cung cấp. b. Nếu mật khẩu khớp, xác thực thành công. Xác định vai trò của người dùng.  
  4. Nếu không tìm thấy người dùng hoặc mật khẩu không khớp, xác thực thất bại.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:** Không có.

#### **UC-S02: Xác Thực Dữ Liệu Đầu Vào**

* **ID Use Case:** UC-S02  
* **Tên Use Case:** Xác Thực Dữ Liệu Đầu Vào  
* **Tác nhân:** (Hệ thống \- được gọi bởi UC khác)  
* **Mô tả:** Kiểm tra dữ liệu được nhập vào các biểu mẫu về tính đúng đắn, định dạng và tính đầy đủ (ví dụ: định dạng email, các trường bắt buộc, độ mạnh mật khẩu).  
* **Được sử dụng bởi:** UC-C01, UC-C03, UC-C07 (ngầm), UC-C19, UC-C20, UC-C24, và nhiều UC khác có biểu mẫu nhập liệu.  
* **Tiền điều kiện:**  
  * Dữ liệu đã được người dùng gửi từ một biểu mẫu.  
* **Hậu điều kiện (Thành công):**  
  * Tất cả dữ liệu đầu vào đều hợp lệ theo các quy tắc đã định.  
* **Hậu điều kiện (Thất bại):**  
  * Ít nhất một mục dữ liệu không hợp lệ. Danh sách các lỗi được trả về.  
* **Luồng chính (Basic Path):**  
  1. Hệ thống nhận một tập hợp dữ liệu đầu vào.  
  2. Đối với mỗi mục dữ liệu, hệ thống áp dụng các quy tắc xác thực tương ứng (ví dụ: kiểm tra trường bắt buộc, định dạng email, độ dài tối thiểu/tối đa, kiểu số, v.v.).  
  3. Nếu tất cả các mục đều hợp lệ, trả về trạng thái thành công.  
  4. Nếu có bất kỳ mục nào không hợp lệ, trả về trạng thái thất bại cùng với danh sách các lỗi cụ thể.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:** Không có.

#### **UC-S03: Xử Lý Thanh Toán**

* **ID Use Case:** UC-S03  
* **Tên Use Case:** Xử Lý Thanh Toán  
* **Tác nhân:** (Hệ thống \- được gọi bởi UC khác, tương tác với Hệ thống Cổng thanh toán bên ngoài)  
* **Mô tả:** Tương tác với một cổng thanh toán bên ngoài để ủy quyền và thực hiện giao dịch thanh toán. Đây là một ví dụ về "Use Case hệ thống (System Use Case)" vì nó "mô tả tương tác giữa hệ thống với các hệ thống khác".1  
* **Được sử dụng bởi:** UC-C21: Đặt Hàng.  
* **Tiền điều kiện:**  
  * Thông tin thanh toán đã được thu thập (ví dụ: chi tiết thẻ, token từ cổng thanh toán).  
  * Số tiền cần thanh toán đã được xác định.  
* **Hậu điều kiện (Thành công):**  
  * Giao dịch thanh toán được cổng thanh toán chấp thuận và xử lý thành công.  
  * Hệ thống nhận được xác nhận thanh toán từ cổng.  
* **Hậu điều kiện (Thất bại):**  
  * Giao dịch thanh toán bị từ chối hoặc có lỗi xảy ra trong quá trình xử lý.  
  * Hệ thống nhận được thông báo lỗi từ cổng thanh toán.  
* **Luồng chính (Basic Path):**  
  1. Hệ thống nhận yêu cầu xử lý thanh toán với thông tin chi tiết (số tiền, thông tin thẻ hoặc token).  
  2. Hệ thống gửi yêu cầu thanh toán đến API của cổng thanh toán bên ngoài.  
  3. Cổng thanh toán xử lý yêu cầu.  
  4. Cổng thanh toán gửi phản hồi về trạng thái giao dịch (thành công hoặc thất bại, cùng với mã giao dịch hoặc thông báo lỗi) cho hệ thống.  
  5. Hệ thống ghi lại kết quả giao dịch.  
* **Luồng thay thế:** Không có.  
* **Luồng ngoại lệ:**  
  * **2a. Lỗi kết nối đến cổng thanh toán:**  
    1. Hệ thống trả về lỗi, không thể xử lý thanh toán.  
  * **3a. Cổng thanh toán không phản hồi (timeout):**  
    1. Hệ thống trả về lỗi, không thể xác định trạng thái thanh toán. Cần có cơ chế kiểm tra lại hoặc hoàn tác.  
  * **4a. Cổng thanh toán từ chối giao dịch (ví dụ: thẻ không hợp lệ, không đủ tiền):**  
    1. Hệ thống trả về lỗi với thông báo từ cổng thanh toán.  
* **Lưu ý:** UC này giới thiệu một sự phụ thuộc vào bên ngoài (cổng thanh toán). Việc xử lý lỗi mạnh mẽ cho các trường hợp cổng thanh toán hết thời gian chờ, từ chối thanh toán và lỗi giao tiếp là rất quan trọng. Các trường hợp sử dụng có thể mô tả "tình huống ngoại lệ và cách xử lý chúng".1 Đối với UC-S03, điều này có nghĩa là phải chi tiết hóa những gì xảy ra nếu cổng thanh toán ngừng hoạt động, nếu thẻ bị từ chối, hoặc nếu kết nối internet của người dùng bị ngắt sau khi gửi thanh toán nhưng trước khi có xác nhận. Những tình huống này phải được xử lý một cách khéo léo để tránh tính tiền sai cho người dùng hoặc để đơn hàng ở trạng thái không xác định.

## **6\. Các Yêu Cầu Phi Chức Năng (NFR) Chính**

Các Yêu cầu Phi Chức Năng (NFR) xác định các thuộc tính chất lượng của hệ thống, bổ sung cho các yêu cầu chức năng (Use Cases). Chúng "mô tả cách một hệ thống hoạt động, tập trung vào các thuộc tính chất lượng như tốc độ, bảo mật, độ tin cậy" 15 thay vì "nó nên làm gì".16 Bảng dưới đây tóm tắt các NFR chính, cung cấp một danh sách rõ ràng, có thể đo lường và được ưu tiên về các thuộc tính chất lượng mà hệ thống phải đạt được. Điều này hướng dẫn các nỗ lực thiết kế và kiểm thử, đảm bảo hệ thống không chỉ hoạt động mà còn mạnh mẽ, an toàn và thân thiện với người dùng. Việc sử dụng "Ngôn ngữ Rõ ràng và Cụ thể" và "Số liệu Có thể Đo lường" 15 là rất quan trọng.

**Bảng T6.1 \- Tóm Tắt Các Yêu Cầu Phi Chức Năng Chính**

| ID NFR | Danh mục | Mô tả Yêu cầu Phi Chức năng | Số liệu/Mục tiêu | Độ ưu tiên | Các Use Case liên quan |
| :---- | :---- | :---- | :---- | :---- | :---- |
| NFR-PERF-01 | Hiệu năng | Tương tác trên khung vẽ của công cụ thiết kế (thêm, di chuyển, thay đổi kích thước phần tử) phải cập nhật trực quan. | Trong vòng 200ms. | Cao | UC-C07, UC-C08, UC-C09 |
| NFR-PERF-02 | Hiệu năng | Bản xem trước mockup áo (UC-C10) phải làm mới sau khi có thay đổi thiết kế. | Trong vòng 500ms. | Cao | UC-C10 |
| NFR-PERF-03 | Hiệu năng | Việc lưu thiết kế vào "Bộ sưu tập của tôi" (UC-C11, bao gồm chuyển đổi base64 và lưu trữ) phải hoàn tất. | Trong vòng 2 giây. | Cao | UC-C11 |
| NFR-PERF-04 | Hiệu năng | Trang "Bộ sưu tập của tôi" (UC-C12) với tối đa 20 thiết kế (hình ảnh base64) phải tải xong. | Trong vòng 3 giây. | Cao | UC-C12 |
| NFR-PERF-05 | Hiệu năng | Các trang thương mại điện tử chuẩn (Trang chủ, Giỏ hàng) phải tải xong dưới tải trung bình (ví dụ: 100 người dùng đồng thời). | Trong vòng 3 giây.10 | Cao | UC-C04, UC-C16 |
| NFR-SEC-01 | Bảo mật | Tất cả PII của người dùng (mật khẩu, địa chỉ) phải được mã hóa khi lưu trữ (MongoDB) và khi truyền tải (HTTPS/SSL). Mật khẩu phải được hash. | Mã hóa AES-256 (hoặc tương đương) cho dữ liệu lưu trữ, TLS 1.2+ cho truyền tải. Thuật toán hash mạnh (ví dụ: bcrypt, Argon2).13 | Cao | UC-C01, UC-C02, UC-C19, UC-C24, UC-A01 |
| NFR-SEC-02 | Bảo mật | Xác thực quản trị viên nên hỗ trợ Xác thực Hai Yếu tố (2FA) tùy chọn. | Triển khai 2FA dựa trên TOTP (ví dụ: Google Authenticator).13 | Trung bình | UC-A01 |
| NFR-SEC-03 | Bảo mật | Hệ thống phải được bảo vệ chống lại các lỗ hổng web phổ biến như XSS, SQL Injection (hoặc NoSQL injection cho MongoDB), CSRF. | Vượt qua kiểm tra thâm nhập dựa trên OWASP Top 10 mà không có lỗ hổng nghiêm trọng hoặc cao nào.14 | Cao | Toàn bộ hệ thống |
| NFR-SEC-04 | Bảo mật | Hình ảnh do người dùng tải lên (UC-C08) phải được xác thực về loại tệp và kích thước ở phía máy chủ để ngăn chặn tải lên độc hại. | Chỉ cho phép các loại tệp hình ảnh cụ thể (ví dụ: JPG, PNG, GIF). Giới hạn kích thước tệp tối đa (ví dụ: 5MB). | Cao | UC-C08 |
| NFR-SEC-05 | Bảo mật | Dữ liệu thiết kế base64 phải được xử lý an toàn để ngăn chặn injection nếu được render trực tiếp hoặc nếu các thành phần văn bản trong thiết kế có thể chứa script. | Thực hiện mã hóa đầu ra (output encoding) cho mọi dữ liệu do người dùng cung cấp được hiển thị. | Cao | UC-C11, UC-C12, UC-A02, UC-A03 |
| NFR-USA-01 | Khả năng sử dụng | Người dùng mới có thể hoàn thành một thiết kế cơ bản (chọn áo, thêm chữ, lưu vào bộ sưu tập) trong công cụ thiết kế. | Trong vòng 5 phút kể từ lần tương tác đầu tiên.8 | Cao | UC-C05 đến UC-C11 |
| NFR-USA-02 | Khả năng sử dụng | Giao diện công cụ thiết kế phải trực quan, với biểu tượng rõ ràng và tối giản sự lộn xộn. Điều hướng phải nhất quán. | Đạt điểm hài lòng của người dùng \>= 4/5 trong khảo sát. Tỷ lệ hoàn thành tác vụ \>= 90%.8 | Cao | UC-C05 đến UC-C11 |
| NFR-USA-03 | Khả năng sử dụng | Thông báo lỗi trên toàn trang, đặc biệt trong công cụ thiết kế và thanh toán, phải rõ ràng, thân thiện (không kỹ thuật) và đề xuất hành động khắc phục. | Giảm thiểu tỷ lệ lỗi người dùng \< 5% cho các tác vụ chính.9 | Cao | Toàn bộ hệ thống |
| NFR-USA-04 | Khả năng sử dụng | Hệ thống phải cung cấp phản hồi cho các hành động của người dùng trong công cụ thiết kế (ví dụ: chọn phần tử, tiến trình tải ảnh). | Trong vòng 1 giây. | Cao | UC-C07, UC-C08, UC-C09 |
| NFR-SCA-01 | Khả năng mở rộng | Hệ thống phải duy trì các NFR hiệu năng (mục 6.1) với tối đa 1.000 người dùng hoạt động đồng thời và 100.000 thiết kế đã lưu. | Trong năm đầu tiên hoạt động.10 | Cao | Toàn bộ hệ thống |
| NFR-SCA-02 | Khả năng mở rộng | Kiến trúc và schema cơ sở dữ liệu (MongoDB) phải được thiết kế để có thể mở rộng theo chiều ngang để đáp ứng mức tăng trưởng dữ liệu. | Gấp 5 lần khối lượng dữ liệu trong 2 năm mà không cần tái cấu trúc lớn. | Trung bình | Cơ sở dữ liệu |
| NFR-MAI-01 | Khả năng bảo trì | Mã nguồn phải được module hóa (React components, Express routes/services) để cho phép cập nhật và sửa lỗi độc lập cho các phần khác nhau của hệ thống. | Tuân thủ các hướng dẫn về coding style và kiến trúc đã xác định. | Trung bình | Toàn bộ mã nguồn |
| NFR-MAI-02 | Khả năng bảo trì | Các lỗi nghiêm trọng được xác định trong môi trường production phải có thể sửa và triển khai. | Trong vòng 4 giờ làm việc.15 | Cao | Quy trình phát triển và triển khai |
| NFR-COM-01 | Khả năng tương thích | Trang web phía khách hàng phải hoạt động đầy đủ và hiển thị chính xác trên hai phiên bản mới nhất của các trình duyệt web chính. | Chrome, Firefox, Safari, Edge.9 | Cao | Giao diện người dùng phía khách hàng |
| NFR-COM-02 | Khả năng tương thích | Trang web nên sử dụng các nguyên tắc thiết kế đáp ứng (responsive design) để có thể sử dụng được trên các kích thước màn hình phổ biến. | Desktop, tablet, và smartphone. | Cao | Giao diện người dùng phía khách hàng |
| NFR-REL-01 | Độ tin cậy/Sẵn sàng | Trang web phải có thời gian hoạt động (uptime). | 99.9% trong giờ làm việc.10 | Cao | Toàn bộ hệ thống |
| NFR-REL-02 | Độ tin cậy/Sẵn sàng | Quá trình lưu thiết kế (UC-C11) phải hoàn tất thành công. | Ít nhất 99.95% số lần thử trong điều kiện hoạt động bình thường. | Cao | UC-C11 |

### **6.1. Hiệu Năng**

Yêu cầu về hiệu năng tập trung vào việc đảm bảo "Tốc độ tải nhanh" 13, khả năng phản hồi của hệ thống 12, và khả năng xử lý người dùng đồng thời. Các NFR liên quan đến hiệu năng của công cụ thiết kế (NFR-PERF-01, NFR-PERF-02, NFR-PERF-03) và trang "Bộ sưu tập của tôi" (NFR-PERF-04) đặc biệt quan trọng do việc người dùng lựa chọn sử dụng chuỗi base64 để lưu trữ và hiển thị hình ảnh. Việc đặt ra các mục tiêu rõ ràng cho các hoạt động này (ví dụ: cập nhật trực quan trong 200ms, tải trang trong 3 giây) biến chúng thành các yêu cầu có thể kiểm thử được. Nếu việc lưu hoặc tải các bộ sưu tập bị chậm, sự hài lòng của người dùng đối với tính năng thiết kế và bộ sưu tập cốt lõi sẽ bị ảnh hưởng.

* **NFR-PERF-01:** Tương tác trên khung vẽ của công cụ thiết kế (thêm phần tử, di chuyển, thay đổi kích thước) phải cập nhật trực quan trong vòng 200ms.  
* **NFR-PERF-02:** Bản xem trước mockup áo (UC-C10) phải làm mới trong vòng 500ms sau khi có thay đổi thiết kế.  
* **NFR-PERF-03:** Việc lưu thiết kế vào "Bộ sưu tập của tôi" (UC-C11, bao gồm chuyển đổi base64 và lưu trữ) phải hoàn tất trong vòng 2 giây.  
* **NFR-PERF-04:** Trang "Bộ sưu tập của tôi" (UC-C12) với tối đa 20 thiết kế (hình ảnh base64) phải tải xong trong vòng 3 giây.  
* **NFR-PERF-05:** Các trang thương mại điện tử chuẩn (Trang chủ, Giỏ hàng, Trang sản phẩm (nếu có)) phải tải xong trong vòng 3 giây dưới tải trung bình (ví dụ: 100 người dùng đồng thời).10

### **6.2. Bảo Mật**

Các yêu cầu bảo mật bao gồm mã hóa dữ liệu, xác thực, bảo vệ chống lại các lỗ hổng web phổ biến (ví dụ: theo OWASP Top 10), và bảo mật cho nội dung do người dùng tạo.13 Các thiết kế tùy chỉnh là dữ liệu người dùng có giá trị; việc bảo vệ chúng khỏi truy cập trái phép hoặc bị hỏng là rất quan trọng. Đặc biệt, nếu người dùng có thể thêm văn bản vào thiết kế (UC-C07), việc làm sạch (sanitization) đầu vào là cực kỳ cần thiết để ngăn chặn tấn công XSS. Nếu văn bản này có thể chứa mã JavaScript độc hại và thiết kế đó sau đó được hiển thị (ví dụ: trong "Bộ sưu tập của tôi" hoặc cho Quản trị viên) mà không được xử lý cẩn thận, nó có thể dẫn đến lỗ hổng XSS. Do đó, việc xác thực đầu vào và mã hóa đầu ra cho bất kỳ văn bản nào trong thiết kế là những cân nhắc bảo mật quan trọng, phù hợp với nguyên tắc đảm bảo "Tính bảo mật, toàn vẹn và sẵn có của dữ liệu người dùng".14

* **NFR-SEC-01:** Tất cả Thông tin Nhận dạng Cá nhân (PII) của người dùng (mật khẩu, địa chỉ) phải được mã hóa khi lưu trữ (trong MongoDB) và khi truyền tải (sử dụng HTTPS/SSL).13 Mật khẩu phải được băm (hashed) bằng thuật toán mạnh.  
* **NFR-SEC-02:** Xác thực quản trị viên nên hỗ trợ tùy chọn Xác thực Hai Yếu tố (2FA).13  
* **NFR-SEC-03:** Hệ thống phải được bảo vệ chống lại các lỗ hổng web phổ biến như Cross-Site Scripting (XSS), SQL Injection (hoặc NoSQL injection đối với MongoDB), Cross-Site Request Forgery (CSRF), tuân theo các thực hành lập trình an toàn.14  
* **NFR-SEC-04:** Hình ảnh do người dùng tải lên (UC-C08) phải được xác thực về loại tệp và kích thước ở phía máy chủ để ngăn chặn việc tải lên các tệp độc hại.  
* **NFR-SEC-05:** Dữ liệu thiết kế dưới dạng base64 phải được xử lý một cách an toàn để ngăn chặn các cuộc tấn công injection nếu được hiển thị trực tiếp hoặc nếu các thành phần văn bản trong thiết kế có khả năng chứa mã kịch bản (script).

### **6.3. Khả Năng Sử Dụng**

Khả năng sử dụng tập trung vào tính dễ học, hiệu quả, khả năng phòng ngừa lỗi và sự hài lòng của người dùng, đặc biệt đối với công cụ thiết kế.8

* **NFR-USA-01:** Một người dùng mới có thể hoàn thành một thiết kế cơ bản (chọn mẫu áo, thêm văn bản, lưu vào bộ sưu tập) trong vòng 5 phút kể từ lần tương tác đầu tiên với công cụ thiết kế (Tính dễ học \- Learnability).8  
* **NFR-USA-02:** Giao diện công cụ thiết kế phải trực quan, với các biểu tượng rõ ràng và giảm thiểu sự lộn xộn không cần thiết (Thiết kế thẩm mỹ và tối giản \- Aesthetic and Minimalist Design).8 Việc điều hướng trong công cụ phải nhất quán.9  
* **NFR-USA-03:** Các thông báo lỗi trên toàn bộ trang web, đặc biệt là trong công cụ thiết kế và quy trình thanh toán, phải rõ ràng, thân thiện với người dùng (không sử dụng thuật ngữ kỹ thuật) và đề xuất các hành động khắc phục.9  
* **NFR-USA-04:** Hệ thống phải cung cấp phản hồi cho các hành động của người dùng trong công cụ thiết kế (ví dụ: phần tử được chọn, tiến trình tải ảnh lên) trong vòng 1 giây.

### **6.4. Khả Năng Mở Rộng**

Hệ thống phải có khả năng xử lý sự tăng trưởng về số lượng người dùng, số lượng thiết kế và số lượng đơn hàng.10 Việc lưu trữ một lượng lớn chuỗi base64 cho các thiết kế là một yếu tố cần được xem xét kỹ lưỡng trong việc thiết kế khả năng mở rộng của cơ sở dữ liệu.

* **NFR-SCA-01:** Hệ thống phải duy trì các NFR về hiệu năng (như đã định nghĩa ở mục 6.1) với tối đa 1.000 người dùng hoạt động đồng thời và 100.000 thiết kế đã lưu trong năm đầu tiên hoạt động.10  
* **NFR-SCA-02:** Schema và cơ sở hạ tầng của cơ sở dữ liệu (MongoDB) phải được thiết kế để có thể mở rộng theo chiều ngang (horizontally scalable) nhằm đáp ứng mức tăng trưởng khối lượng dữ liệu gấp 5 lần trong vòng 2 năm mà không cần tái cấu trúc lớn.

### **6.5. Khả Năng Bảo Trì**

Khả năng bảo trì liên quan đến sự dễ dàng trong việc cập nhật, sửa lỗi và cải tiến hệ thống.11

* **NFR-MAI-01:** Mã nguồn phải được module hóa (ví dụ: sử dụng React components, Express routes/services) để cho phép các bản cập nhật và sửa lỗi độc lập cho các phần khác nhau của hệ thống.  
* **NFR-MAI-02:** Các lỗi nghiêm trọng được xác định trong môi trường production phải có thể được sửa chữa và triển khai trong vòng 4 giờ làm việc.15

### **6.6. Khả Năng Tương Thích**

Yêu cầu về khả năng tương thích đảm bảo hệ thống hoạt động tốt trên các trình duyệt và thiết bị khác nhau.9

* **NFR-COM-01:** Giao diện người dùng phía khách hàng phải hoạt động đầy đủ và hiển thị chính xác trên hai phiên bản mới nhất của các trình duyệt web chính: Chrome, Firefox, Safari, Edge.9  
* **NFR-COM-02:** Trang web nên sử dụng các nguyên tắc thiết kế đáp ứng (responsive design) để có thể sử dụng được trên các kích thước màn hình phổ biến của máy tính để bàn, máy tính bảng và điện thoại thông minh.

### **6.7. Độ Tin Cậy/Tính Sẵn Sàng**

Các yêu cầu này đảm bảo thời gian hoạt động của hệ thống và khả năng hoạt động ổn định.10

* **NFR-REL-01:** Trang web phải có thời gian hoạt động (uptime) là 99.9% trong giờ làm việc.10  
* **NFR-REL-02:** Quá trình lưu thiết kế (UC-C11) phải hoàn tất thành công ít nhất 99.95% số lần thử trong điều kiện hoạt động bình thường.

## **7\. Sơ Đồ Use Case (Mức Cao)**

### **7.1. Mục Đích của Sơ Đồ**

Sơ đồ Use Case UML (Unified Modeling Language) cung cấp một cái nhìn tổng quan, ở mức độ cao, về các chức năng chính của hệ thống và cách các tác nhân tương tác với chúng. Đây là một "công cụ mô tả cách người dùng tương tác với hệ thống" 1 và giúp hình dung các mối quan hệ giữa tác nhân và các trường hợp sử dụng.3 Một sơ đồ thường có thể truyền đạt cấu trúc tổng thể của hệ thống và các tương tác của tác nhân một cách hiệu quả và nhanh chóng hơn cho các bên liên quan đa dạng so với chỉ văn bản. Nó giúp nhìn thấy "bức tranh toàn cảnh" trước khi đi sâu vào chi tiết của từng UC.

### **7.2. Các Thành Phần Sơ Đồ**

Sơ đồ sẽ sử dụng các ký hiệu chuẩn của UML:

* **Tác nhân (Actor):** Biểu diễn bằng hình người que (stick figure).  
* **Trường hợp sử dụng (Use Case):** Biểu diễn bằng hình elip.  
* **Quan hệ (Association):** Đường thẳng nối giữa Tác nhân và Use Case.  
* **Quan hệ \<\<include\>\>:** Mũi tên nét đứt từ Use Case cơ sở đến Use Case được bao gồm, có nhãn \<\<include\>\>.  
* **Quan hệ \<\<extend\>\>:** Mũi tên nét đứt từ Use Case mở rộng đến Use Case cơ sở, có nhãn \<\<extend\>\>.1

### **7.3. Sơ Đồ**

*(Phần này trong một tài liệu thực tế sẽ chứa hình ảnh sơ đồ Use Case. Do giới hạn của định dạng văn bản, sơ đồ sẽ được mô tả bằng lời.)*

Sơ đồ sẽ bao gồm các yếu tố chính sau:

* **Các Tác nhân:**  
  * Khách hàng  
  * Quản trị viên  
* **Các Use Case chính của Khách hàng:**  
  * Quản Lý Tài Khoản (có thể là một package chứa UC-C01, UC-C02, UC-C03, UC-C24)  
  * Thiết Kế Áo Tùy Chỉnh (bao gồm các bước từ UC-C05 đến UC-C11)  
  * Quản Lý Bộ Sưu Tập (UC-C12, UC-C13)  
  * Thêm Vào Giỏ Hàng (UC-C14, UC-C15)  
  * Xem Giỏ Hàng (UC-C16)  
  * Thực Hiện Thanh Toán (bao gồm UC-C18, UC-C19, UC-C20, UC-C21)  
    * Thực Hiện Thanh Toán \<\<bao gồm\>\> Xử Lý Thanh Toán (UC-S03)  
  * Xem Lịch Sử Đơn Hàng (UC-C22, UC-C23)  
* **Các Use Case chính của Quản trị viên:**  
  * Đăng Nhập Quản Trị (UC-A01)  
  * Quản Lý Đơn Hàng (UC-A02)  
  * Quản Lý Thiết Kế UGC (bao gồm UC-A03, UC-A04 \- quản lý nội dung do người dùng tạo)  
  * Quản Lý Mẫu Áo Mockup (UC-A05)  
  * Xem Báo Cáo Doanh Thu (UC-A06)  
  * Quản Lý Tài Khoản Người Dùng (Admin) (UC-A07)  
* **Các Use Case hệ thống/chung được bao gồm (\<\<include\>\>):**  
  * Xác Thực Người Dùng (UC-S01) \- được bao gồm bởi Đăng Nhập Người Dùng, Đăng Nhập Quản Trị, có thể bởi Thực Hiện Thanh Toán.  
  * Xác Thực Dữ Liệu Đầu Vào (UC-S02) \- được bao gồm bởi nhiều UC có nhập liệu.  
  * Xử Lý Thanh Toán (UC-S03) \- được bao gồm bởi Đặt Hàng (trong Thực Hiện Thanh Toán).  
* **Các mối quan hệ chính:**  
  * Khách hàng tương tác với tất cả các UC của Khách hàng.  
  * Quản trị viên tương tác với tất cả các UC của Quản trị viên.

Sơ đồ này sẽ cung cấp một cái nhìn trực quan về phạm vi chức năng của hệ thống và cách các vai trò người dùng khác nhau tương tác với các chức năng đó.

## **8\. Kết Luận**

Tài liệu này đã trình bày chi tiết các trường hợp sử dụng (Use Cases) và các yêu cầu phi chức năng (NFRs) cho hệ thống web bán quần áo thú cưng với tính năng tùy chỉnh thiết kế "Pet-a-Porter Custom Design". Việc xác định rõ ràng các tác nhân, luồng tương tác của họ với hệ thống thông qua các Use Case, và các tiêu chí chất lượng thông qua NFRs là nền tảng quan trọng cho quá trình phát triển phần mềm.

Các Use Case được xây dựng theo chuẩn BA, mô tả cụ thể từng bước tương tác, điều kiện tiên quyết, hậu điều kiện, cũng như các luồng chính, luồng thay thế và luồng ngoại lệ. Điều này nhằm đảm bảo đội ngũ phát triển có một sự hiểu biết thống nhất và chi tiết về các yêu cầu chức năng của hệ thống từ góc độ người dùng. Đặc biệt, các Use Case liên quan đến công cụ thiết kế tùy chỉnh – tính năng cốt lõi của dự án – đã được chú trọng để phản ánh trải nghiệm người dùng mong muốn.

Các Yêu cầu Phi Chức năng đã được xác định và định lượng hóa, bao gồm các khía cạnh về hiệu năng, bảo mật, khả năng sử dụng, khả năng mở rộng, khả năng bảo trì, khả năng tương thích và độ tin cậy. Việc đáp ứng các NFR này là thiết yếu để đảm bảo hệ thống không chỉ hoạt động đúng chức năng mà còn mang lại trải nghiệm tốt cho người dùng, an toàn, ổn định và có khả năng phát triển trong tương lai. Những cân nhắc về việc sử dụng chuỗi base64 cho lưu trữ thiết kế và các tác động của nó đến hiệu năng và khả năng mở rộng đã được ghi nhận và phản ánh trong các NFR tương ứng. Tương tự, các yêu cầu về bảo mật cho nội dung do người dùng tạo và quy trình kiểm duyệt của quản trị viên cũng đã được nhấn mạnh.

Tài liệu này sẽ đóng vai trò là cơ sở tham chiếu chính cho các giai đoạn thiết kế, phát triển, kiểm thử và triển khai hệ thống "Pet-a-Porter Custom Design", góp phần đảm bảo sản phẩm cuối cùng đáp ứng được mục tiêu kinh doanh và nhu cầu của người dùng.

#### **Nguồn trích dẫn**

1. Use Case là gì? Cấu trúc của sơ đồ Use Case \- Hà Phương, truy cập vào tháng 6 5, 2025, [https://npp.com.vn/use-case-la-gi/](https://npp.com.vn/use-case-la-gi/)  
2. Nhóm tài liệu cho BA: User Story, Use Case và Functional Specification Document \- BAC, truy cập vào tháng 6 5, 2025, [https://www.bacs.vn/vi/blog/nghe-nghiep/nhom-tai-lieu-cho-ba-user-story-use-case-va-functional-specification-document-11000.html](https://www.bacs.vn/vi/blog/nghe-nghiep/nhom-tai-lieu-cho-ba-user-story-use-case-va-functional-specification-document-11000.html)  
3. Use Case là gì? Cách xây dựng sơ đồ Use Case hiệu quả \- Stringee, truy cập vào tháng 6 5, 2025, [https://stringee.com/vi/blog/post/use-case-diagram-la-gi](https://stringee.com/vi/blog/post/use-case-diagram-la-gi)  
4. Kỹ năng viết Use Case \- BAC, truy cập vào tháng 6 5, 2025, [https://www.bacs.vn/vi/blog/ky-nang/ky-nang-viet-use-case-20877.html](https://www.bacs.vn/vi/blog/ky-nang/ky-nang-viet-use-case-20877.html)  
5. ﻿Tìm hiểu về Usecase Diagram \- Cao Đẳng FPT Polytechnic, truy cập vào tháng 6 5, 2025, [https://caodang.fpt.edu.vn/tin-tuc-poly/%EF%BB%BF-usecase-diagram.html](https://caodang.fpt.edu.vn/tin-tuc-poly/%EF%BB%BF-usecase-diagram.html)  
6. Giải thích các ký hiệu trong use case diagram | 200Lab Blog, truy cập vào tháng 6 5, 2025, [https://200lab.io/blog/giai-thich-cac-ky-hieu-trong-use-case-diagram](https://200lab.io/blog/giai-thich-cac-ky-hieu-trong-use-case-diagram)  
7. Use Case là gì? Tổng hợp các thành phần chính của bản vẽ Use Case \- FPT Shop, truy cập vào tháng 6 5, 2025, [https://fptshop.com.vn/tin-tuc/danh-gia/use-case-la-gi-165983](https://fptshop.com.vn/tin-tuc/danh-gia/use-case-la-gi-165983)  
8. What are non-functional requirements in usability? \- Design Gurus, truy cập vào tháng 6 5, 2025, [https://www.designgurus.io/answers/detail/what-are-non-functional-requirements-in-usability](https://www.designgurus.io/answers/detail/what-are-non-functional-requirements-in-usability)  
9. UX non-functional requirements | Staff Gateway, truy cập vào tháng 6 5, 2025, [https://staff.admin.ox.ac.uk/ux/procurement/non-functional-requirements](https://staff.admin.ox.ac.uk/ux/procurement/non-functional-requirements)  
10. Non-Functional Requirements Examples: a Full Guide \- Testomat, truy cập vào tháng 6 5, 2025, [https://testomat.io/blog/non-functional-requirements-examples-definition-complete-guide/](https://testomat.io/blog/non-functional-requirements-examples-definition-complete-guide/)  
11. Non-Functional Requirements: Tips, Tools, and Examples | Perforce Software, truy cập vào tháng 6 5, 2025, [https://www.perforce.com/blog/alm/what-are-non-functional-requirements-examples](https://www.perforce.com/blog/alm/what-are-non-functional-requirements-examples)  
12. Is performance a non-functional requirement? \- Design Gurus, truy cập vào tháng 6 5, 2025, [https://www.designgurus.io/answers/detail/is-performance-a-non-functional-requirement](https://www.designgurus.io/answers/detail/is-performance-a-non-functional-requirement)  
13. E-Commerce System Requirements: A Guide to Build an Online Store \- DhiWise, truy cập vào tháng 6 5, 2025, [https://www.dhiwise.com/blog/requirement-builder/ecommerce-system-requirements](https://www.dhiwise.com/blog/requirement-builder/ecommerce-system-requirements)  
14. Non-Functional requirements (Mobile) \- Confluence, truy cập vào tháng 6 5, 2025, [https://confluence.mobidev.biz/pages/viewpage.action?pageId=76361127](https://confluence.mobidev.biz/pages/viewpage.action?pageId=76361127)  
15. NFRs: What is Non Functional Requirements (Example & Types) \- BrowserStack, truy cập vào tháng 6 5, 2025, [https://www.browserstack.com/guide/non-functional-requirements-examples](https://www.browserstack.com/guide/non-functional-requirements-examples)  
16. Guide to NonFunctional Requirements: Types and Best Practices \- Devzery, truy cập vào tháng 6 5, 2025, [https://www.devzery.com/post/guide-to-nonfunctional-requirements](https://www.devzery.com/post/guide-to-nonfunctional-requirements)  
17. Writing Non-Functional Requirements in 6 Steps, truy cập vào tháng 6 5, 2025, [https://www.modernrequirements.com/blogs/what-are-non-functional-requirements-and-how-to-build-them/](https://www.modernrequirements.com/blogs/what-are-non-functional-requirements-and-how-to-build-them/)  
18. Non-Functional Requirements (Interoperability): \- ArgonDigital | Making Technology a Strategic Advantage, truy cập vào tháng 6 5, 2025, [https://argondigital.com/blog/product-management/non-functional-requirements-interoperability-requirements/](https://argondigital.com/blog/product-management/non-functional-requirements-interoperability-requirements/)