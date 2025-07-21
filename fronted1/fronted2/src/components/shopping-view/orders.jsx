import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import ShoppingOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUserId, getOrderDetails, resetOrderState } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'

export default function ShoppingOrders() {

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const {user}= useSelector((state) => state.auth);
  const {orderList,orderDetails} = useSelector((state) => state.shoppingOrderSlice);

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetails(orderId))
  }
  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  console.log("Order List:", orderList);
  return <Card>
    <CardHeader>
      <CardTitle>Order History</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Order ID
            </TableHead>
            <TableHead>
              
              Order Date
              </TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Order  Price</TableHead>
            <TableHead>
              <span className='sr-only'>Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
{
          orderList && orderList.length > 0 ? orderList.map(orderItem=> 
          <TableRow>
            <TableCell>{orderItem?._id}</TableCell>
            <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
            <TableCell>
              <Badge className={`py-1 px-3 ${orderItem?.orderStatus==='completed' ? 'bg-green-400':'bg-black'}`}>
              {orderItem?.orderStatus
            } </Badge>
            </TableCell>
            <TableCell>{orderItem?.
totalAmount}</TableCell>
            <TableCell>
<Dialog open={openDetailsDialog} onOpenChange={()=>{
  setOpenDetailsDialog(false);
  dispatch(resetOrderState());
}

}> 
  <Button onClick={()=>handleFetchOrderDetails(orderItem?._id)}>View Details</Button>
  <ShoppingOrderDetailsView orderDetails={orderDetails?.data} />
  </Dialog>

              {/* <Button>View Details</Button> */}
            </TableCell>
            
          </TableRow>) :null
}



        </TableBody>
      </Table>
    </CardContent>
  </Card>
   
}
