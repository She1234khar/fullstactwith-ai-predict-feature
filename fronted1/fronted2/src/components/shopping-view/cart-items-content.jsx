import React from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartItemQuantity } from '@/store/shop/cart-slice';
import { toast } from "sonner";

export default function UserCartItemContent({cartItem}) {
const dispatch=useDispatch();
const { user } = useSelector(state => state.auth);
//console.log(user,"shekhar")
  function handleCartItemDelete(getCartItem) {
    console.log(user,"shekhar")
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
      })
    );
  }
  function handleUpdateQuantity(getCartItem, typeOfAction) {
    dispatch(
      updateCartItemQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "add"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success(`Quantity ${typeOfAction === "add" ? "increased" : "decreased"} successfully!`);
      } else {
        toast.error(data?.payload?.message || "Failed to update cart.");
      }
    });
  }
   
  return (
    <div className="flex items-center space-x-4">
    <img
      src={cartItem?.image}
      alt={cartItem?.title}
      className="w-20 h-20 rounded object-cover"
    />
    <div className="flex-1">
      <h3 className="font-extrabold">{cartItem?.title}</h3>
      <div className="flex items-center mt-1 gap-2">
        <Button variant="outline" size="icon" className='h-8 w-8 rounded-full '
        disabled={cartItem.quantity===1}
         onClick={()=>handleUpdateQuantity(cartItem,'remove')}>
          <Minus className='w-4 h-4'/>
          <span className='sr-only'>Decrease</span>
        </Button>
        <span>{cartItem.quantity}</span>
        <Button variant="outline" size="icon" className='h-8 w-8 rounded-full ' onClick={()=>handleUpdateQuantity(cartItem,'add')}>
          <Plus className='w-4 h-4'/>
          <span className='sr-only'>Increase</span>
        </Button>
      </div>
    </div>
    <div className="flex flex-col items-end">
  <p className="font-semibold">
    $
    {(
      (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
      cartItem?.quantity
    ).toFixed(2)}
  </p>
  <Trash  onClick={()=>handleCartItemDelete(cartItem)}
  className="cursor-pointer mt-1" size={20} />
</div>

  </div>
  )
}

//7:36
