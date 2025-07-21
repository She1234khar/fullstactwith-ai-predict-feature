import React, { useState } from 'react';
import { DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '@radix-ui/react-select';
import CommonForm from '../common/form';
import { useDispatch } from 'react-redux';
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from '@/store/admin/order-slice';

const initialFormData = {
  status: '',
};

export default function AdminOrderDetails({ orderDetails }) {
  const [formData, setFormData] = useState({
    status: orderDetails?.orderStatus || '',
  });
const dispatch = useDispatch();
  const handleUpdateStatus = () => {
    console.log('Updating status to:', formData.status);
    const {status}=formData;
    // TODO: Add API call here
    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status })).then((response) => {
      if (response.payload.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id)); 
        // Refresh order details
        dispatch(getAllOrdersForAdmin())
        setFormData(initialFormData); 
  }});
   // setFormData(initialFormData); // Reset form data after submission
  
  };

  return (
    <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6 w-full p-2 sm:p-4">

        {/* Order Info */}
        <div className="grid gap-2 text-sm">
          {[
            { label: 'Order ID', value: orderDetails?._id },
            { label: 'Order Date', value: new Date(orderDetails?.orderDate).toLocaleString() },
            { label: 'Order Price', value: `₹${orderDetails?.totalAmount}` },
            { label: 'Order Status', value: orderDetails?.orderStatus },
          ].map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:justify-between mt-2">
              <p className="font-medium">{item.label}</p>
              <Label>{item.value}</Label>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Cart Items */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Ordered Products</div>
            <ul className="grid gap-3 text-sm">
              {orderDetails?.cartItems?.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Payment Info */}
        <div className="grid gap-2">
          <div className="font-medium">Payment Info</div>
          <div className="grid gap-0.5 text-muted-foreground text-sm">
            <span>Payment Method: {orderDetails?.paymentMethod}</span>
            <span>Transaction ID: {orderDetails?.paymentId}</span>
            <span>Status: {orderDetails?.paymentStatus}</span>
            <span>Payer ID: {orderDetails?.payerId}</span>
          </div>
        </div>

        {/* Status Update Form */}
        <CommonForm
          formControls={[
            {
              label: 'Order Status',
              name: 'status',
              componentType: 'select',
              options: [
                { id: 'pending', label: 'Pending' },
                { id: 'inProcess', label: 'In Process' },
                { id: 'inShipping', label: 'In Shipping' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'rejected', label: 'Rejected' },
                { id: 'completed', label: 'Completed' },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText="Update Order Status"
          onSubmit={handleUpdateStatus}
        />
      </div>
    </DialogContent>
  );
}
