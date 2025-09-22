'use client';
import { config } from '@/constants/app';
import { useTranslation } from '@/hooks/use-translation';
import { useUserSubscription } from '@/hooks/useSubscription';
import { ShoppingBag } from 'lucide-react';
import React from 'react';
import TooltipBox from './tooltipBox';
import { useRouter } from 'next/navigation';

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
  className = '',
}) => {
  const router = useRouter();
  // User is viewing their own product - don't show any button
  if (user && user?.user?.id === product.user?.id) {
    return null;
  }
  const { canContactSeller } = useUserSubscription();

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
      originalPrice: product.oldPrice
        ? Number.parseFloat(product.oldPrice)
        : undefined,
      quantity: 1,
      images: [
        product.pictures[0]?.path
          ? `${config.API_URL}${product.pictures[0].path}`
          : '/placeholder.svg',
      ],
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
  const { t } = useTranslation();

  // Product is for sale
  //   if (product.type === 'new') {
  //     return (
  //       <button
  //         className={`cart-button noselect w-full mt-3 ${className} disabled:bg-gold-light`}
  //         disabled={!!cartItem}
  //         onClick={handleAddToCart}
  //       >
  //         <span className='text'>
  //           {cartItem ? t('productpageid.added') : t('productpageid.addtocart')}
  //         </span>
  //         {!cartItem ? (
  //           <span className='icon'>
  //             <ShoppingBag className='h-5 w-5' />
  //           </span>
  //         ) : (
  //           <span className='icon'>
  //             <ShoppingBag className='h-5 w-5' />
  //           </span>
  //         )}
  //       </button>
  //     );
  //   }

  // Product is for sale 9-22-2025
  if (product.type === 'new') {
    return cartItem ? (
      // If item is in cart, show ONLY the icon button
      <button
        className={`cart-button noselect w-full mt-3 flex justify-center items-center ${className}`}
        onClick={() => router.push('/cart')}
      >
        <ShoppingBag className='h-5 w-5' />
      </button>
    ) : (
      // If item is not in cart, show "Add to Cart" button with text and icon
      <button
        className={`cart-button noselect w-full mt-3 ${className}`}
        onClick={handleAddToCart}
      >
        <span className='text'>{t('productpageid.addtocart')}</span>
        <span className='icon'>
          <ShoppingBag className='h-5 w-5' />
        </span>
      </button>
    );
  }

  // Product is for rental/contact
  return (
    <>
      {canContactSeller ? (
        <button
          className={`cart-button noselect w-full mt-3 ${className}`}
          onClick={() =>
            handleClick(product?.user?.account?.mobile, product?.name)
          }
        >
          <span className='text'>
            {/* {product.type === "rental" ? "Rent Now" : "Contact Seller"} */}
            Contact Seller
          </span>
          <span className='icon'>
            <ShoppingBag className='h-5 w-5' />
          </span>
        </button>
      ) : (
        <TooltipBox text='Upgrade your subscription.'>
          <button
            className={`cart-button noselect w-full mt-3 ${className}`}
            onClick={() => router.push(`/dashboard/subscription`)}
          >
            <span className='text'>
              {/* {product.type === "rental" ? "Rent Now" : "Contact Seller"} */}
              Contact Seller
            </span>
            <span className='icon'>
              <ShoppingBag className='h-5 w-5' />
            </span>
          </button>
        </TooltipBox>
      )}
    </>
  );
};

export default ProductActionButton;

//=============================================================// 9-22-2025

// 'use client';
// import { config } from '@/constants/app';
// import { useTranslation } from '@/hooks/use-translation';
// import { useUserSubscription } from '@/hooks/useSubscription';
// import { ShoppingBag } from 'lucide-react';
// import React from 'react';
// import TooltipBox from './tooltipBox';
// import { useRouter } from 'next/navigation';

