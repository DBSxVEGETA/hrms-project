import { useState , useEffect } from "react";
import { Eye, EyeOff, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import API from "axios";
import { toast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle visibility
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Register handler
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match" });
      return;
    }

    try {
      const res = await API.post("http://localhost:9500/api/auth/register", { name: fullName, email, password });
      toast({ title: "Registered successfully!" });
      setIsLogin(true); // Switch to login after register
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.response?.data?.message || "Something went wrong" });
    }
  };

  const handleLogin = async () => {
    try {
      const res = await API.post(
        "http://localhost:9500/api/auth/login",
        { email, password },
        {
          withCredentials: true, // 💥 Accept cookies from backend
        }
      );
  
      toast({ title: "Login successful!" });
      navigate("/candidates");
  
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };
  
  const checkUserIsAuth = async () => {
    try {
      const res = await API.get(
        "http://localhost:9500/api/auth/checkAuth",
        {
          withCredentials: true, // 💥 Accept cookies from backend
        }
      );

      navigate("/candidates");
    } catch (err: any) {
      console.error("User not loggined");
    }
  };

  useEffect(()=>{
    checkUserIsAuth();
  },[]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="pt-16 pb-8">
        <div className="flex items-center justify-center">
          <div className="h-14 w-14 border-2 border-purple-700 flex items-center justify-center">
            <Square size={28} className="text-purple-700" />
          </div>
          <span className="ml-4 text-3xl font-bold text-purple-700">LOGO</span>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 flex-grow flex">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden flex">
          {/* Left Purple Panel */}
          <div className="w-1/2 bg-purple-700 flex flex-col items-center justify-center text-white p-12">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-10">
                <img src="/lovable-uploads/836e9a9a-1cfc-478e-a816-832451bfdea1.png" alt="Dashboard preview" className="w-full rounded-lg shadow-lg" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to our dashboard</h2>
                <p className="text-white/80 text-base">Manage your candidates, employees, attendance, and leaves easily.</p>
              </div>
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <div className={`h-2 w-10 rounded-full ${isLogin ? "bg-white" : "bg-white/40"}`}></div>
                  <div className={`h-2 w-2 rounded-full ${!isLogin ? "bg-white" : "bg-white/40"}`}></div>
                  <div className="h-2 w-2 rounded-full bg-white/40"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-1/2 bg-white flex items-center justify-center">
            <div className="max-w-sm w-full px-10">
              <h1 className="text-2xl font-semibold text-gray-800 mb-8">Welcome to Dashboard</h1>

              {/* Register Form */}
              {!isLogin && (
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1 block">
                      Full name<span className="text-red-500">*</span>
                    </Label>
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                      Email Address<span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                      Password<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                      <button type="button" onClick={toggleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1 block">
                      Confirm Password<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                      />
                      <button type="button" onClick={toggleShowConfirmPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the terms and conditions.
                    </Label>
                  </div>
                  <Button onClick={handleRegister} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                    Register
                  </Button>
                  <div className="text-center text-sm text-gray-600">
                    Already have an account?
                    <button onClick={() => setIsLogin(true)} className="text-purple-700 font-medium ml-1">
                      Login
                    </button>
                  </div>
                </div>
              )}

              {/* Login Form */}
              {isLogin && (
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                      Email Address<span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                      Password<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                      <button type="button" onClick={toggleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-gray-600 hover:text-purple-700">
                      Forgot password?
                    </a>
                  </div>
                  <Button onClick={handleLogin} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                    Login
                  </Button>
                  <div className="text-center text-sm text-gray-600 pt-1">
                    Don't have an account?
                    <button onClick={() => setIsLogin(false)} className="text-purple-700 font-medium ml-1">
                      Register
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="py-8"></div>
    </div>
  );
};

export default AuthPage;
