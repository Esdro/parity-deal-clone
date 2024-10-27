import React, { ReactNode } from "react";
import NavBar from "./_components/NavBar";

type Props = {
  children: ReactNode;
};
function MarketingLayout({ children }: Props) {
  return <div className="selection:bg-[hsl(320,65%,52%,20%)]">
    <NavBar/>
    {children}
    </div>;
}

export default MarketingLayout;
