# MINI-PROJECT SHORT TECHNICAL REPORT
**Course:** Cross-Platform Mobile App Development (VKU)  
**Mini-Project Title:** Mini-Project 2: Real-time Study Room Booking Application  
**Team / Student Name:** Huỳnh Ngọc Huy  
**Submission Date:** 24/09/2026  

---

## 1. GENERAL INFORMATION & DELIVERABLE LINKS
* **Team Members:**
  - **Huỳnh Ngọc Huy** — Student ID: **23IT.EB043** 
* **🔗 Live Demo URL:** [http://localhost:8081](http://localhost:8081) (Expo Web Platform) / Expo Go (Android Emulator & Physical Device)
* **💻 GitHub Repository:**https://github.com/huynhhy1511/study-booking-room
* **🎥 Video Demo (Optional):**

---

## 2. FEATURE IMPLEMENTATION CHECKLIST

| # | Required Feature | Status | Implementation Details & Acceptance Level |
|:---:|---|:---:|---|
| 1 | Cross-Platform UI | ✅ Complete | Tự thích ứng giữa Web máy tính và Mobile Native |
| 2 | Conflict Prevention | ✅ Complete | Tự động khóa slot khi đã có người đặt |
| 3 | Backend Database Sync | ✅ Complete | Đồng bộ thời gian thực qua Supabase PostgreSQL và lưu ngoại tuyến |
| 4 | Discrete Time Slots | ✅ Complete | Đặt phòng theo 4 ca cố định 2 tiếng trong vòng 7 ngày |
| 5 | Digital QR Pass | ✅ Complete | Tạo mã đặt phòng và mã QR check-in phòng học |
| 6 | Local Notification | ✅ Complete | Thông báo nhắc nhở trước giờ nhận phòng 15 phút |
| 7 | Search and Filter | ✅ Complete | Tìm kiếm theo tên phòng, tòa nhà, sức chứa và tiện nghi |
| 8 | Reservation Management | ✅ Complete | Quản lý danh sách đặt phòng và hỗ trợ hủy lịch |
| 9 | Student Profile | ✅ Complete | Chỉnh sửa và cập nhật thông tin cá nhân sinh viên |

---

## 3. TECHNICAL ARCHITECTURE & PROJECT STRUCTURE

### 3.1 Directory Structure
```
miniproject2/
├── assets/                       # Static brand logos, adaptive icons & screenshots
│   ├── favicon.png
│   ├── icon.png
│   └── screenshots/              # Empirical evidence images
├── src/
│   ├── components/               # Modular reusable UI components
│   │   ├── BrandLogo.tsx         # Smiling 'U' campus mascot
│   │   ├── DateSlotSelector.tsx  # Interactive date & 3-state slot selector
│   │   ├── DesktopHeader.tsx     # Full responsive top navigation for Web desktop
│   │   ├── EmptyState.tsx        # Fallback UI for zero search/booking results
│   │   ├── FilterBottomSheet.tsx # Slide-up modal sheet for multi-criteria filters
│   │   ├── QRPassModal.tsx       # Vector QR Pass viewer modal
│   │   ├── RoomCard.tsx          # Memoized 60fps study room card (grid & list)
│   │   └── StatusBadge.tsx       # Accessible room status pill
│   ├── constants/                # Buildings (A, B, C, V), Equipment, 2h Time Slots
│   ├── data/                     # 16 VKU study rooms with rich local metadata
│   ├── navigation/               # AppNavigator (Native Stack + Adaptive Bottom Tabs)
│   ├── screens/                  # Application screens
│   │   ├── HomeScreen.tsx        # Main discovery catalog & search
│   │   ├── RoomDetailScreen.tsx  # Split desktop / vertical mobile room details
│   │   ├── BookingConfirmationScreen.tsx # Review ticket before booking
│   │   ├── BookingSuccessScreen.tsx      # Success receipt with QR preview
│   │   ├── MyReservationsScreen.tsx      # Upcoming/Past bookings & cancel modal
│   │   ├── NotificationsScreen.tsx       # Notification center tab
│   │   ├── ProfileScreen.tsx             # Profile editor & student credentials
│   │   └── OnboardingScreen.tsx          # Campus intro & feature overview
│   ├── services/                 # NotificationService & Supabase Realtime Client
│   │   ├── notificationService.ts
│   │   └── supabase.ts
│   ├── store/                    # Zustand useBookingStore with Supabase & AsyncStorage
│   ├── theme/                    # Color tokens, typography, radii, elevation shadows
│   ├── types/                    # Strict TypeScript interfaces (Room, Booking, etc.)
│   └── utils/                    # Conflict engine, date parsers, unique ID generators
├── .env.example                  # Template biến môi trường Supabase
├── supabase_schema.sql           # Script khởi tạo Database PostgreSQL & Realtime
├── App.tsx                       # Root container with SafeAreaProvider & Web CSS fixes
├── app.json                      # Expo SDK 57 manifest & package configuration
├── eas.json                      # Cloud build configuration (preview APK & production)
└── package.json                  # Dependencies (React 19, RN 0.86, Expo 57, Zustand 5)
```

### 3.2 State Management Flow
Ứng dụng kết hợp Zustand, AsyncStorage và Supabase Realtime để đồng bộ dữ liệu thời gian thực giữa các thiết bị. Mọi thao tác đặt phòng hoặc hủy lịch được xử lý qua PostgreSQL và cập nhật tức thì qua WebSocket.

---

## 4. EMPIRICAL EVIDENCE & SCREENSHOTS



Home Screen – Room list, search, and filters.
Room Detail – Room information, 7-day selector, and available/booked time slots.
Booking Success – Confirmed booking with booking ID and QR pass.
My Reservations – Active reservations and cancellation functionality.

## 5. TECHNICAL CHALLENGES & RESOLUTIONS

Challenge 1: Booking Conflict Prevention

Multiple users may attempt to reserve the same room and time slot.

Resolution:
Implemented frontend conflict validation and a database-level unique constraint on room + date + time slot to prevent duplicate bookings.

Challenge 2: Realtime Booking Updates

Room availability must update immediately after a booking or cancellation.

Resolution:
Used Supabase Realtime with Zustand so booking changes are reflected immediately in the application UI without requiring a manual refresh.