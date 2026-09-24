import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Building, FilterState } from '../types';
import { BUILDINGS } from '../constants';
import { colors, borderRadius, typography, spacing } from '../theme';

interface FilterSectionProps {
  filters: FilterState;
  onSearchChange: (text: string) => void;
  onBuildingSelect: (building: Building | 'ALL') => void;
  onOpenFilterSheet: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onSearchChange,
  onBuildingSelect,
  onOpenFilterSheet,
}) => {
  const activeCustomFiltersCount =
    (filters.minCapacity !== 2 || filters.maxCapacity !== 20 ? 1 : 0) +
    filters.equipment.length;

  return (
    <View style={styles.container}>
      {/* 1. Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search room..."
          placeholderTextColor={colors.textMuted}
          value={filters.searchQuery}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
        {filters.searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Building Chip Row + Filters Modal Button */}
      <View style={styles.buildingHeaderRow}>
        <Text style={styles.sectionLabel}>Building</Text>
        <TouchableOpacity
          style={[
            styles.filterSheetBtn,
            activeCustomFiltersCount > 0 && styles.filterSheetBtnActive,
          ]}
          onPress={onOpenFilterSheet}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={activeCustomFiltersCount > 0 ? colors.textWhite : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterSheetBtnText,
              activeCustomFiltersCount > 0 && styles.filterSheetBtnTextActive,
            ]}
          >
            Filters {activeCustomFiltersCount > 0 ? `(${activeCustomFiltersCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalChips}
      >
        {BUILDINGS.map((b) => {
          const isSelected = filters.building === b.id;
          return (
            <TouchableOpacity
              key={b.id}
              activeOpacity={0.7}
              onPress={() => onBuildingSelect(b.id)}
              style={[
                styles.chip,
                isSelected && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextActive,
                ]}
              >
                {b.id === 'ALL' ? 'All' : b.id}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.input,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    height: 48, // 48px minimum touch target
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.sm,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  buildingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  filterSheetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.chip,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 34,
  },
  filterSheetBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterSheetBtnText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
  },
  filterSheetBtnTextActive: {
    color: colors.textWhite,
  },
  horizontalChips: {
    paddingHorizontal: spacing.lg,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    minWidth: 54,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: borderRadius.chip,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textWhite,
    fontWeight: typography.weights.bold,
  },
});