// interface ProductActionButtonProps {
//   user: any;
//   product: any;
//   cartItem: any;
//   addToCart: (product: any) => void;
//   className?: string;
// }

// const ProductActionButton: React.FC<ProductActionButtonProps> = ({
//   user,
//   product,
//   cartItem,
//   addToCart,
//   className = '',
// }) => {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const { canContactSeller } = useUserSubscription();

//   // User is viewing their own product - don't show any button
//   if (user && user?.user?.id === product.user?.id) {
//     return null;
//   }

//   const handleClick = (phone: string, productName: string) => {
//     const phoneNumber = `${phone}`;
//     const message = `Hello, I am looking for this product ${productName}`;
//     const url = `https://wa.me/${phoneNumber}?text=${message}`;
//     window.open(url, '_blank');
//   };

//   // Handle add to cart function
//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     addToCart({
//       id: product.id,
//       name: product.name,
//       price: Number.parseFloat(product.price),
//       originalPrice: product.oldPrice
//         ? Number.parseFloat(product.oldPrice)
//         : undefined,
//       quantity: 1,
//       images: [
//         product.pictures[0]?.path
//           ? `${config.API_URL}${product.pictures[0].path}`
//           : '/placeholder.svg',
//       ],
//       selectedSize: product.selectedSize,
//       selectedColor: product.selectedColor,
//       type: product.type,
//       vendor: {
//         name: '',
//         slug: '',
//       },
//     });
//   };

//   // Product is for sale
//   if (product.type === 'new') {
//     return cartItem ? (
//       // If item is in cart, show ONLY the icon button
//       <button
//         className={`cart-button noselect w-full mt-3 flex justify-center items-center ${className}`}
//         onClick={() => router.push('/cart')}
//       >
//         <ShoppingBag className='h-5 w-5' />
//       </button>
//     ) : (
//       // If item is not in cart, show "Add to Cart" button with text and icon
//       <button
//         className={`cart-button noselect w-full mt-3 ${className}`}
//         onClick={handleAddToCart}
//       >
//         <span className='text'>{t('productpageid.addtocart')}</span>
//         <span className='icon'>
//           <ShoppingBag className='h-5 w-5' />
//         </span>
//       </button>
//     );
//   }
//   if (product.type === 'new') {
//     return cartItem ? (
//       // If item is in cart, show ONLY the icon button
//       <button
//         className={`cart-button noselect w-full mt-3 flex justify-center items-center ${className}`}
//         onClick={() => router.push('/cart')}
//       >
//         <ShoppingBag className='h-5 w-5' />
//       </button>
//     ) : (
//       // If item is not in cart, show "Add to Cart" button with text and icon
//       <button
//         className={`cart-button noselect w-full mt-3 ${className}`}
//         onClick={handleAddToCart}
//       >
//         <span className='text'>{t('productpageid.addtocart')}</span>
//         <span className='icon'>
//           <ShoppingBag className='h-5 w-5' />
//         </span>
//       </button>
//     );
//   }

//   // Product is for rental/contact
//   return (
//     <>
//       {canContactSeller ? (
//         <button
//           className={`cart-button noselect w-full mt-3 ${className}`}
//           onClick={() =>
//             handleClick(product?.user?.account?.mobile, product?.name)
//           }
//         >
//           <span className='text'>Contact Seller</span>
//           <span className='icon'>
//             <ShoppingBag className='h-5 w-5' />
//           </span>
//         </button>
//       ) : (
//         <TooltipBox text='Upgrade your subscription.'>
//           <button
//             className={`cart-button noselect w-full mt-3 ${className}`}
//             onClick={() => router.push(`/dashboard/subscription`)}
//           >
//             <span className='text'>Contact Seller</span>
//             <span className='icon'>
//               <ShoppingBag className='h-5 w-5' />
//             </span>
//           </button>
//         </TooltipBox>
//       )}
//     </>
//   );
// };

// export default ProductActionButton;
