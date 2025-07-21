import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import clsx from "clsx";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  isSelected
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={clsx(
        "cursor-pointer transition-all duration-300 ease-in-out border-2 rounded-xl w-full h-full",
        isSelected
          ? "border-black shadow-md bg-gray-100"
          : "border-gray-200 hover:shadow-lg"
      )}
    >
      <CardContent className="flex flex-col gap-1 p-4">
        <Label className="font-medium">{addressInfo?.address}</Label>
        <Label>{addressInfo?.city}</Label>
        <Label>{addressInfo?.pincode}</Label>
        <Label>{addressInfo?.phone}</Label>
        <Label>{addressInfo?.notes}</Label>
      </CardContent>

      <CardFooter className="flex justify-center gap-2 pb-3 mt-auto">
        <Button
          variant="outline"
          className="text-sm px-4 py-2 h-9"
          onClick={(e) => {
            e.stopPropagation(); // Prevent selecting card
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          className="text-sm px-4 py-2 h-9"
          onClick={(e) => {
            e.stopPropagation(); // Prevent selecting card
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
