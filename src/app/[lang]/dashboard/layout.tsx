import React, { ReactNode } from "react";
import DashboardNavBar from "./_components/NavBar";

type DashboardLayoutProps = {
  children: ReactNode;
  params:  Promise< {lang: "fr" | "en"} > 
};
async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  
  const {lang} = await params;

  
  return (
    <div className="bg-accent/5 min-h-screen">
      <DashboardNavBar lang={lang} />
      <div className="container py-6">{children}</div>
    </div>
  );
}

export default DashboardLayout;
