import React, { ReactNode } from "react";
import DashboardNavBar from "./_components/NavBar";

type DashboardLayoutProps = {
  children: ReactNode;
};
function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-accent/5 min-h-screen">
      <DashboardNavBar />
      <div className="container py-6">{children}</div>
    </div>
  );
}

export default DashboardLayout;
