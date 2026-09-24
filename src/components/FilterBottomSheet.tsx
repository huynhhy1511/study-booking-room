import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Building, Equipment, FilterState } from '../types';
import { BUILDINGS, EQUIPMENT_LIST } from '../constants';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';

interface FilterBottomSheetProps {
  visible: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

const CAPACITY_OPTIONS = [
  { label: 'All capacities (2 - 20)', min: 2, max: 20 },
  { label: 'Small group (2 - 6 students)', min: 2, max: 6 },
  { label: 'Medium group (6 - 12 students)', min: 6, max: 12 },
  { label: 'Large group (12 - 20 students)', min: 12, max: 20 },
];

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | 'ALL'>(filters.building);
  const [minCap, setMinCap] = useState(filters.minCapacity);
  const [maxCap, setMaxCap] = useState(filters.maxCapacity);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(filters.equipment);

  useEffect(() => {
    if (visible) {
      setSelectedBuilding(filters.building);
      setMinCap(filters.minCapacity);
      setMaxCap(filters.maxCapacity);
      setSelectedEquipment(filters.equipment);
    }
  }, [visible, filters]);

  const toggleEquipment = (eq: Equipment) => {
    if (selectedEquipment.includes(eq)) {
      setSelectedEquipment(selectedEquipment.filter((item) => item !== eq));
    } else {
      setSelectedEquipment([...selectedEquipment, eq]);
    }
  };

  const handleApply = () => {
    onApply({
      building: selectedBuilding,
      minCapacity: minCap,
      maxCapacity: maxCap,
      equipment: selectedEquipment,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedBuilding('ALL');
    setMinCap(2);
    setMaxCap(20);
    setSelectedEquipment([]);
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.doneBtn}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
              >
                {/* 1. Building Radio/List */}
                <Text style={styles.sectionLabel}>Building</Text>
                <View style={styles.optionsList}>
                  {BUILDINGS.map((b) => {
                    const isSelected = selectedBuilding === b.id;
                    return (
                      <TouchableOpacity
                        key={b.id}
                        activeOpacity={0.7}
                        style={styles.radioRow}
                        onPress={() => setSelectedBuilding(b.id)}
                      >
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                        <Text
                          style={[
                            styles.radioLabel,
                            isSelected && styles.radioLabelActive,
                          ]}
                        >
                          {b.label} {b.id !== 'ALL' ? `(${b.name.split(' - ')[1] || ''})` : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* 2. Capacity Selector */}
                <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
                  Capacity
                </Text>
                <View style={styles.optionsList}>
                  {CAPACITY_OPTIONS.map((cap, idx) => {
                    const isSelected = minCap === cap.min && maxCap === cap.max;
                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.7}
                        style={styles.radioRow}
                        onPress={() => {
                          setMinCap(cap.min);
                          setMaxCap(cap.max);
                        }}
                      >
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                        <Text
                          style={[
                            styles.radioLabel,
                            isSelected && styles.radioLabelActive,
                          ]}
                        >
                          {cap.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* 3. Equipment Checkboxes */}
                <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
                  Equipment
                </Text>
                <View style={styles.optionsList}>
                  {EQUIPMENT_LIST.map((eq) => {
                    const isChecked = selectedEquipment.includes(eq.id);
                    return (
                      <TouchableOpacity
                        key={eq.id}
                        activeOpacity={0.7}
                        style={styles.checkboxRow}
                        onPress={() => toggleEquipment(eq.id)}
                      >
                        <View
                          style={[
                            styles.checkboxBox,
                            isChecked && styles.checkboxBoxActive,
                          ]}
                        >
                          {isChecked && (
                            <Ionicons name="checkmark" size={16} color={colors.textWhite} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.checkboxLabel,
                            isChecked && styles.checkboxLabelActive,
                          ]}
                        >
                          {eq.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Bottom Actions */}
              <View style={styles.actionsBar}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={handleReset}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resetText}>Reset filters</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApply}
                  activeOpacity={0.85}
                >
                  <Text style={styles.applyText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.card,
    borderTopRightRadius: borderRadius.card,
    maxHeight: '85%',
    paddingBottom: spacing.lg,
    ...shadows.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.sizes.section,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  doneBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  doneText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  optionsList: {
    gap: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44, // Touch target
    gap: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  radioLabelActive: {
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44, // Touch target
    gap: 12,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  checkboxBoxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  checkboxLabelActive: {
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  resetText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
  },
  applyBtn: {
    flex: 1.5,
    minHeight: 48,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.textWhite,
  },
});
