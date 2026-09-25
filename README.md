# 🎓 VKU Study Room Booking App (Mini-Project 2)

Ứng dụng đặt phòng tự học thông minh thời gian thực đa nền tảng (**Mobile Native Android/iOS** & **Desktop Web**) dành cho sinh viên trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (**VKU**).

---

## 📌 Giới thiệu tổng quan
Dự án được xây dựng phục vụ học phần **Lập trình Đa nền tảng (Cross-Platform Mobile App Development)**. Ứng dụng giải quyết bài toán đặt phòng tự học, phòng lab, hội thảo nhóm tại các tòa A, B, C, V thuộc khuôn viên VKU với kiến trúc ngoại tuyến (Offline-First), phát hiện xung đột lịch tức thì và tự động phát hành thẻ thông hành mã QR điện tử.

---

## 🚀 Các tính năng nổi bật

### 1. Giao diện Đa nền tảng (Adaptive Cross-Platform UI)
* **Desktop Web (≥ 768px):** Giao diện cổng thông tin học đường toàn màn hình, thanh điều hướng `DesktopHeader` ở phía trên, lưới phòng học 3 cột, hiển thị chi tiết phòng và card đặt lịch song song.
* **Mobile Native (< 768px):** Chuẩn thiết kế Mobile với thanh điều hướng đáy cong **Dark Navy** (`#0B1B32`), danh sách phòng cuộn dọc 60fps mượt mà, nút thao tác cố định ở đáy màn hình.

### 2. Động cơ chống trùng lịch thời gian thực (Conflict Engine)
* Đảm bảo không thể đặt trùng: cùng một phòng + cùng ngày + cùng ca học.
* Trạng thái ca học hiển thị trực quan 3 chế độ:
  - `✓ Available` (Ca còn trống)
  - `✓✓ Selected` (Ca đang chọn)
  - `🔒 Booked` (Ca đã có người đặt, tự động khóa và mờ đi)

### 3. Ca học 2 tiếng cố định trong vòng 7 ngày
* Chia thành 4 ca học mỗi ngày:
  - Ca 1: `07:30 - 09:30`
  - Ca 2: `09:30 - 11:30`
  - Ca 3: `13:00 - 15:00`
  - Ca 4: `15:00 - 17:00`
* Tự động sinh lịch 7 ngày liên tiếp từ ngày hiện tại.

### 4. Thẻ thông hành QR Pass điện tử
* Mỗi lượt đặt phòng thành công được cấp mã đặt phòng độc nhất dạng `VKU-XXXXXX`.
* Mã QR vector độ nét cao (`react-native-qrcode-svg`) chứa thông tin xác thực ngoại tuyến để bảo vệ / quản lý phòng kiểm tra khi sinh viên check-in.

### 5. Backend Cloud & Cơ sở dữ liệu thời gian thực (Supabase & PostgreSQL)
* **Backend as a Service (BaaS):** Sử dụng **Supabase** với cơ sở dữ liệu quan hệ **PostgreSQL**.
* **Đồng bộ thời gian thực (Realtime WebSocket):** Khi một sinh viên đặt hoặc hủy phòng trên thiết bị bất kỳ, toàn bộ các máy khác (Web, Android, iOS) sẽ tự động cập nhật trạng thái phòng ngay lập tức mà không cần tải lại trang.
* **Toàn vẹn dữ liệu (Unique Constraint):** Chặn triệt để tình trạng xung đột đặt trùng slot từ cấp Database với chỉ mục `unique_active_room_slot` (`room_id`, `date`, `slot_id`).
* **Lưu trữ ngoại tuyến (Offline-First):** Tích hợp **Zustand** kết hợp **AsyncStorage**. Khi mất kết nối mạng hoặc chưa cấu hình DB, ứng dụng vẫn hoạt động mượt mà với bộ nhớ đệm cục bộ trên máy.

### 6. Quản lý đặt phòng & Hủy lịch an toàn
* Phân loại tab `Upcoming` (Sắp diễn ra) và `Past` (Lịch sử / Đã hủy).
* Hộp thoại Modal xác nhận hủy phòng hoạt động mượt mà trên cả Web và Android, ngay lập tức giải phóng khung giờ cho các sinh viên khác trên toàn hệ thống Database.

### 7. Quản lý thông tin sinh viên (Profile Management)
* Cho phép chỉnh sửa trực tiếp: Họ và tên, Mã số sinh viên (MSSV), Email VKU, Khoa/Ngành đào tạo và ảnh đại diện.
* Dữ liệu đồng bộ tức thì lên thanh tiêu đề, lời chào trang chủ và thẻ vé QR.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Công nghệ | Phiên bản / Chi tiết | Mục đích sử dụng |
|---|---|---|
| **React Native** | `0.86.3` | Nền tảng phát triển ứng dụng di động đa nền tảng |
| **Expo SDK** | `~57.0.24` | Bộ công cụ và môi trường phát triển ứng dụng |
| **TypeScript** | `~6.0.3` | Đảm bảo tính chặt chẽ về kiểu dữ liệu (Type Safety) |
| **Supabase (Backend)** | `@supabase/supabase-js` | Nền tảng Backend đám mây, API và WebSocket Realtime |
| **PostgreSQL (Database)** | `v15+` | Cơ sở dữ liệu quan hệ lưu trữ phòng học và lịch đặt |
| **Zustand** | `^5.0.15` | Quản lý trạng thái toàn cục (State Management) |
| **AsyncStorage** | `2.2.0` | Lưu trữ dữ liệu cục bộ ngoại tuyến trên thiết bị |
| **React Navigation** | `^7.x` | Điều hướng màn hình (Native Stack & Bottom Tabs) |
| **react-native-qrcode-svg** | `^6.3.26` | Sinh mã QR Code vé nhận phòng học |
| **expo-notifications** | `~57.0.20` | Lập lịch nhắc hẹn 15 phút trước giờ nhận phòng |

