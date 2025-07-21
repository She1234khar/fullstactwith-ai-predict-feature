import { Link, useNavigate } from "react-router-dom";
import { loginFormControls } from "../../config/pt";
import { toast } from "sonner";
import CommonForm from "../../components/common/form";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/auth-slice/slice";

const initialState = {
  email: '',
  password: ''
}

export default function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state se auth status lo
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  // Login ke baad turant redirect karo
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/shop/home", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  function onSubmit() {
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message || 'Login successful');
        // Yahan redirect ki zarurat nahi, useEffect handle karega
      } else {
        toast.error(data?.payload?.message || 'Login failed. Please try again.');
      }
    }).catch((error) => {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your connection and try again.');
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back! Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have Account?{" "}
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}