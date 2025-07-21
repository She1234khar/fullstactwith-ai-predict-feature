import React from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useSelector } from 'react-redux';

export default function ShoppingOrderDetailsView({orderDetails}) {
  console.log("Order Details:", orderDetails);
  const {user}=useSelector((state) => state.auth);
  return (
    <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6 w-full p-2 sm:p-4">
        {/* Order Info */}
        <div className="grid gap-2 text-sm">
          {[
            { label: 'Order ID', value: orderDetails?._id || 'N/A' },
            { label: 'Order Date', value: orderDetails?.orderDate?.split('T')[0] || 'N/A' },
            { label: 'Order Price', value: `$${orderDetails?.totalAmount || '0.00'}` },
            { label: 'Order Status', value: orderDetails?.orderStatus || 'N/A' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between mt-2"
            >
              <p className="font-medium">{item.label}</p>
              <Label>{item.value}</Label>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Order Details */}
        {/* Order Details */}
<div className="grid gap-4">
  <div className="grid gap-2">
    <div className="font-medium text-lg">Order Details</div>
    <ul className="grid gap-3 text-sm">
      {orderDetails?.cartItems?.length > 0 ? (
        orderDetails.cartItems.map((item, index) => (
          <li key={index} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 object-cover rounded-md"
              />
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
              </div>
            </div>
            <div className="font-medium">
              ₹{parseInt(item.price) * parseInt(item.quantity)}
            </div>
          </li>
        ))
      ) : (
        <li className="text-muted-foreground">No products found.</li>
      )}
    </ul>
  </div>
</div>


        
        {/* Shipping Info */}
<div className="grid gap-4">
  <div className="grid gap-2">
    <div className="font-medium text-lg">Shipping Info</div>
    <div className="grid gap-0.5 text-muted-foreground text-sm">
      <span>Name: {user?.userName || 'N/A'}</span>
      <span>Address: {orderDetails?.addressInfo?.address || 'N/A'}</span>
      <span>City: {orderDetails?.addressInfo?.city || 'N/A'}</span>
      <span>Pincode: {orderDetails?.addressInfo?.pincode || 'N/A'}</span>
      <span>Phone: {orderDetails?.addressInfo?.phone || 'N/A'}</span>
      <span>Notes: {orderDetails?.addressInfo?.notes || 'N/A'}</span>
    </div>
  </div>
</div>


        {/* Payment Info */}
<div className="grid gap-2">
  <div className="font-medium text-lg">Payment Info</div>
  <div className="grid gap-0.5 text-muted-foreground text-sm">
    <span>Payment Method: {orderDetails?.paymentMethod || 'N/A'}</span>
    <span>Transaction ID: {orderDetails?.paymentId || 'N/A'}</span>
    <span>Status: {orderDetails?.paymentStatus || 'N/A'}</span>
  </div>
</div>

      </div>
    </DialogContent>
  )
}
