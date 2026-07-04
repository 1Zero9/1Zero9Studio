import { ImageResponse } from "next/og";
import { LogoOgMark } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          borderRadius: 12,
        }}
      >
        <LogoOgMark width={52} height={33} color="#f5f5f2" />
      </div>
    ),
    size,
  );
}
