export type Building = 'A' | 'B' | 'C' | 'V';

export type Equipment = 'Projector' | 'Whiteboard' | 'High-spec PC' | 'AC';

export interface Room {
  id: string;
  name: string;
  code: string; // e.g. A.101, B.204, V.302
  building: Building;
  floor: number;
  capacity: number; // 2 - 20 students
  equipment: Equipment[];
  imageUrl: string;
  description: string;
  type: 'Lab' | 'Study' | 'Group' | 'Conference';
}

export interface TimeSlot {
  id: string; // e.g. 'slot-1'
  startTime: string; // '07:30'
  endTime: string; // '09:30'
  label: string; // '07:30 - 09:30'
  period: 'morning' | 'afternoon';
}

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string; // Unique Booking ID: e.g. 'VKU-BK-8F39A1'
  roomId: string;
  roomName: string;
  roomCode: string;
  building: Building;
  floor: number;
  date: string; // YYYY-MM-DD
  slotId: string;
  slotLabel: string;
  startTime: string;
  endTime: string;
  userId: string;
  userName: string;
  userEmail: string;
  studentId: string;
  createdAt: string; // ISO date string
  status: BookingStatus;
  notificationId?: string;
  qrToken: string;
  notes?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  avatarUrl?: string;
}

export interface FilterState {
  searchQuery: string;
  building: Building | 'ALL';
  minCapacity: number;
  maxCapacity: number;
  equipment: Equipment[];
}
