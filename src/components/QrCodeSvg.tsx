"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export default function QrCodeSvg({
  value,
  size = 96,
  className = "",
  darkColor = "#0A0D14",
  lightColor = "#FFFFFF",
}: QrCodeSvgProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>("");

  useEffect(() => {
    let active = true;
    QRCode.toString(value, {
      type: "svg",
      margin: 1,
      width: size,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: "M",
    })
      .then((svg) => {
        if (active) setSvgMarkup(svg);
      })
      .catch(() => {
        if (active) setSvgMarkup("");
      });
    return () => {
      active = false;
    };
  }, [value, size, darkColor, lightColor]);

  if (!svgMarkup) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-white/90 animate-pulse rounded-sm ${className}`}
        aria-label="Generating QR code"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`[&>svg]:w-full [&>svg]:h-full [&>svg]:block ${className}`}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
