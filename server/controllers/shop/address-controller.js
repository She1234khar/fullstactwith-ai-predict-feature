const Address = require('../../models/address');


const addAddress = async(req,res)=>{
  try{

    const {userId, address, city, pincode, phone, notes} = req.body;

if(!userId || !address || !city || !pincode || !phone || !notes) {
    return res.status(400).json({
        success : false,
        message : 'Invalid data provided!'
    })
}
    const newAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes
    });

    await newAddress.save();

    res.status(201).json({
      success : true,
      message : 'Address added successfully',
      data : newAddress
    });

  }catch(e){
    console.log(e)
    res.status(500).json({
      success : false,
      message : 'Error'
    })
  }
}

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID provided!'
      });
    }

    const addresses = await Address.find({ userId });

    if (addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No addresses found for this user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: addresses
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
};


const  editAddress= async(req,res)=>{
  try{
    const {userId ,addressId} = req.params;

    const formData = req.body;

    if(!userId || !addressId) {
      return res.status(400).json({
        success : false,
        message : 'Invalid user ID or address ID provided!'
      });
    }
    const address =await Address.findOneAndUpdate({
      _id: addressId, userId
    },formData,{
      new: true})

    if(!address) {
      return res.status(404).json({
        success : false,
        message : 'Address not found'
      });
    }
    res.status(200).json({
      success : true,
      message : 'Address updated successfully',
      data : address
    });

  }catch(e){
    console.log(e)
    res.status(500).json({
      success : false,
      message : 'Error'
    })
  }
}

const deleteAddress = async(req,res)=>{
  try{

    const {userId ,addressId} = req.params;

    if(!userId || !addressId) {
      return res.status(400).json({
        success : false,
        message : 'Invalid user ID or address ID provided!'
      });
    }
    const address = await Address.findOneAndDelete({
      _id: addressId, userId
    });
    if(!address) {
      return res.status(404).json({
        success : false,
        message : 'Address not found'
      });
    }
    res.status(200).json({
      success : true,
      message : 'Address deleted successfully',
      data : address
    });

  }catch(e){
    console.log(e)
    res.status(500).json({
      success : false,
      message : 'Error'
    })
  }
}

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress
};

