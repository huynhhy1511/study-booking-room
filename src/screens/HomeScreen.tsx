import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { Room } from '../types';
import { RoomCard } from '../components/RoomCard';
import { BrandLogo } from '../components/BrandLogo';
import { FilterBottomSheet } from '../components/FilterBottomSheet';
import { EmptyState } from '../components/EmptyState';
import { getRoomRealtimeStatus } from '../utils/conflict';
import { BUILDINGS } from '../constants';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const rooms = useBookingStore((state) => state.rooms);
  const reservations = useBookingStore((state) => state.reservations);
  const user = useBookingStore((state) => state.user);

  const filters = useBookingStore((state) => state.filters);
  const setSearchQuery = useBookingStore((state) => state.setSearchQuery);
  const setBuildingFilter = useBookingStore((state) => state.setBuildingFilter);
  const setCapacityFilter = useBookingStore((state) => state.setCapacityFilter);
  const resetFilters = useBookingStore((state) => state.resetFilters);

  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [showId, setShowId] = useState(true);

  // Lọc phòng theo đa tiêu chí sử dụng useMemo đạt chuẩn hiệu năng cao
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Tìm kiếm theo tên hoặc mã phòng
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchName = room.name.toLowerCase().includes(query);
        const matchCode = room.code.toLowerCase().includes(query);
        if (!matchName && !matchCode) return false;
      }

      // 2. Lọc theo tòa nhà
      if (filters.building !== 'ALL' && room.building !== filters.building) {
        return false;
      }

      // 3. Lọc theo sức chứa
      if (room.capacity < filters.minCapacity || room.capacity > filters.maxCapacity) {
        return false;
      }

      // 4. Lọc theo tiện nghi
      if (filters.equipment.length > 0) {
        const hasAll = filters.equipment.every((eq) =>
          room.equipment.includes(eq)
        );
        if (!hasAll) return false;
      }

      return true;
    });
  }, [rooms, filters]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('RoomDetail', { roomId: room.id });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Room }) => {
      const { status } = getRoomRealtimeStatus(reservations, item.id);
      return (
        <RoomCard
          room={item}
          status={status}
          onPress={handleRoomPress}
        />
      );
    },
    [reservations, handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  // Header của màn hình theo chuẩn 100% Screen 2 trong ảnh mockup
  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        {/* Top Bar: Title & User ID + Mascot Logo */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appTitle}>VKU Study Room</Text>
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => setShowId(!showId)}
              activeOpacity={0.7}
            >
              <Text style={styles.userSubtitle}>
                Hi, {user.name ? user.name.split(' ').slice(-1)[0] : 'Daffa'}! - {showId ? user.studentId : '••••••••'}
              </Text>
              <Ionicons
                name={showId ? 'eye-outline' : 'eye-off-outline'}
                size={14}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <BrandLogo size={42} />
        </View>

        {/* Search Bar + Dark Navy Filter Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="cth: Study Room A2, B201..."
              placeholderTextColor={colors.textMuted}
              value={filters.searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {filters.searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Dark Navy Filter Button */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setIsFilterSheetVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="options-outline" size={18} color={colors.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Building Filter Horizontal Chips */}
        <View style={styles.buildingRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buildingChipsContainer}
          >
            {BUILDINGS.map((b) => {
              const isSelected = filters.building === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.buildingChip,
                    isSelected && styles.buildingChipActive,
                  ]}
                  onPress={() => setBuildingFilter(b.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buildingChipText,
                      isSelected && styles.buildingChipTextActive,
                    ]}
                  >
                    {b.id === 'ALL' ? 'All' : `Building ${b.id}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section Header: Room List --- See all */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Room List</Text>
          <TouchableOpacity onPress={() => setBuildingFilter('ALL')} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See all ({filteredRooms.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [user.name, user.studentId, showId, filters.searchQuery, filters.building, filteredRooms.length, setSearchQuery, setBuildingFilter]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <FlatList
        data={filteredRooms}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No matching rooms found"
            description="Try adjusting your search keyword or clearing the filters."
            actionText="Reset filters"
            onAction={resetFilters}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Tối ưu FlatList 60fps
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* Professional Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={isFilterSheetVisible}
        filters={filters}
        onClose={() => setIsFilterSheetVisible(false)}
        onApply={(updated) => {
          if (updated.building) setBuildingFilter(updated.building);
          if (updated.minCapacity !== undefined && updated.maxCapacity !== undefined) {
            setCapacityFilter(updated.minCapacity, updated.maxCapacity);
          }
          if (updated.equipment) {
            useBookingStore.setState((state) => ({
              filters: { ...state.filters, equipment: updated.equipment! },
            }));
          }
        }}
        onReset={resetFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appTitle: {
    fontSize: typography.sizes.screenTitle,
    fontWeight: typography.weights.extraBold,
    color: colors.navy,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  userSubtitle: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.chip,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.sm,
    fontSize: typography.sizes.bodySm,
    color: colors.navy,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  buildingRow: {
    marginBottom: spacing.md,
  },
  buildingChipsContainer: {
    gap: 8,
    paddingVertical: 2,
  },
  buildingChip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: borderRadius.chip,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  buildingChipText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
  },
  buildingChipTextActive: {
    color: colors.textWhite,
    fontWeight: typography.weights.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  seeAllText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
  },
});
