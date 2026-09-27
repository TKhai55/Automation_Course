# Chi tiêu – App quản lý chi tiêu cho iPhone

App ghi chép thu chi cá nhân, viết bằng **Expo (React Native + TypeScript)**. Dữ liệu lưu ngay trên điện thoại, không cần mạng, không cần tài khoản.

## Tính năng

- Thêm khoản **chi tiêu / thu nhập**: số tiền (tự thêm dấu chấm: `150.000`), nút cộng nhanh `+10k +50k +100k +500k`, danh mục, ngày, ghi chú
- Tổng quan theo tháng: **số dư, tổng thu, tổng chi**
- Biểu đồ thanh **chi tiêu theo danh mục** (%, số tiền)
- Danh sách giao dịch gom theo ngày (Hôm nay, Hôm qua, Thứ Hai 21/09...)
- Chạm vào một giao dịch để **sửa** hoặc **xóa**
- Chuyển qua lại giữa các tháng

## Cách 1 – Chạy thử nhanh bằng Expo Go (khoảng 5 phút)

Không cần Xcode và không cần tài khoản Apple Developer.

1. Trên Mac, cài **Node.js** bản LTS (tải ở https://nodejs.org hoặc chạy `brew install node`).
2. Tải code và cài thư viện:
   ```bash
   git clone https://github.com/TKhai55/Automation_Course.git
   cd Automation_Course
   git checkout claude/tao-app-tren-ip-5i3o29
   cd expense-app
   npm install
   ```
3. Trên iPhone, cài app **Expo Go** từ App Store.
4. Trên Mac, chạy:
   ```bash
   npx expo start
   ```
5. Mở **Camera** trên iPhone, quét mã QR hiện trong Terminal, app sẽ mở trong Expo Go.
   - iPhone và Mac phải dùng **chung Wi-Fi**. Nếu quét không được, thử `npx expo start --tunnel`.

> Cách này chỉ dùng để thử và sửa code: Mac phải đang chạy `npx expo start` thì app mới mở được.

## Cách 2 – Cài hẳn app lên iPhone (có icon riêng, không cần Mac chạy kèm)

1. Cài **Xcode** từ Mac App Store, mở lên một lần để cài thêm thành phần.
2. Đăng nhập Apple ID vào Xcode: **Xcode → Settings → Accounts → +**. Apple ID miễn phí là đủ.
3. Cắm iPhone vào Mac bằng cáp, bấm **Tin cậy** trên iPhone.
   Bật **Chế độ nhà phát triển**: *Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển*. iPhone sẽ khởi động lại.
4. Trong thư mục `expense-app`, chạy:
   ```bash
   npx expo run:ios --device --configuration Release
   ```
   Chọn iPhone của bạn trong danh sách. Nếu được hỏi cài **CocoaPods** thì chọn đồng ý (hoặc tự chạy `brew install cocoapods`).
5. Nếu báo lỗi **Signing**: mở `ios/Chitiu.xcworkspace` bằng Xcode, chọn target → **Signing & Capabilities** → mục **Team** chọn Apple ID của bạn (Personal Team).
   Nếu báo trùng *bundle identifier*, sửa `ios.bundleIdentifier` trong `app.json` (ví dụ `com.tenban.chitieu`) rồi chạy lại bước 4.
6. Lần đầu mở app trên iPhone: *Cài đặt → Cài đặt chung → Quản lý VPN & Thiết bị* → chọn Apple ID của bạn → **Tin cậy**.

**Lưu ý:** với Apple ID miễn phí, app **hết hạn sau 7 ngày**. Khi hết hạn chỉ cần cắm máy và chạy lại lệnh ở bước 4. Dữ liệu vẫn còn, miễn là bạn không xóa app. Muốn app dùng được 1 năm hoặc đưa lên TestFlight/App Store thì cần đăng ký Apple Developer Program (99 USD/năm).

## Lệnh cho lập trình

| Lệnh | Tác dụng |
|---|---|
| `npm start` | Chạy dev server (Expo Go) |
| `npm run web` | Xem thử app trên trình duyệt |
| `npm test` | Chạy unit test phần tính toán (`__tests__/`) |
| `npm run typecheck` | Kiểm tra lỗi TypeScript |

## Cấu trúc thư mục

```
expense-app/
├── App.tsx                  # Điểm vào của app
├── app.json                 # Tên app, icon, bundle identifier
├── src/
│   ├── HomeScreen.tsx       # Màn hình chính
│   ├── components/          # Thẻ tổng quan, biểu đồ, dòng giao dịch, form
│   ├── logic.ts             # Tính toán thuần: định dạng tiền, ngày, thống kê
│   ├── categories.ts        # Danh mục thu/chi (muốn thêm danh mục thì sửa ở đây)
│   ├── storage.ts           # Lưu/đọc dữ liệu trên máy (AsyncStorage)
│   └── useTransactions.ts   # Quản lý danh sách giao dịch
└── __tests__/logic.test.ts  # Unit test
```

## Viết test tự động (Appium / WebdriverIO)

Các phần tử chính đều có `testID`, dùng làm *accessibility id* khi viết test mobile. Cách viết giống bộ test WebdriverIO ở thư mục gốc repo:

| testID | Phần tử |
|---|---|
| `add-button` | Nút + thêm giao dịch |
| `type-expense`, `type-income` | Chọn Chi tiêu / Thu nhập |
| `amount-input` | Ô nhập số tiền |
| `quick-amount-10000`... | Nút cộng nhanh |
| `category-food`, `category-transport`... | Chọn danh mục (id trong `src/categories.ts`) |
| `date-prev`, `date-next` | Đổi ngày |
| `note-input` | Ô ghi chú |
| `save-button`, `cancel-button`, `delete-button` | Lưu / Hủy / Xóa |
| `balance-text`, `income-text`, `expense-text` | Số dư, tổng thu, tổng chi |
| `month-prev`, `month-next`, `month-label` | Chuyển tháng |
| `tx-item-<id>` | Một dòng giao dịch |
| `empty-state` | Màn hình khi chưa có giao dịch |

Ví dụ với WebdriverIO + Appium: `await $('~add-button').click()`.
