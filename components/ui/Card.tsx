import React from"react";
import { Pressable, StyleProp, View, ViewStyle } from"react-native";

export interface CardProps {
 children: React.ReactNode;
 onPress?: () => void;
 variant?:"default"|"elevated"|"flat"|"accent";
 className?: string;
 style?: StyleProp<ViewStyle>;
}

export function Card({
 children,
 onPress,
 variant ="default",
 className ="",
 style,
}: CardProps) {
 const getVariantStyle = () => {
 switch (variant) {
 case"elevated":
 return"bg-brand-bg rounded-[34px] border border-white/70 p-6 shadow-2xl shadow-black/10 overflow-hidden";
 case"flat":
 return"bg-brand-slateBg rounded-[28px] border border-brand-border/60 p-4";
 case"accent":
 return"bg-brand-navy rounded-[34px] p-6 shadow-2xl shadow-brand-navy/20 overflow-hidden";
 case"default":
 default:
 return"bg-brand-bg rounded-[34px] border border-white/70 p-5 shadow-xl shadow-black/8 overflow-hidden";
 }
 };

 if (onPress) {
 return (
 <Pressable
 onPress={onPress}
 style={({ pressed }) => [
 style,
 {
 opacity: pressed ? 0.92 : 1,
 transform: [{ scale: pressed ? 0.99 : 1 }],
 },
 ]}
 className={`${getVariantStyle()} ${className}`}
 >
 {children}
 </Pressable>
 );
 }

 return <View style={style} className={`${getVariantStyle()} ${className}`}>{children}</View>;
}
