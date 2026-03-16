"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const variants = {
  primary: "bg-accent-blue hover:bg-accent-blue/80 text-white",
  secondary: "bg-bg-card hover:bg-bg-card-hover text-text-primary border border-border",
  ghost: "bg-transparent hover:bg-bg-card text-text-secondary hover:text-text-primary",
  danger: "bg-accent-red/20 hover:bg-accent-red/30 text-accent-red border border-accent-red/30",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue/50 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
