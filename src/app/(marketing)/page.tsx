import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { NeonIcon } from "./_icons/Neon";
import { ClerkIcon } from "./_icons/Clerk";
import { subscriptionTiersInOrder } from "@/data/subscriptionTiers";
import BrandLogo from "@/components/BrandLogo";
import {PricingCards} from "@/components/PricingCards";
import {FooterLinkGroup} from "@/components/FooterLinkGroup";

function Home() {
  return (
    <>
      <section className="min-h-screen bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4">
        <h1 className="text-6xl lg:text-7xl xl:text-8xl tracking-tighter m-4 font-bold ">
          {" "}
          Price Smarter, Sell Bigger!{" "}
        </h1>
        <p className="text-lg lg:text-3xl max-w-screen-xl ">
          {" "}
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed soluta
          autem dolorum labore facere quasi ipsa magni delectus? Magni ab
          pariatur placeat quod exercitationem reiciendis?{" "}
        </p>

        <SignUpButton>
          <Button className="text-lg p-6 rounded-xl flex gap-2">
            Get Started for free <ArrowRightIcon className="size-5" />
          </Button>
        </SignUpButton>

        {/* <ClientActionButton text="Rechercher le tweet" action={InvokeTwitter} /> */}
      </section>

      <section className="bg-primary text-primary-foreground ">
        <div className="container py-16 flex flex-col ">
          <h2 className="text-3xl text-balance text-center ">
            {" "}
            Trusted by the top modern companies{" "}
          </h2>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-16 ">
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.com"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.com"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.com"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link href={"https://clerk.com"}>
              <ClerkIcon />
            </Link>
            <Link href={"https://neon.tech"}>
              <NeonIcon />
            </Link>
            <Link className="md:max-xl:hidden" href={"https://clerk.com"}>
              <ClerkIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-accent/5" id="pricing">
        <h2 className="text-4xl text-center text-balance font-semibold mb-8 ">
          Pricing software which pays for itself 20x over
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 max-w-screen-xl mx-auto gap-4 ">
          {subscriptionTiersInOrder.map((tier) => (
            <PricingCards key={tier.name} {...tier} />
          ))}
        </div>
      </section>

      <footer className="flex flex-col sm:flex-row container pt-16 pb-8 sm:gap-4 gap-8 justify-between items-start  ">
        <Link href={"/"}>
          <BrandLogo />
        </Link>

        <div className="flex flex-col items-center  sm:flex-row gap-8  ">
          <FooterLinkGroup
            label="Product"
            links={[
              { label: "Features", href: "/features" },
              { label: "Integrations", href: "/integrations" },
              { label: "Pricing", href: "/pricing" },
              { label: "FAQ", href: "/faq" },
            ]}
          />
          <FooterLinkGroup
            label="Api & Docs"
            links={[
              { label: "Features", href: "/features" },
              { label: "Integrations", href: "/integrations" },
              { label: "Pricing", href: "/pricing" },
              { label: "FAQ", href: "/faq" },
            ]}
          />
          <FooterLinkGroup
            label="Ressources"
            links={[
              { label: "Features", href: "/features" },
              { label: "Integrations", href: "/integrations" },
              { label: "Pricing", href: "/pricing" },
              { label: "FAQ", href: "/faq" },
            ]}
          />
          <FooterLinkGroup
            label="Contact"
            links={[
              { label: "Features", href: "/features" },
              { label: "Integrations", href: "/integrations" },
              { label: "Pricing", href: "/pricing" },
              { label: "FAQ", href: "/faq" },
            ]}
          />
        </div>
      </footer>
    </>
  );
}



export default Home;
