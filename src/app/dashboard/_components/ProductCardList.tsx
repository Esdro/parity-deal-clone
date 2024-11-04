import {ProductTable} from "@/drizzle/schema";
import React from "react";
import {ProductCard} from "@/app/dashboard/_components/ProductCard";

type ProductGridListProps = {
    products: typeof ProductTable.$inferInsert[];
};

/**
 * Component that displays a grid of products; each product is displayed as a card
 * @param products
 * @constructor
 */
function ProductGridList({products}: ProductGridListProps) {
    return (
        <div className='grid grid-cols-1  rounded-2xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4'>
            {products.map((product: typeof ProductTable.$inferInsert) => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    );
}

export default ProductGridList;