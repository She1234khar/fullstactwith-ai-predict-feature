import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCartItemContent from './cart-items-content'
import { Navigate, useNavigate } from 'react-router-dom';

export default function UserCartWrapper({cartItems,setOpenCartSheet}) {
  const navigate=useNavigate();

  const totalCartAmount =
  cartItems && cartItems.length > 0
    ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) * currentItem?.quantity,
        0 // ✅ important: initial sum value
      )
    : 0;

  return <SheetContent className='sm:max-w-md'>
    <SheetHeader>
      <SheetTitle> Your Cart</SheetTitle>
    </SheetHeader>
    <div className='mt-8 space-y-4'>
{
  cartItems && cartItems.length > 0 ?
  cartItems.map(item=> <UserCartItemContent cartItem={item}/>) : null
}



    </div>
    <div className="mt-8 space-y-4">
  <div className="flex justify-between">
    <span className="font-bold">Total</span>
    <span className="font-bold">{totalCartAmount}</span>
  </div>
</div>
<Button onClick={()=>{
  navigate('/shop/checkout') ; setOpenCartSheet(false)}} className='w-full mt-6'>checkout</Button>
  </SheetContent>
  
    
  
}
