import React from"react";
import { View, Text, Pressable, ViewStyle, StyleProp } from"react-native";
import { Ionicons } from"@expo/vector-icons";
import { useThemeColors } from"@/hooks/useThemeColors";

export interface ListItemProps {
 title: string;
 subtitle?: string;
 onPress?: () => void;
 rightElement?: React.ReactNode;
 showChevron?: boolean;
 isLast?: boolean;
 style?: StyleProp<ViewStyle>;
}

export function ListItem({
 title,
 subtitle,
 onPress,
 rightElement,
 showChevron = true,
 isLast = false,
 style,
}: ListItemProps) {
 const colors = useThemeColors();

 return (
 <Pressable
 onPress={onPress}
 disabled={!onPress}
 style={({ pressed }) => [
 style,
 {
 opacity: pressed && onPress ? 0.8 : 1,
 },
 ]}
 className={`p-4 flex-row items-center justify-between ${
 !isLast ?"border-b border-brand-border/60":""
 }`}
 >
 <View className="flex-1 pr-3">
 <Text className="text-brand-textPrimary text-sm font-inter-semibold">
 {title}
 </Text>
 {subtitle && (
 <Text className="text-brand-gray text-xs font-inter mt-0.5">
 {subtitle}
 </Text>
 )}
 </View>

 <View className="flex-row items-center gap-2">
 {rightElement}
 {showChevron && onPress && (
 <Ionicons name="chevron-forward"size={16} color={colors.gray} />
 )}
 </View>
 </Pressable>
 );
}
