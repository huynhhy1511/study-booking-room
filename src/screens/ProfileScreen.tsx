import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useBookingStore } from '../store/useBookingStore';
import { DesktopHeader } from '../components/DesktopHeader';
import { DEFAULT_USER } from '../constants';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const user = useBookingStore((state) => state.user);
  const setUser = useBookingStore((state) => state.setUser);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editStudentId, setEditStudentId] = useState(user.studentId);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editDepartment, setEditDepartment] = useState(user.department);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl || AVATAR_OPTIONS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Khi modal mở, đồng bộ lại dữ liệu mới nhất của user
  useEffect(() => {
    if (isEditModalOpen) {
      setEditName(user.name);
      setEditStudentId(user.studentId);
      setEditEmail(user.email);
      setEditDepartment(user.department);
      setSelectedAvatar(user.avatarUrl || AVATAR_OPTIONS[0]);
    }
  }, [isEditModalOpen, user]);

  const handleOpenEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Họ và tên sinh viên.');
      return;
    }
    if (!editStudentId.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Mã số sinh viên (MSSV).');
      return;
    }

    setUser({
      name: editName.trim(),
      studentId: editStudentId.trim().toUpperCase(),
      email: editEmail.trim(),
      department: editDepartment.trim(),
      avatarUrl: selectedAvatar,
    });

    setIsEditModalOpen(false);
    setToastMessage('Cập nhật hồ sơ sinh viên thành công!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetDefault = () => {
    setEditName(DEFAULT_USER.name);
    setEditStudentId(DEFAULT_USER.studentId);
    setEditEmail(DEFAULT_USER.email);
    setEditDepartment(DEFAULT_USER.department);
    setSelectedAvatar(DEFAULT_USER.avatarUrl);
  };

  const handleNotifications = () => {
    navigation.navigate('NotificationsTab');
  };

  const handleBookingHistory = () => {
    navigation.navigate('BookingsTab');
  };

  const handleHelp = () => {
    Alert.alert(
      'Quy định phòng tự học VKU',
      '• Xuất trình mã QR Pass tại cửa phòng học.\n• Giữ gìn trật tự và vệ sinh chung.\n• Tắt điều hòa, đèn và thiết bị điện trước khi rời phòng.'
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Về ứng dụng VKU Study Room',
      'VKU Study Room Booking v1.0.0\nĐồ án môn Lập trình Đa nền tảng - Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU).'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            setToastMessage('Đã đăng xuất phiên làm việc.');
            setTimeout(() => setToastMessage(null), 3000);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isDesktop && <DesktopHeader />}

      {/* Toast Banner Feedback */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
          <Text style={styles.toastText}>{toastMessage}</Text>
          <TouchableOpacity onPress={() => setToastMessage(null)}>
            <Ionicons name="close" size={18} color="#166534" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={isDesktop ? styles.desktopWrapper : styles.mobileWrapper}>
          {/* Screen Title */}
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>Profile</Text>
            <Text style={styles.screenSubtitle}>Thông tin cá nhân & Tài khoản sinh viên VKU</Text>
          </View>

          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarWrapper}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={36} color={colors.primary} />
                </View>
              )}
              <TouchableOpacity
                style={styles.avatarEditBadge}
                onPress={handleOpenEdit}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.idChip}>
              <Ionicons name="id-card-outline" size={14} color={colors.primary} />
              <Text style={styles.idChipText}>{user.studentId}</Text>
              <Text style={styles.idChipDot}>•</Text>
              <Text style={styles.idChipRole}>VKU Student</Text>
            </View>

            <Text style={styles.departmentText}>{user.department}</Text>
            <Text style={styles.emailText}>{user.email}</Text>

            {/* Edit Profile Action Button */}
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={handleOpenEdit}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.editProfileBtnText}>Chỉnh sửa thông tin cá nhân</Text>
            </TouchableOpacity>
          </View>

          {/* Student Status Badge */}
          <View style={styles.statusCard}>
            <View style={styles.statusCardRow}>
              <View style={styles.statusIndicatorGreen} />
              <View style={{ flex: 1 }}>
                <Text style={styles.statusCardTitle}>Tài khoản sinh viên chính quy</Text>
                <Text style={styles.statusCardSub}>Đủ điều kiện đặt phòng tự học miễn phí tại tòa A, B, C, V</Text>
              </View>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={handleOpenEdit}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Thông tin cá nhân & MSSV</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={handleNotifications}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Thông báo & Lời nhắc</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={handleBookingHistory}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Lịch sử & Vé QR đặt phòng</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={handleHelp}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Quy định phòng học & Hỗ trợ</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={handleAbout}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Về ứng dụng VKU Study Room</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutBtnText}>Đăng xuất phiên làm việc</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal (Cross-platform) */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.editModalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Chỉnh sửa thông tin cá nhân</Text>
                <Text style={styles.modalSubtitle}>Cập nhật thông tin sinh viên hiển thị trong app</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalFormScroll}>
              {/* Choose Avatar */}
              <Text style={styles.inputLabel}>Chọn ảnh đại diện:</Text>
              <View style={styles.avatarRow}>
                {AVATAR_OPTIONS.map((uri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedAvatar(uri)}
                    style={[
                      styles.avatarPickCircle,
                      selectedAvatar === uri && styles.avatarPickSelected,
                    ]}
                  >
                    <Image source={{ uri }} style={styles.avatarOptionImg} />
                    {selectedAvatar === uri && (
                      <View style={styles.avatarCheckBadge}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Input: Họ và tên */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Họ và tên <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Ví dụ: Huỳnh Huy"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              {/* Input: Mã số sinh viên */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Mã số sinh viên (MSSV) <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputBox}>
                  <Ionicons name="id-card-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={editStudentId}
                    onChangeText={setEditStudentId}
                    placeholder="Ví dụ: 21IT123"
                    autoCapitalize="characters"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              {/* Input: Email VKU */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Email sinh viên</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Ví dụ: huyh.21it@vku.udn.vn"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              {/* Input: Khoa / Ngành */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Khoa / Ngành đào tạo</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="school-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={editDepartment}
                    onChangeText={setEditDepartment}
                    placeholder="Ví dụ: Khoa Công Nghệ Thông Tin & Truyền Thông"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              {/* Helper Notice */}
              <View style={styles.helperNotice}>
                <Ionicons name="information-circle-outline" size={16} color="#3B82F6" />
                <Text style={styles.helperNoticeText}>
                  Tên và MSSV này sẽ tự động hiển thị trên thanh điều hướng, màn hình trang chủ và vé QR check-in khi bạn đặt phòng.
                </Text>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleResetDefault}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.resetBtnText}>Mặc định</Text>
              </TouchableOpacity>

              <View style={styles.modalFooterRight}>
                <TouchableOpacity
                  style={styles.cancelModalBtn}
                  onPress={() => setIsEditModalOpen(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelModalBtnText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveModalBtn}
                  onPress={handleSaveProfile}
                  activeOpacity={0.88}
                >
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={styles.saveModalBtnText}>Lưu thay đổi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollBody: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + 40,
  },
  mobileWrapper: {
    width: '100%',
  },
  desktopWrapper: {
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
    paddingTop: spacing.md,
  },
  titleRow: {
    marginBottom: spacing.md,
  },
  screenTitle: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  screenSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // User Card
  userCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#DBEAFE',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    marginBottom: 6,
  },
  idChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  idChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  idChipDot: {
    fontSize: 12,
    color: '#93C5FD',
  },
  idChipRole: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  departmentText: {
    fontSize: typography.sizes.bodySm,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  emailText: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  editProfileBtn: {
    height: 44,
    borderRadius: borderRadius.button,
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
    width: '100%',
    ...shadows.subtle,
  },
  editProfileBtnText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },

  // Status Card
  statusCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: borderRadius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: spacing.lg,
  },
  statusCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicatorGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  statusCardSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },

  // Menu Items
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: spacing.md,
  },
  logoutBtn: {
    minHeight: 50,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },

  // Toast Notification
  toastBanner: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.modal,
    zIndex: 9999,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
    flex: 1,
    marginLeft: 8,
  },

  // Edit Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  editModalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.navy,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalFormScroll: {
    maxHeight: 440,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
    marginTop: 6,
  },
  avatarPickCircle: {
    position: 'relative',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarPickSelected: {
    borderColor: colors.primary,
  },
  avatarOptionImg: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  avatarCheckBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 6,
  },
  requiredStar: {
    color: colors.danger,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  helperNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  helperNoticeText: {
    fontSize: 11,
    color: '#1D4ED8',
    flex: 1,
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 8,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  resetBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelModalBtn: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveModalBtn: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...shadows.subtle,
  },
  saveModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
