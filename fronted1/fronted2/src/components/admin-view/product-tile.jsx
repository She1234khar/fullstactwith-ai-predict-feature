import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingDisplay from '../shopping-view/rating-display';

export default function AdminProductTile({ product,setcurrentEdited,setOpenCreateProductsDialog,setFormData,handleDelete,setUploadedImageUrl }) {
  console.log('Product (admin tile):', product);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div> 
        <div className='relative'>
          <img src={product.image} alt={product.title} className='w-full h-[300px] object-cover rounded-t-lg' />
          {Number(product.totalStock || 0) === 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Out of Stock</span>
          )}
        </div>
        <CardContent> 
          <h2 className='text-xl font-bold mb-2'>{product.title}</h2>
          
          {/* Rating Display */}
          <div className='mb-2'>
            <RatingDisplay 
              rating={product.averageRating || 0} 
              totalReviews={product.totalReviews || 0} 
              size="sm"
            />
          </div>
          
          <div className='flex justify-between items-center mb-2'>
  {product.salePrice && product.salePrice > 0 ? (
    <>
      <span className="text-lg line-through text-primary">
        ${product.price}
      </span>
      <span className="text-lg font-bold">
        ${product.salePrice}
      </span>
    </>
  ) : (
    <span className="text-lg font-bold">
      ${product.price}
    </span>
  )}
</div>

        </CardContent>
        <CardFooter className='flex justify-between items-center'>
          <Button onClick={()=>{
            setOpenCreateProductsDialog(true);
            setcurrentEdited(product._id);
            setUploadedImageUrl(product.image);
            setFormData({
              image: product.image,
              title: product.title,
              description: product.description,
              category: product.category,
              brand: product.brand,
              price: product.price.toString(),
              salePrice: product.salePrice && product.salePrice > 0 ? product.salePrice.toString() : '',
              totalStock: product.totalStock.toString()
            });
          }}>edit</Button>
          <Button onClick={()=>handleDelete(product._id)} >delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
