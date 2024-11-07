import Link from "next/link";
import React from "react";

type FooterLinkGroupProps = {
    label: string;
    links: { label: string; href: string }[];
};

export function FooterLinkGroup({ label, links }: FooterLinkGroupProps) {
    return (
        <div className="flex flex-col gap-4 ">
            <h3 className="text-xl font-bold"> {label} </h3>
            <ul className="flex flex-col gap-2 text-md">
                {links.map(({ label, href }) => (
                    <Link key={label} href={href}> {label} </Link>
                ))}
            </ul>
        </div>
    );
}