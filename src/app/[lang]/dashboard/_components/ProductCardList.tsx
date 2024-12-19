
import {ProductTable} from "@/drizzle/schema";
import React from "react";
import {ProductCard} from "@/app/[lang]/dashboard/_components/ProductCard";

type ProductGridListProps = {
    products: typeof ProductTable.$inferInsert[];
    lang: "en" | "es" | "fr";
};

/**
 * Component that displays a grid of products; each product is displayed as a card
 * @param products
 * @param lang
 * @constructor
 */
function ProductGridList({products, lang}: ProductGridListProps) {
    

   // console.log(lang);
    
    
    return (
        <div className='grid grid-cols-1  rounded-2xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4'>
            {products.map((product: typeof ProductTable.$inferInsert) => (
                <ProductCard key={product.id} product={product} lang={lang}/>
            ))}
        </div>
    );
}

export default ProductGridList;