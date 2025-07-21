import React, { useEffect, useState } from 'react';
import bannerOne from '../../assets/banner-1.webp';
import bannerTwo from '../../assets/banner-2.webp';
import bannerThree from '../../assets/banner-3.webp';
import { Button } from '@/components/ui/button';
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronsRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
  Shirt,
  ShoppingBag,
  Tags,
  BadgeCheck,
  Store,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllFilterProducts,
  fetchProductDetails
} from '@/store/shop/product-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import {
  addToCart,
  fetchCartItems
} from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { getRecommendations, getDiscountCategories } from '../../api/ai';

const categoriesWithIcon = [
  { id: 'men', label: 'Men', icon: ShirtIcon },
  { id: 'women', label: 'Women', icon: CloudLightning },
  { id: 'kids', label: 'Kids', icon: BabyIcon },
  { id: 'accessories', label: 'Accessories', icon: WatchIcon },
  { id: 'footwear', label: 'Footwear', icon: UmbrellaIcon }
];

const brandWithIcon = [
  { id: 'nike', label: 'Nike', icon: Star },
  { id: 'adidas', label: 'Adidas', icon: BadgeCheck },
  { id: 'puma', label: 'Puma', icon: Tags },
  { id: 'levi', label: "Levi's", icon: Shirt },
  { id: 'zara', label: 'Zara', icon: Store },
  { id: 'h&m', label: 'H&M', icon: ShoppingBag }
];

// Helper to parse recommendations (split by line or bullet)
function parseRecommendations(text) {
  if (!text) return [];
  // Try to split by numbered or bullet points, else by newlines
  return text
    .split(/\n|\r|•|\d+\./)
    .map(s => s.trim())
    .filter(Boolean);
}

// Helper to parse categories from summary text
function extractCategories(text) {
  if (!text) return [];
  // Try to extract 'Category: ...' lines
  const matches = text.match(/Category: ([^,\n]+)/g);
  if (matches) return matches.map(m => m.replace('Category: ', '').trim());
  // Fallback: look for capitalized words
  return text.split(/\n|,/).map(s => s.trim()).filter(Boolean);
}

export default function ShoppingHome() {
  const slides = [bannerOne, bannerTwo, bannerThree];
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(state => state.shoppingProduct);
  const { user } = useSelector(state => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [recInput, setRecInput] = useState('');
  const [recResult, setRecResult] = useState('');
  const [discountResult, setDiscountResult] = useState('');
  const [parsedRecs, setParsedRecs] = useState([]);
  const [parsedDiscountCats, setParsedDiscountCats] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(item, section) {
    const queryParam = `${section}=${item.id}`;
    navigate(`/shop/listing?${queryParam}`);
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails({ id: productId }));
  }

  function handleAddToCart(productId) {
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
      if (data.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast.success('Successfully added to cart');
      }
    });
  }

  const handleRecommend = async () => {
    setRecResult('Loading...');
    setParsedRecs([]);
    const res = await getRecommendations({ interest: recInput });
    setRecResult(res.recommendations || JSON.stringify(res));
    setParsedRecs(parseRecommendations(res.recommendations));
  };

  const handleDiscounts = async () => {
    setDiscountResult('Loading...');
    setParsedDiscountCats([]);
    const res = await getDiscountCategories();
    setDiscountResult(res.summary || JSON.stringify(res));
    setParsedDiscountCats(extractCategories(res.summary));
  };

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);
    return () => clearInterval(intervalId);
  }, [slides.length]);

  useEffect(() => {
    dispatch(fetchAllFilterProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Slider */}
      <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            className={`${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500`}
            alt={`Slide ${index + 1}`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
          }
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % slides.length)
          }
        >
          <ChevronsRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* AI Product Recommendations */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Recommended for You (AI)</h2>
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Enter your interest (e.g. shoes, men, sports)"
              value={recInput}
              onChange={e => setRecInput(e.target.value)}
              className="border rounded px-3 py-2 mr-2 w-64"
            />
            <Button onClick={handleRecommend}>Get Recommendations</Button>
          </div>
          {parsedRecs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {parsedRecs.map((rec, idx) => (
                <div key={idx} className="bg-white shadow rounded p-4 border-l-4 border-blue-500">
                  <span className="font-semibold text-blue-700">Recommendation {idx + 1}:</span>
                  <div className="mt-1 text-gray-700">{rec}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded p-3 min-h-[40px] whitespace-pre-wrap">{recResult}</div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((item, index) => (
              <Card
                key={index}
                onClick={() => handleNavigateToListingPage(item, 'category')}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 mb-3 text-primary" />
                  <span className="font-semibold text-sm md:text-base">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Discounted Categories (AI)</h2>
          <Button onClick={handleDiscounts}>Show Discounted Categories</Button>
          {parsedDiscountCats.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {parsedDiscountCats.map((cat, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded p-3 min-h-[40px] mt-2 whitespace-pre-wrap">{discountResult}</div>
          )}
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brandWithIcon.map((item, index) => (
              <Card
                key={index}
                onClick={() => handleNavigateToListingPage(item, 'brand')}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 mb-3 text-primary" />
                  <span className="font-semibold text-sm md:text-base">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {productList?.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem.id}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddToCart}
                  product={productItem}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No products found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
