import { addressFormControls } from "@/config/pt";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";

const initialAddressFormData = {
  address: '',
  city: '',
  pincode: '',
  phone: '',
  notes: ''
};

function Address({ setCurrentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [currentSelectedId, setCurrentSelectedId] = useState(null); // Track selected address

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.address);

  async function handleManageAddress() {
    try {
      if (addressList.length >= 3 && currentEditedId === null) {
        toast.error("You can only have a maximum of 3 addresses.");
        return;
      }

      if (currentEditedId !== null) {
        const res = await dispatch(
          editAddress({
            userId: user?.id,
            addressId: currentEditedId,
            ...formData
          })
        );

        if (res?.payload?.success) {
          dispatch(fetchAllAddress(user.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast.success("Address updated successfully");
        }
      } else {
        const res = await dispatch(
          addNewAddress({
            userId: user.id,
            ...formData
          })
        );

        if (res?.payload?.success) {
          dispatch(fetchAllAddress(user.id));
          setFormData(initialAddressFormData);
          toast.success("Address added successfully");
        }
      }
    } catch (error) {
      console.error("Failed to manage address:", error);
    }
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({
        userId: user.id,
        addressId: getCurrentAddress._id
      })
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllAddress(user.id));
        toast.success("Address deleted successfully");
        if (getCurrentAddress._id === currentSelectedId) {
          setCurrentSelectedId(null); // Unselect if deleted
        }
      } else {
        console.error("Failed to delete address:", data.payload.message);
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes
    });
  }

  function isFormValid() {
    return Object.values(formData).every((value) => value.trim() !== "");
  }

  useEffect(() => {
    dispatch(fetchAllAddress(user.id));
  }, [dispatch, user.id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                addressInfo={singleAddressItem}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={(address) => {
                  setCurrentSelectedAddress(address);
                  setCurrentSelectedId(address._id); // Track selected
                }}
                isSelected={currentSelectedId === singleAddressItem._id}
              />
            ))
          : null}
      </div>

      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
          buttonText={currentEditedId !== null ? "Edit Address" : "Add New Address"}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
