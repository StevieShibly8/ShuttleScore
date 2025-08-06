import React from "react";
import { Text, TextProps, View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "success" | "primary";
  children: React.ReactNode;
}

interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
}

interface CardTitleProps extends TextProps {
  children: React.ReactNode;
}

interface CardContentProps extends ViewProps {
  children: React.ReactNode;
}

interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-app-card border-app-card-border",
    success: "bg-app-success-card border-app-success-border",
    primary: "bg-app-primary-card border-app-primary-border",
  };

  return (
    <View
      className={`p-5 rounded-xl-plus border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: CardHeaderProps) {
  return (
    <View className={`mb-3 ${className}`} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: CardTitleProps) {
  return (
    <Text
      className={`text-white text-lg font-bold mb-1 ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: CardContentProps) {
  return (
    <View className={`mb-3 ${className}`} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: CardFooterProps) {
  return (
    <View
      className={`flex-row items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
