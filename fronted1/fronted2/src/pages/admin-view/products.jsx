import ProductImageUpload from '@/components/admin-view/image-upload';
import AdminProductTile from '@/components/admin-view/product-tile';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button'
import { SheetContent, SheetHeader, SheetTitle,Sheet } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config/pt';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin/product-slice';
//import { Sheet } from 'lucide-react'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "sonner";

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: "",
  salePrice: '',
  totalStock:''
};


export default function AdminProducts() {

  const [openCreateProductsDialog,setOpenCreateProductsDialog] =useState(false);

  const [formData,setFormData]=useState(initialFormData);

  const [imageFile,setImageFile] =useState(null);

  const [uploadedImageUrl,setUploadedImageUrl]=useState('');

  const [imageLoadingState,setImageLoadingState] =useState(false);
  const [currentEdited,setcurrentEdited]=useState(null);
  const { productList } = useSelector((state) => state.adminProducts);
  //console.log(productList);


const dispatch = useDispatch();


  


function onSubmit(){
  //event.preventDefault();
  currentEdited!==null ?
  dispatch(editProduct({
    id:currentEdited, formData: {
      ...formData,
      image: uploadedImageUrl || formData.image,
      totalStock: formData.totalStock !== '' ? Number(formData.totalStock) : 0,
      price: Number(formData.price),
      salePrice: formData.salePrice !== '' ? Number(formData.salePrice) : null,
    }
  })).then((data)=>{
    console.log(data,'edit');


    if(data.payload.success){
      dispatch(fetchAllProducts());
      setFormData(initialFormData);
      setOpenCreateProductsDialog(false);
      setcurrentEdited(null);
      setUploadedImageUrl('');
      toast.success("Product updated successfully");
    }
  }):
  

  
  dispatch(addNewProduct({
    ...formData,
    image:uploadedImageUrl,
    totalStock: formData.totalStock !== '' ? Number(formData.totalStock) : 0,
    price: Number(formData.price),
    salePrice: formData.salePrice !== '' ? Number(formData.salePrice) : null,
  })).then((data) => {
    console.log(data, 'add');
    if(data.payload.success){
      dispatch(fetchAllProducts());
      setFormData(initialFormData);
      setOpenCreateProductsDialog(false);
      setUploadedImageUrl('');
      toast.success("product add successfully");
    }
  });
}
// function isFormValid(){
//   return object.keys(formData).map((key)=>formdata[key]!=="")
//   .every((item)=>item);
// }
function handleDelete(getCurrentProductId) {
  console.log(getCurrentProductId);

  dispatch(deleteProduct({ id: getCurrentProductId })).then(data => {
    console.log(data);

    if (data.payload.success) {
      dispatch(fetchAllProducts());
    } else {
      console.error("Delete failed:", data.payload.message || "Unknown error");
    }
  });
}


function isFormValid() {
  const requiredFields = ['title', 'description', 'category', 'brand', 'price', 'totalStock'];
  return requiredFields.every(field => formData[field]?.trim() !== "");
}




useEffect(()=>{
dispatch(fetchAllProducts())
},[dispatch])



  return <Fragment>
    <div className='mb-5 w-full flex justify-end'>
      <Button onClick={()=>setOpenCreateProductsDialog(true)}>Add New Product</Button>
    </div>
    <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
  {
    productList && productList.length > 0 
      ? productList.map(produItem => (
        <AdminProductTile key={produItem._id} product={produItem} setcurrentEdited={setcurrentEdited} setOpenCreateProductsDialog={setOpenCreateProductsDialog} setFormData={setFormData} handleDelete={handleDelete} setUploadedImageUrl={setUploadedImageUrl} />
        ))
      : null
  }
</div>

<Sheet open={openCreateProductsDialog} onOpenChange={() => {
  setOpenCreateProductsDialog(false);
  setcurrentEdited(null);
  setFormData(initialFormData);
  setUploadedImageUrl('');
}}>
  <SheetContent side="right" className="overflow-auto">
    <SheetHeader>
      <SheetTitle>
        {
          currentEdited ? "Edit Product" : "Add New Product"
        }
      </SheetTitle>
    </SheetHeader>
    <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} 
    setImageLoadingState={setImageLoadingState} imageLoadingState= {imageLoadingState}
    isEditeMode={currentEdited!==null}/>

    
<div className='py-6'>
<CommonForm onSubmit={onSubmit}  formData={formData} setFormData={setFormData} buttonText={currentEdited ? "Edit Product" : "Add New Product"} formControls={addProductFormElements}   isBtnDisabled={!isFormValid()}></CommonForm>

</div>
  </SheetContent>

</Sheet>

    
  </Fragment> 
    
 
}
