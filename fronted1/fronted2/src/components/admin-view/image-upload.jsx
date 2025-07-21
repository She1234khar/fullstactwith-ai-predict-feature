import { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
function ProductImageUpload({imageFile,setImageFile,uploadedImageUrl,setUploadedImageUrl,setImageLoadingState,isEditeMode}) {

  const inputRed =useRef(null);

  function handleImageFileChange(event){
    console.log(event.target.files);
    const selectedFile=event.target.files?.[0];
    if(selectedFile) setImageFile(selectedFile);

  }
  
  function handleDragOver(event){
event.preventDefault();
  }

  function handleDrop(event){
    event.preventDefault();
    const droppedFile=event.dataTransfer.files?.[0];
    if(droppedFile) setImageFile(droppedFile)
  }

  function handleRemoveImage(){
    setImageFile(null);
    if(inputRed.current){
      inputRed.current.value = '';
    }
    }

    async function uploadImageToCloudinary(){
      setImageLoadingState(true)
      const data = new FormData();
      data.append('my_file', imageFile);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,data);
      console.log(response,"response")
      if(response){
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false)
      }

    }
    useEffect(()=>{
      if(imageFile){
        uploadImageToCloudinary();
      }
    },[imageFile])

  return (
    <div className="w-full max-w-md mx-auto m-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div onDragOver={handleDragOver} onDrop={handleDrop} className="border-2 border-dashed rounded-lg p-4">
        <Input id="image-upload" type="file" ref={inputRed} onChange={handleImageFileChange}
        disabled={isEditeMode}></Input>
        {
          !imageFile ? <Label htmlFor="image-upload" className={`${isEditeMode ? 'cursor-not-allowed':'cursor-pointer'} flex flex-col items-center justify-center h-32 cursor-pointer`}><UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"/>
          <span>Drag & drop or click to upload</span>
          </Label> :<div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            
            <Button variant='ghost' size="icon" className='text-muted-foreground hover:text-foreground' onClick={handleRemoveImage}>
              <XIcon className="w-4 h-4"></XIcon>
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        }
      </div>
      {/* Image Preview */}
      {(imageFile || uploadedImageUrl) && (
        <div className="mt-4 flex justify-center">
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : uploadedImageUrl}
            alt="Product Preview"
            className="max-h-48 rounded shadow"
          />
        </div>
      )}
    </div>
  
  );
}

export default ProductImageUpload;


//3:37
