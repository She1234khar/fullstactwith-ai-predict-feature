// 5:51
const express = require('express');
const { getFilteredProducts, getProductDetails } = require('../../controllers/shop/products-controller');

const router=express.Router();

router.get('/list',getFilteredProducts)
router.get('/details/:id',getProductDetails)
module.exports=router;