---

## 📂 Cấu trúc thư mục dự án

```
miniproject2/
├── assets/                       # Ảnh tĩnh, icon, screenshots minh chứng
├── src/
│   ├── components/               # Các component tái sử dụng (RoomCard, Header, QR...)
│   ├── constants/                # Hằng số (tòa nhà, thiết bị, khung giờ, user mặc định)
│   ├── data/                     # Dữ liệu 16 phòng học tòa A, B, C, V
│   ├── navigation/               # Bộ điều hướng AppNavigator
│   ├── screens/                  # Các màn hình chính (Home, Detail, Confirm, Profile...)
│   ├── services/                 # NotificationService & Supabase Realtime Client
│   │   ├── notificationService.ts
│   │   └── supabase.ts
│   ├── store/                    # Zustand store (useBookingStore) kết nối Supabase
│   ├── theme/                    # Bảng màu VKU, typography, khoảng cách
│   ├── types/                    # Định nghĩa Interface TypeScript
│   └── utils/                    # Xử lý conflict lịch, định dạng ngày giờ, tạo mã
├── .env.example                  # File mẫu khai báo biến môi trường Supabase
├── supabase_schema.sql           # Script khởi tạo Database PostgreSQL & Realtime
├── App.tsx                       # Entry component chính của ứng dụng
├── app.json                      # Cấu hình dự án Expo SDK 57
├── eas.json                      # Cấu hình đóng gói build file APK Android
└── package.json                  # Khai báo thư viện và scripts
```

---

## 💻 Hướng dẫn cài đặt và chạy ứng dụng

### 1. Yêu cầu hệ thống
* Đã cài đặt **Node.js** (khuyến nghị phiên bản `>= 18.x`).
* Đã cài đặt **Android Studio** (kèm Android Emulator) nếu muốn test trên máy ảo Android, hoặc cài ứng dụng **Expo Go** trên điện thoại thật.

### 2. Cài đặt thư viện
Mở terminal tại thư mục dự án và chạy:
```bash
npm install
```

### 3. Cấu hình Backend & Database (Supabase)
1. Tạo một project miễn phí tại [Supabase](https://supabase.com).
2. Vào **SQL Editor** trên Supabase, copy toàn bộ nội dung file [supabase_schema.sql](file:///d:/Nam4ki1/danentang/miniproject2/supabase_schema.sql) dán vào và bấm **Run** để khởi tạo các bảng và dữ liệu 16 phòng học VKU.
3. Tạo file `.env` tại thư mục gốc dự án (tham khảo file [.env.example](file:///d:/Nam4ki1/danentang/miniproject2/.env.example)) và điền thông tin:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```
*(Nếu chưa cấu hình Supabase, app sẽ tự động chuyển sang chế độ Offline-First lưu trữ cục bộ qua AsyncStorage mà không bị lỗi crash).*

### 4. Khởi chạy ứng dụng (Development Server)
```bash
npx expo start
```

### 5. Chạy trên các nền tảng:
* **Chạy trên Trình duyệt Web:**
  - Bấm phím `w` trên terminal, hoặc mở trình duyệt truy cập: `http://localhost:8081` (hoặc `http://localhost:8082`).
* **Chạy trên Máy ảo Android (Android Studio):**
  - Mở máy ảo Android lên trước.
  - Bấm phím `a` trên terminal để Expo tự động kết nối và mở app lên máy ảo.
* **Chạy trên Điện thoại thật (Android / iOS):**
  - Mở app **Expo Go** trên điện thoại và quét mã QR hiển thị trên màn hình terminal.

---

## 📦 Hướng dẫn đóng gói file APK độc lập (EAS Build)

Dự án đã được cấu hình sẵn file `eas.json` với profile `preview` (định dạng APK trực tiếp).

Để đóng gói ra file APK cài đặt lên điện thoại:
```bash
npx eas-cli build -p android --profile preview
```
Sau khi tiến trình build trên cloud hoàn tất, EAS CLI sẽ cung cấp đường link tải file `.apk` trực tiếp về điện thoại để cài đặt và chạy mà không cần phụ thuộc vào máy tính.

---

## 📝 Giấy phép
Dự án được phát triển phục vụ mục đích học tập tại trường Đại học CNTT & Truyền thông Việt - Hàn (VKU).
