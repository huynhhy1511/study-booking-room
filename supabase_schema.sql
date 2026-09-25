-- ==============================================================================
-- VKU STUDY ROOM BOOKING - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==============================================================================

-- 1. BẢNG DANH SÁCH PHÒNG HỌC (ROOMS)
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    building TEXT NOT NULL,
    floor INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    equipment TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG ĐẶT PHÒNG THỜI GIAN THỰC (BOOKINGS)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    room_name TEXT NOT NULL,
    room_code TEXT NOT NULL,
    building TEXT NOT NULL,
    floor INTEGER NOT NULL,
    date TEXT NOT NULL, -- Định dạng: YYYY-MM-DD
    slot_id TEXT NOT NULL, -- slot-1, slot-2, slot-3, slot-4
    slot_label TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    student_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'cancelled'
    qr_token TEXT NOT NULL,
    notes TEXT,
    notification_id TEXT
);

-- 3. RÀNG BUỘC DUY NHẤT CHỐNG XUNG ĐỘT (UNIQUE CONCURRENT LOCK)
-- Đảm bảo ở tầng Database không bao giờ có 2 bản ghi cùng room_id, date, slot_id ở trạng thái 'confirmed'
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_room_slot 
ON public.bookings (room_id, date, slot_id) 
WHERE (status = 'confirmed');

