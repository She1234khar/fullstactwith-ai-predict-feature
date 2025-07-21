import Address from '@/components/shopping-view/address';
import img from '../../assets/account (1).jpg';
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { toast } from 'sonner';


function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const {user} = useSelector((state) => state.auth);
  const {approvalURL} = useSelector((state) => state.shoppingOrderSlice);

  const [currentSelectedAddress,setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart,setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();

  const totalCartAmount =
  cartItems &&cartItems.items&& cartItems.items.length > 0
    ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) * currentItem?.quantity,
        0 
      )
    : 0;

   function handleInitiatepaypalPayment() {

    if(cartItems.length === 0){
      toast.error("Your cart is empty. Please add items to your cart before proceeding to checkout.");
      return;
    }

    if(currentSelectedAddress===null){
      toast.error("Please select an address to proceed with payment.");
      return;
    }
    console.log("Current selected address:", currentSelectedAddress);


    const orderData ={
      userId :user?.id,
      cartId:cartItems?._id,
        cartItems:cartItems.items.map(singleCartItem => ({
          productId: singleCartItem.productId,
      price: singleCartItem.price,
      
      title: singleCartItem.title,
      image: singleCartItem.image,
      quantity: singleCartItem.quantity,
        })),
        addressInfo: {                                                    
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          pincode: currentSelectedAddress?.pincode,
          phone: currentSelectedAddress?.phone,
          notes: currentSelectedAddress?.notes,
        },
        orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
        totalAmount: totalCartAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId:'',
        payerId:'',

    }
console.log(orderData);
dispatch(createNewOrder(orderData)).then((data)=>{
  console.log(data,'order created successfully');
  if(data?.payload?.success){
    setIsPaymentStart(true);
  }
  else{
    setIsPaymentStart(false);
  }
})

   }

if(approvalURL){
  window.location.href = approvalURL;
}





  // const totalCartAmount =
  // cartItems &&cartItems.items&& cartItems.items.length > 0
  //   ? cartItems.items.reduce(
  //       (sum, currentItem) =>
  //         sum +
  //         (currentItem?.salePrice > 0
  //           ? currentItem?.salePrice
  //           : currentItem?.price) * currentItem?.quantity,
  //       0 
  //     )
  //   : 0;

  return (
    <div className="flex flex-col">
      {/* Header Image */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout Banner"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
        {/* Address Form Section */}
        <Address  setCurrentSelectedAddress={setCurrentSelectedAddress} />

        {/* Cart Items Section */}
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemContent
                key={item.id || item._id}
                cartItem={item}
              />
            ))
          ) : (
            <p>No items in the cart.</p>
          )}

<div className="mt-8 space-y-4">
  <div className="flex justify-between">
    <span className="font-bold">Total</span>
    <span className="font-bold">${totalCartAmount}</span>
  </div>
</div>
<div className='mt-4 w-full'>
  <Button  onClick={handleInitiatepaypalPayment}className='w-full'> CheckOut With PayPal</Button>
</div>
        </div>
        
      </div>
    </div>
  );
}

export default ShoppingCheckout;
