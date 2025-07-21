import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { House,Menu,ShoppingCart,User,LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/config/pt'
// import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuTrigger,DropdownMenu,DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '../ui/dropdown-menu'
import { Avatar } from '../ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { logoutUser } from '@/store/auth-slice/slice'
import UserCartWrapper from './cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Label } from '../ui/label'
// import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
 

function MenuItems(){
const navigate=useNavigate();
function handleNavigate(getCurrentMenuItem) {
  sessionStorage.removeItem('filters');

  const isHome = getCurrentMenuItem.id === 'home';

  const currentFilter = isHome ? null : { category: [getCurrentMenuItem.id] };

  if (currentFilter) {
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    const query = new URLSearchParams({ category: getCurrentMenuItem.id }).toString();
    navigate(`${getCurrentMenuItem.path}?${query}`);
  } else {
    navigate(getCurrentMenuItem.path);
  }
}

  
  return <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row'>
{
  shoppingViewHeaderMenuItems.map(menuItem=><Label onClick={()=>handleNavigate(menuItem)}className='text-sm font-medium cursor-pointer' key={menuItem.id}>{menuItem.label}</Label>)
}

  </nav>
}

function HeaderRightContent(){

  const {user}=useSelector(state=>state.auth)
  const {cartItems}=useSelector(state=>state.shoppingCart)

const [openCartSheet,setOpenCartSheet]=useState(false);

  const navigate=useNavigate();
const dispatch=useDispatch();
function handleLogout(){
  dispatch(logoutUser());
}


useEffect(()=>{
  dispatch(fetchCartItems(user.id))
},[dispatch])

  //console.log(user.userName)

  return <div className='flex lg:items-center lg:flex-row flex-col gap-4'>
  <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}>
    <Button onClick={()=>setOpenCartSheet(true)} variant='outline' size='icon'>
    <ShoppingCart className='h-6 w-6' />
      <span className='sr-only'>User cart</span>
    </Button>
    <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length >0 ? cartItems.items :[]}/>
    </Sheet>


<DropdownMenu>
  <DropdownMenuTrigger asChild>
<Avatar className='bg-black'>
  <AvatarFallback className='bg-black text-white font-extrabold'>
    {user.userName.toUpperCase()}
  </AvatarFallback>

</Avatar>

  </DropdownMenuTrigger>
  <DropdownMenuContent side='right' className='w-56'>
    <DropdownMenuLabel>
      Logged in as {user.userName}
    </DropdownMenuLabel>
    <DropdownMenuSeparator/>
    <DropdownMenuItem  onClick={()=>navigate('/shop/account')}>
    <User />
    Account
    </DropdownMenuItem>
    <DropdownMenuSeparator/>
    <DropdownMenuItem onClick={handleLogout}>
    <LogOut  className='mr-2 h-4 w-4'/>
    Logout
    </DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
  </div>
}

export default function ShoppingHeader() {

const { isAuthenticated }=useSelector(state=>state.auth)

//console.log(user);

  return <header className='sticky top-0 z-40 w-full border-b bg-background'>
   <div className='flex h-16 items-center justify-between px-4 md:px-6'>
    <Link to="/shop/home" className='flex items-center gap-2'>
    <House  className='h-6 w-6'/>
    <span className='font-bold'>Ecommerece</span>
    </Link>
    <Sheet>
    <SheetTrigger asChild>
  <Button variant="outline" size="icon" className="lg:hidden">
    <Menu className="h-6 w-6" />
    <span className="sr-only">Toggle header menu</span>
  </Button>
</SheetTrigger>

      <SheetContent  side="left" className="w-full max-w-xs">


<MenuItems/>
<HeaderRightContent/>
         
      </SheetContent>
    </Sheet>
    <div className='hidden lg:block'>
 <MenuItems/>

    </div>
    {
      <div className='hidden lg:block'>
        <HeaderRightContent/>
      </div>
    }
    </div> 
  </header>
    
  
}

