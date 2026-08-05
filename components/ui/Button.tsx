import React from"react";
import { Pressable, Text, ActivityIndicator, ViewStyle, StyleProp } from"react-native";
import { useThemeColors } from"@/hooks/useThemeColors";

export interface ButtonProps {
 label: string;
 onPress: () => void;
 variant?:"primary"|"secondary"|"outline"|"text"|"accent";
 size?:"sm"|"md"|"lg";
 disabled?: boolean;
 loading?: boolean;
 fullWidth?: boolean;
 style?: StyleProp<ViewStyle>;
 icon?: React.ReactNode;
}

export function Button({
 label,
 onPress,
 variant ="primary",
 size ="md",
 disabled = false,
 loading = false,
 fullWidth = true,
 style,
 icon,
}: ButtonProps) {
 const colors = useThemeColors();

 const getContainerStyle = () => {
 switch (variant) {
 case"secondary":
 return"bg-brand-bg border border-brand-border text-brand-textPrimary";
 case"outline":
 return"bg-transparent border border-brand-emerald text-brand-emerald";
 case"accent":
 return"bg-brand-gold text-brand-textPrimary";
 case"text":
 return"bg-transparent text-brand-textPrimary";
 case"primary":
 default:
 return"bg-brand-navy text-brand-textOnDark shadow-sm shadow-brand-navy/20";
 }
 };

 const getSizeStyle = () => {
 switch (size) {
 case"sm":
 return"py-2.5 px-4 rounded-xl";
 case"lg":
 return"py-4 px-6 rounded-2xl";
 case"md":
 default:
 return"py-3.5 px-5 rounded-2xl";
 }
 };

 const getTextStyle = () => {
 switch (variant) {
 case"secondary":
 return"text-brand-textPrimary font-inter-bold";
 case"outline":
 return"text-brand-emerald font-inter-bold";
 case"accent":
 return"text-brand-navy font-inter-bold";
 case"text":
 return"text-brand-textPrimary font-inter-semibold";
 case"primary":
 default:
 return"text-brand-textOnDark font-inter-bold";
 }
 };

 return (
 <Pressable
 onPress={onPress}
 disabled={disabled || loading}
 style={({ pressed }) => [
 style,
 {
 opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
 transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
 },
 ]}
 className={`${fullWidth ?"w-full":"self-start"} ${getContainerStyle()} ${getSizeStyle()} flex-row items-center justify-center gap-2`}
 >
 {loading ? (
 <ActivityIndicator color={variant === "primary" ? colors.bg : colors.emerald} size="small"/>
 ) : (
 <>
 {icon}
 <Text className={`text-sm tracking-wide ${getTextStyle()}`}>{label}</Text>
 </>
 )}
 </Pressable>
 );
}
