"use client";

import { Line } from "@react-three/drei";

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  opacity?: number;
}

export default function Bond({
  start,
  end,
  color = "#ffffff",
  opacity = 0.2,
}: BondProps) {
  return (
    <Line
      points={[start, end]}
      color={color}
      transparent
      opacity={opacity}
      lineWidth={1}
    />
  );
}
