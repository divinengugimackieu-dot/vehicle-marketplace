import { Outlet } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
