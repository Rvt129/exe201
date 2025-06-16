# Cart Components

Thư mục này chứa các components được tách nhỏ từ component Cart chính để dễ quản lý và tái sử dụng.

## Cấu trúc Components

### Main Components
- **CartHeader** - Header của giỏ hàng hiển thị tiêu đề và số lượng sản phẩm
- **CartItem** - Component hiển thị từng item trong giỏ hàng
- **CartActions** - Các action buttons (như tiếp tục mua sắm)
- **OrderSummary** - Tóm tắt đơn hàng và thanh toán

### Utility Components
- **EmptyCart** - Hiển thị khi giỏ hàng trống
- **LoadingState** - Trạng thái loading
- **ErrorState** - Trạng thái lỗi

### Sub Components (được sử dụng trong CartItem)
- **SizeSelector** - Dropdown chọn size
- **PetTypeSelector** - Dropdown chọn loại thú cưng
- **ColorSelector** - Dropdown chọn màu sắc
- **QuantityControl** - Điều khiển số lượng

## Cách sử dụng

Tất cả components được export từ `index.js`:

```javascript
import {
  CartHeader,
  CartItem,
  CartActions,
  EmptyCart,
  LoadingState,
  ErrorState,
  OrderSummary
} from "../../components/cart";
```

## Props của các components chính

### CartHeader
- `itemCount`: Số lượng items trong giỏ hàng

### CartItem
- `item`: Object chứa thông tin item
- `availableSizes`: Array các size có sẵn
- `editingSizeItem`: ID của item đang edit size
- `editingPetTypeItem`: ID của item đang edit pet type
- `editingColorItem`: ID của item đang edit color
- `addingSizeItemId`: ID của item đang thêm size
- Và các handler functions...

### OrderSummary
- `cartItems`: Array các items trong giỏ
- `subtotal`: Tổng tạm tính
- `shippingFee`: Phí vận chuyển
- `total`: Tổng cộng
- `promoCode`: Mã khuyến mãi
- `onPromoCodeChange`: Handler thay đổi promo code
- `onApplyPromo`: Handler áp dụng promo
- `onCheckout`: Handler thanh toán

### EmptyCart
- `onContinueShopping`: Handler tiếp tục mua sắm

### LoadingState
- `message`: Thông báo loading (optional)

### ErrorState
- `error`: Thông báo lỗi
- `onRetry`: Handler thử lại

## Lợi ích của việc tách components

1. **Dễ bảo trì**: Mỗi component có trách nhiệm riêng biệt
2. **Tái sử dụng**: Có thể sử dụng lại ở các trang khác
3. **Dễ test**: Test từng component riêng lẻ
4. **Code cleaner**: Main Cart component nhỏ gọn và dễ đọc hơn
5. **Performance**: Có thể optimize từng component riêng
