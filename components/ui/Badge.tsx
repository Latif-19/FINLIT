import React from"react";
import { View, Text } from"react-native";

export interface BadgeProps {
 label: string;
 variant?:"success"|"forest"|"accent"|"warning"|"error"|"gray";
 size?:"sm"|"md";
 icon?: React.ReactNode;
}

export function Badge({ label, variant ="forest", size ="md", icon }: BadgeProps) {
 const getVariantStyle = () => {
 switch (variant) {
 case"accent":
 return"bg-brand-gold/15 border border-brand-gold/30 text-[#052E1F]";
 case"success":
 return"bg-emerald-500/10 border border-emerald-500/20 text-emerald-600";
 case"warning":
 return"bg-amber-500/10 border border-amber-500/20 text-amber-600";
 case"error":
 return"bg-red-500/10 border border-red-500/20 text-red-600";
 case"gray":
 return"bg-brand-slateBg border border-brand-border text-brand-gray";
 case"forest":
 default:
 return"bg-brand-navy border border-brand-navy/30 text-brand-textOnDark";
 }
 };

 const getSizeStyle = () => {
 return size ==="sm"?"px-2.5 py-1 rounded-full text-[10px]":"px-3.5 py-1.5 rounded-full text-xs";
 };

 return (
 <View className={`flex-row items-center self-start ${getVariantStyle()} ${getSizeStyle()}`}>
 {icon && <View className="mr-1.5">{icon}</View>}
 <Text className={`font-inter-bold uppercase tracking-wider ${getVariantStyle().split("").pop()}`}>
 {label}
 </Text>
 </View>
 );
}
