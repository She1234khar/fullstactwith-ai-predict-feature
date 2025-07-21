const express = require('express');
const { upload } = require('../../helpers/cloudinary');
const { handleImageUpload, addproduct, featchProducts, editProduct, deleteProduct } = require('../../controllers/admin/products-controller');



const router=express.Router();
router.post('/upload-image',upload.single('my_file'),handleImageUpload)

router.post('/add',addproduct)
router.get('/fetch',featchProducts);
router.put('/edit/:id',editProduct)
router.delete('/delete/:id',deleteProduct)

module.exports=router;