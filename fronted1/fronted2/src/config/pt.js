// import {  LayoutDashboard,ShoppingBasket,BadgeCheck  } from "lucide-react";

export  const registerFormControls =[
  {
    name:'userName',
    label:'user Name',
    placeholder:'Enter your user name',
    componentType:'input',
    type:'text',
    
  },
  {
  name: 'email',
  label: 'Email',
  placeholder: 'Enter your email address',
  componentType: 'input',
  type: 'email',
},
{
name: 'password',
  label: 'Password',
  placeholder: 'Enter your password',
  componentType: 'input',
  type: 'password',
}
];
export  const loginFormControls =[
  
  {
  name: 'email',
  label: 'Email',
  placeholder: 'Enter your email address',
  componentType: 'input',
  type: 'email',
},
{
name: 'password',
  label: 'Password',
  placeholder: 'Enter your password',
  componentType: 'input',
  type: 'password',
}
]

// export const adminSidebarMenuItems =[
//   {
//     id:'dashboard',
//     label:'Dashboard',
//     path:'/admin/dashboard',
//     icons:<LayoutDashboard />

//   }
//   ,
//   {
//     id:'products',
//     label:'products',
//     path:'/admin/products',
//     icons:<ShoppingBasket />
//   },
//   {
//     id:'orders',
//     label:'orders',
//     path:'/admin/orders',
//     icons:<BadgeCheck />
//   }
// ]

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter available stock",
  },
  {
    label: "Product Image URL",
    name: "image",
    componentType: "input",
    type: "text",
    placeholder: "Enter image URL",
  },
];
export const shoppingViewHeaderMenuItems=[{
  id:'home',
  label:'Home',
  path:'/shop/home'
},
{
  id:'men',
  label:'Men',
  path:'/shop/listing'
},
{
  id:'women',
  label:'Women',
  path:'/shop/listing'
},
{
  id:'kids',
  label:'Kids',
  path:'/shop/listing'
},
{
  id:'footwear',
  label:'Footwear',
  path:'/shop/listing'
},
{
  id:'accessories',
  label:'Accessories',
  path:'/shop/listing'
},
{
  id:'search',
  label:'search',
  path:'/shop/search'
}
]
export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];


export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];




