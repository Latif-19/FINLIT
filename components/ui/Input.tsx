import React from"react";
import { View, Text, TextInput, TextInputProps } from"react-native";
import { useThemeColors } from"@/hooks/useThemeColors";

export interface InputProps extends TextInputProps {
 label?: string;
 error?: string;
 helperText?: string;
 icon?: React.ReactNode;
}

export function Input({
 label,
 error,
 helperText,
 icon,
 className ="",
 placeholderTextColor,
 ...props
}: InputProps) {
 const colors = useThemeColors();

 return (
 <View className="w-full mb-4">
 {label && (
 <Text className="text-brand-gray text-xs font-inter-semibold uppercase tracking-wider mb-2 ml-1">
 {label}
 </Text>
 )}
 <View
 className={`flex-row items-center bg-brand-slateBg border ${
 error ?"border-red-500":"border-brand-border focus:border-brand-emerald"
 } rounded-2xl px-4 py-3.5 shadow-sm`}
 >
 {icon && <View className="mr-3">{icon}</View>}
 <TextInput
 className={`flex-1 text-brand-textPrimary text-base font-inter-semibold ${className}`}
 placeholderTextColor={placeholderTextColor || colors.gray}
 {...props}
 />
 </View>
 {error ? (
 <Text className="text-red-500 text-xs font-inter mt-1.5 ml-1">{error}</Text>
 ) : helperText ? (
 <Text className="text-brand-gray text-xs font-inter mt-1.5 ml-1">{helperText}</Text>
 ) : null}
 </View>
 );
}
