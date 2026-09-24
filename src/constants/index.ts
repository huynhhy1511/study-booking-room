import { Building, Equipment, TimeSlot } from '../types';

export const BUILDINGS: { id: Building | 'ALL'; name: string; label: string }[] = [
  { id: 'ALL', name: 'Tất cả khu', label: 'Tất cả' },
  { id: 'A', name: 'Tòa nhà A - Hành chính & Giảng đường', label: 'Tòa A' },
  { id: 'B', name: 'Tòa nhà B - Thực hành Công nghệ', label: 'Tòa B' },
  { id: 'C', name: 'Tòa nhà C - Trung tâm Nghiên cứu', label: 'Tòa C' },
  { id: 'V', name: 'Tòa nhà V - Không gian Sáng tạo & Thư viện', label: 'Tòa V' },
];

export const EQUIPMENT_LIST: { id: Equipment; name: string; icon: string }[] = [
  { id: 'Projector', name: 'Máy chiếu', icon: 'videocam-outline' },
  { id: 'Whiteboard', name: 'Bảng trắng', icon: 'easel-outline' },
  { id: 'High-spec PC', name: 'Dàn PC cấu hình cao', icon: 'desktop-outline' },
  { id: 'AC', name: 'Điều hòa 2 chiều', icon: 'snow-outline' },
];

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    startTime: '07:30',
    endTime: '09:30',
    label: '07:30 - 09:30',
    period: 'morning',
  },
  {
    id: 'slot-2',
    startTime: '09:30',
    endTime: '11:30',
    label: '09:30 - 11:30',
    period: 'morning',
  },
  {
    id: 'slot-3',
    startTime: '13:00',
    endTime: '15:00',
    label: '13:00 - 15:00',
    period: 'afternoon',
  },
  {
    id: 'slot-4',
    startTime: '15:00',
    endTime: '17:00',
    label: '15:00 - 17:00',
    period: 'afternoon',
  },
];

export const DEFAULT_USER = {
  id: 'usr-vku-202401',
  name: 'Nguyễn Văn An',
  email: 'annv.21it@vku.udn.vn',
  studentId: '21IT001',
  department: 'Khoa Công Nghệ Thông Tin & Truyền Thông',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const CAPACITY_RANGE = {
  MIN: 2,
  MAX: 20,
};
