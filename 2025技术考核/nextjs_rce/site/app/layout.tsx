import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internal System Assessment",
  description: "Authorized personnel only.",
};

// 必须改成 default export + 函数名必须叫 RootLayout（或者随便叫但 default 导出）
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
