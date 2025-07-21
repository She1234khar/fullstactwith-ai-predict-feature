import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { capturePayment } from '@/store/shop/order-slice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';



export default function PaypalReturn() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('paymentId');
  const payerId = params.get('PayerID');

  useEffect(() => {
    if (paymentId && payerId) {
      const getCurrentOrderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
      //console.log(sessionStorage.getItem('currentOrderId'),'gayaandpriya');
      
        dispatch(capturePayment({ paymentId, payerId, orderId: getCurrentOrderId })).then((response) => {
            console.log('hello shekharr', response);
             if (response.payload.success) {
              // console.log("Payment captured successfully:", response.payload);
              console.log("Before remove:", sessionStorage.getItem('currentOrderId'));
              

              sessionStorage.removeItem('currentOrderId');
              console.log("After remove:", sessionStorage.getItem('currentOrderId')); 


              
               window.location.href = '/shop/payment-success'; 
             } else {
               console.error("Failed to capture payment");
               
            }
           });
     
    
  }}, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Processing payment... please wait
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
