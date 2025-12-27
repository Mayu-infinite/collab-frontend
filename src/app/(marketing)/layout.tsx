// app/(marketing)/layout.tsx
import { Navbar } from "@/components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar /> {/* Navbar only appears here! */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