-- 4. KÍCH HOẠT REALTIME WEBSOCKET (SUPABASE REALTIME)
-- Cho phép máy khách nhận tín hiệu cập nhật tức thì khi có người đặt hoặc hủy phòng
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- 5. CẤU HÌNH BẢO MẬT HÀNG (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi sinh viên đọc danh sách phòng
DROP POLICY IF EXISTS "Public read rooms" ON public.rooms;
CREATE POLICY "Public read rooms" ON public.rooms FOR SELECT USING (true);

-- Cho phép đọc, thêm mới và cập nhật trạng thái đặt phòng
DROP POLICY IF EXISTS "Public read bookings" ON public.bookings;
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update bookings" ON public.bookings;
CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE USING (true);

-- 6. DỮ LIỆU MẪU BAN ĐẦU (SEED 16 PHÒNG HỌC TÒA A, B, C, V TẠI VKU)
INSERT INTO public.rooms (id, name, code, building, floor, capacity, equipment, image_url, description, type)
VALUES
  -- Tòa A
  ('room-a-101', 'Phòng Hội Thảo Nhóm A.101', 'A.101', 'A', 1, 12, ARRAY['Projector', 'Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80', 'Không gian họp nhóm và thảo luận đồ án rộng rãi, trang bị máy chiếu độ phân giải cao và bảng kính từ tính.', 'Group'),
  ('room-a-202', 'Phòng Tự Học Tiêu Chuẩn A.202', 'A.202', 'A', 2, 6, ARRAY['Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80', 'Phòng tự học yên tĩnh cho nhóm nhỏ làm bài tập lớn, có ổ cắm điện riêng từng vị trí và điều hòa mát mẻ.', 'Study'),
  ('room-a-305', 'Hội Trường Nhỏ & Thuyết Trình A.305', 'A.305', 'A', 3, 20, ARRAY['Projector', 'Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop&q=80', 'Phòng chuyên dụng cho các buổi tập dượt thuyết trình seminar, bảo vệ khóa luận hoặc họp câu lạc bộ học thuật.', 'Conference'),
  ('room-a-104', 'Phòng Tự Học Mini A.104', 'A.104', 'A', 1, 4, ARRAY['AC', 'Whiteboard'], 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80', 'Phòng nhỏ dành cho cặp đôi hoặc nhóm 3-4 bạn ôn tập chuyên sâu các môn thuật toán và toán rời rạc.', 'Study'),

  -- Tòa B
  ('room-b-201', 'Lab AI & Trí Tuệ Nhân Tạo B.201', 'B.201', 'B', 2, 10, ARRAY['High-spec PC', 'Projector', 'AC'], 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', 'Phòng lab trang bị dàn máy PC cấu hình cao GPU RTX phục vụ nghiên cứu Deep Learning, xử lý ảnh và dữ liệu lớn.', 'Lab'),
  ('room-b-203', 'Phòng Nghiên Cứu Phần Mềm B.203', 'B.203', 'B', 2, 8, ARRAY['High-spec PC', 'Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', 'Khu vực làm việc nhóm cho các đội thi Hackathon, phát triển ứng dụng Web/Mobile đa nền tảng.', 'Lab'),
  ('room-b-302', 'Phòng Thảo Luận Mạng & IoT B.302', 'B.302', 'B', 3, 6, ARRAY['Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80', 'Bàn ghế module linh hoạt, trang bị sẵn các bộ kit vi điều khiển và thiết bị đo kiểm thực hành viễn thông.', 'Group'),
  ('room-b-401', 'Không Gian Sáng Tạo Đổi Mới B.401', 'B.401', 'B', 4, 15, ARRAY['Projector', 'Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80', 'Không gian mở tràn ngập ánh sáng tự nhiên, thích hợp cho brainstorming và lên ý tưởng khởi nghiệp sáng tạo.', 'Group'),

  -- Tòa C
  ('room-c-102', 'Phòng Đọc Tự Do Thư Viện C.102', 'C.102', 'C', 1, 8, ARRAY['AC'], 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80', 'Nằm liền kề thư viện trung tâm VKU, không gian cực kỳ yên tĩnh tuyệt đối cho việc đọc sách và tra cứu tài liệu.', 'Study'),
  ('room-c-205', 'Phòng Luyện Kỹ Năng Ngoại Ngữ C.205', 'C.205', 'C', 2, 10, ARRAY['Projector', 'AC'], 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80', 'Phòng cách âm tiêu chuẩn cao, phù hợp luyện nói tiếng Anh (IELTS/TOEIC) và tiếng Hàn chuẩn bị phỏng vấn.', 'Study'),
  ('room-c-301', 'Phòng Làm Việc Nhóm Đồ Án C.301', 'C.301', 'C', 3, 6, ARRAY['Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80', 'Bố trí màn hình phụ kết nối HDMI để sinh viên cắm laptop trực tiếp xem chung source code và review tài liệu.', 'Group'),
  ('room-c-404', 'Phòng Thư Giãn Học Thuật C.404', 'C.404', 'C', 4, 12, ARRAY['AC', 'Whiteboard'], 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', 'Bàn trà đàm đạo, ghế lười đệm êm giúp giải tỏa áp lực giữa các ca tự học căng thẳng.', 'Group'),

  -- Tòa V (Tòa Nhà Việt - Hàn)
  ('room-v-101', 'Smart Classroom VIP V.101', 'V.101', 'V', 1, 16, ARRAY['Projector', 'Whiteboard', 'AC', 'High-spec PC'], 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80', 'Phòng học thông minh kiểu mẫu do đối tác Hàn Quốc tài trợ, trang bị bảng tương tác điện tử và camera họp trực tuyến.', 'Conference'),
  ('room-v-204', 'Studio Thiết Kế Đồ Họa & UI/UX V.204', 'V.204', 'V', 2, 8, ARRAY['High-spec PC', 'AC'], 'https://images.unsplash.com/photo-1542744094-3a31727221eb?w=800&auto=format&fit=crop&q=80', 'Dành riêng cho sinh viên thiết kế đồ họa, truyền thông đa phương tiện với màn hình chuẩn màu 4K IPS.', 'Lab'),
  ('room-v-302', 'Phòng Nghiên Cứu Khoa Học Sinh Viên V.302', 'V.302', 'V', 3, 6, ARRAY['Whiteboard', 'AC', 'Projector'], 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&auto=format&fit=crop&q=80', 'Không gian dành riêng cho các nhóm sinh viên làm đề tài nghiên cứu cấp trường, viết bài báo khoa học quốc tế.', 'Group'),
  ('room-v-501', 'Penthouse View Tự Học Toàn Cảnh V.501', 'V.501', 'V', 5, 20, ARRAY['Projector', 'Whiteboard', 'AC'], 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80', 'Tầng cao nhất với view ngắm nhìn toàn cảnh campus VKU xanh mát, không gian rộng rãi truyền cảm hứng học tập đỉnh cao.', 'Conference')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  building = EXCLUDED.building,
  floor = EXCLUDED.floor,
  capacity = EXCLUDED.capacity,
  equipment = EXCLUDED.equipment,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  type = EXCLUDED.type;
