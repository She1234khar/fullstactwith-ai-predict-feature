import React from 'react'
import {ChartNoAxesCombined} from 'lucide-react'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
//import { adminSidebarMenuItems } from '@/config/pt'
import {  LayoutDashboard,ShoppingBasket,BadgeCheck  } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle,Sheet } from '../ui/sheet';



 const adminSidebarMenuItems =[
  {
    id:'dashboard',
    label:'Dashboard',
    path:'/admin/dashboard',
    icons:<LayoutDashboard />

  }
  ,
  {
    id:'products',
    label:'products',
    path:'/admin/product',
    icons:<ShoppingBasket />
  },
  {
    id:'orders',
    label:'orders',
    path:'/admin/orders',
    icons:<BadgeCheck />
  }
]

function MenuItems({setOpen}){
  const navigate = useNavigate();
  return <nav className='mt-8 flex-col flex gap-2'>
    {
      adminSidebarMenuItems.map(menuItem=><div  key={menuItem.id} onClick={()=>
      {navigate(menuItem.path)
setOpen ? setOpen(false):null;

      }}className='flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground'>

       {menuItem.icons}
       <span>{menuItem.label}</span>

      </div>)
    }

  </nav>
}





export default function AdminSideBar({open,setOpen}) {

  const navigate = useNavigate();
  return <Fragment>

    <Sheet open={open} onOpenChange={setOpen}>

<SheetContent side='left' className='w-64'>
  <div className='flex flex-col h-full'>
    <SheetHeader className='border-b'>

      <SheetTitle>
      <ChartNoAxesCombined />
      Admin Panel

      </SheetTitle>
    </SheetHeader>
    <MenuItems setOpen={setOpen}></MenuItems>
  </div>


</SheetContent>





    </Sheet>
    <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
      <div  onClick={()=>navigate("/admin/dashboard")} className='flex items-center gap-2 cursor-pointer'>
      <ChartNoAxesCombined />

        <h1 className='text-xl font-extrabold'>Admin Pannel</h1>

      </div>
      <MenuItems></MenuItems>
    </aside>
  </Fragment>
}

// 3:03