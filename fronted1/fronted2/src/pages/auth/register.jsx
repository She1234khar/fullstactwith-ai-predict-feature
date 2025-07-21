import { Link, useNavigate } from "react-router-dom";
import { registerFormControls } from "../../config/pt";

import CommonForm from "../../components/common/form";

import { useState } from 'react';
import { useDispatch } from "react-redux";
import { registerUser } from '../../store/auth-slice/slice';
import { toast } from "sonner";



const initialState={
  userName:'',
  email:'',
  password:''
}
 export default function AuthRegister() {
 
  const [formData, setFormData] = useState(initialState);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  
function onSubmit(){
//console.log(formData);
//event.preventDefault();
dispatch(registerUser(formData)).then((data)=>{
  if(data?.payload?.success) {
    
    toast.success(data?.payload.message);

    navigate('/auth/login')
  }
  else{
    toast.error(data?.payload.message);

  }
});
}

    return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="mt-2">
          Already have an account?{" "}
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText="Sign Up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}
