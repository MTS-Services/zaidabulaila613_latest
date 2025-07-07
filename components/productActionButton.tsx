import { config } from "@/constants/app";
import { useTranslation } from "@/hooks/use-translation";
import { ShoppingBag } from "lucide-react";
import React from "react";

interface ProductActionButtonProps {
    user: any;
    product: any;
    cartItem: any;
    addToCart: (product: any) => void;
    className?: string;
}

const ProductActionButton: React.FC<ProductActionButtonProps> = ({
    user,
    product,
    cartItem,
    addToCart,
    className = "",
}) => {
    // User is viewing their own product - don't show any button
    if (user && user?.user?.id === product.user?.id) {
        return null;
    }

    const handleClick = (phone: string, productName: string) => {
        // const phoneNumber = '923001234567'; // Replace with your number (e.g., 92 for Pakistan)
        const phoneNumber = `${phone}`; // Replace with your number (e.g., 92 for Pakistan)
        const message = `Hello, I am looking for this product ${productName}`;
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, '_blank'); // Opens WhatsApp in new tab
    };

    // Handle add to cart function
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            id: product.id,
            name: product.name,
            price: Number.parseFloat(product.price),
            originalPrice: product.oldPrice ? Number.parseFloat(product.oldPrice) : undefined,
            quantity: 1,
            images: [product.pictures[0]?.path ? `${config.API_URL}${product.pictures[0].path}` : "/placeholder.svg"],
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
            type: product.type,
            // vendor: {
            //     name: product.vendorShopName,
            //     slug: product.vendorShopName.toLowerCase().replace(/\s+/g, "-"),
            // },
            vendor: {
                name: '',
                slug: '',
            },
        });
    };
const {t} = useTranslation();

    // Product is for sale
    if (product.type !== "rental") {
        return (
            <button
                className={`cart-button noselect w-full mt-3 ${className} disabled:bg-gold-light`}
                disabled={!!cartItem}
                onClick={handleAddToCart}
            >
                <span className="text">{cartItem ? t('productpageid.added') : t('productpageid.addtocart')}</span>
                {
                    !cartItem ?
                        <span className="icon">
                            <ShoppingBag className="h-5 w-5" />
                        </span>
                        :
                        <span className="icon">
                            <ShoppingBag className="h-5 w-5" />
                        </span>
                }
            </button>
        );
    }

    // Product is for rental/contact
    return (
        <button className={`cart-button noselect w-full mt-3 ${className}`} onClick={() => handleClick(product?.user?.account?.mobile, product?.name)}>
            <span className="text">
                {/* {product.type === "rental" ? "Rent Now" : "Contact Seller"} */}
                Contact Seller
            </span>
            <span className="icon">
                <ShoppingBag className="h-5 w-5" />
            </span>
        </button>
    );
};

export default ProductActionButton;