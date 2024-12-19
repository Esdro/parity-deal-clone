import React, { ReactNode } from "react";
import NavBar from "./_components/NavBar";

type Props = {
  children: ReactNode;
  params: Promise<{
    lang: "fr" | "en" | "es";
  }>;
};
async function MarketingLayout({ children, params }: Props) {

  const { lang } = await params;


  return <div className="selection:bg-[hsl(320,65%,52%,20%)]">
    <NavBar lang={lang}/>
    {children}
    </div>;
}

export default MarketingLayout;
