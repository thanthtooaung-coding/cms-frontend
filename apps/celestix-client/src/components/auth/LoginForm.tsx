import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { bmsApiFetch } from "@/utils/apiClient";
import { useAuthDataStore } from "@/store/auth-store";
import { TenantContext } from "@/context/TenantContext";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  onLogin?: (role: string) => void;
  onClose?: () => void;
}

export const LoginForm = ({ onSwitchToRegister, onForgotPassword, onLogin, onClose }: LoginFormProps) => {
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const tenantContext = useContext(TenantContext);
  const tenantInfo = tenantContext?.tenantInfo || null;
  const { setUser } = useAuthDataStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  useEffect(() => {
    if (tenantSlug && tenantInfo) {
      localStorage.setItem('tenant_id', tenantInfo.tenantId.toString());
      localStorage.setItem('tenant_slug', tenantSlug);
    } else {
      const storedTenantId = localStorage.getItem('tenant_id');
      if (storedTenantId) {
        // Use stored tenant info
      }
    }
  }, [tenantSlug, tenantInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setError(null);
    setLoading(true);

    try {
      // Get tenant ID from tenant context (from URL slug), not from localStorage
      // This ensures users can only log in to the tenant they're accessing
      const tenantId = tenantInfo?.tenantId;
      
      if (!tenantId || !tenantSlug) {
        throw new Error('Tenant information not available. Please access via tenant URL.');
      }

      const response = await bmsApiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
          tenantId: tenantId ? parseInt(tenantId.toString()) : undefined,
        }),
      }, true); // Skip auth headers for login

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const result = await response.json();
      
      // BMS API returns { code, message, data: { token, role } }
      // Role is an enum serialized as string (e.g., "ADMIN", "CUSTOMER")
      const loginData = result.data || result;
      const token = loginData.token;
      const role = typeof loginData.role === 'string' 
        ? loginData.role 
        : (loginData.role?.name || loginData.role?.displayName || 'CUSTOMER');

      if (!token || typeof token !== 'string' || token.trim() === '') {
        throw new Error('Token not received from server');
      }

      // Store token (ensure it's a valid string)
      const cleanToken = token.trim();
      if (!cleanToken.includes('.')) {
        throw new Error('Invalid token format received from server');
      }
      localStorage.setItem('bms_token', cleanToken);

      // Fetch user details using the token
      try {
        const userResponse = await bmsApiFetch('/auth/me', {
          method: 'GET',
        }, false); // Include auth headers

        if (userResponse.ok) {
          const userResult = await userResponse.json();
          const userData = userResult.data || userResult;
          
          setUser({
            id: userData.id?.toString() || '',
            name: userData.name || email,
            email: userData.email || email,
            tenantId: userData.tenant?.id?.toString() || tenantId?.toString() || '',
            role: role,
            roleName: role,
          });
        } else {
          // If /me fails, use basic info from login
          setUser({
            id: '',
            name: email,
            email: email,
            tenantId: tenantId?.toString() || '',
            role: role,
            roleName: role,
          });
        }
      } catch (userErr) {
        // If fetching user fails, use basic info
        setUser({
          id: '',
          name: email,
          email: email,
          tenantId: tenantId?.toString() || '',
          role: role,
          roleName: role,
        });
      }

      // Redirect to admin dashboard if role is ADMIN, otherwise to home
      let redirectPath;
      if (role === 'ADMIN') {
        redirectPath = tenantSlug ? `/bms/${tenantSlug}/admin` : '/admin';
      } else {
        redirectPath = tenantSlug ? `/bms/${tenantSlug}` : '/';
      }
      
      if (onLogin) {
        onLogin(role);
      }
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setErrors({ ...errors, password: err.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden floating-elements">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-primary" />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 glass-card">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              {tenantInfo?.logoUrl ? (
                <img
                  src={tenantInfo.logoUrl}
                  alt={tenantInfo.tenantName || 'Tenant Logo'}
                  className="w-12 h-12 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to initial if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className={`w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center ${tenantInfo?.logoUrl ? 'hidden' : ''}`}
                style={{ display: tenantInfo?.logoUrl ? 'none' : 'flex' }}
              >
                <span className="text-background font-bold text-lg">
                  {tenantInfo?.tenantName ? tenantInfo.tenantName.charAt(0).toUpperCase() : 'C'}
                </span>
              </div>
              <span className="text-2xl font-bold gradient-text">
                {tenantInfo?.tenantName || tenantInfo?.pageTitle || 'CELESTIX'}
              </span>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <p className="text-primary text-sm font-medium tracking-wider uppercase">HELLO</p>
              <h1 className="text-3xl font-bold text-foreground">WELCOME BACK</h1>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  EMAIL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                />
                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  PASSWORD <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border bg-secondary" defaultChecked />
                  <span className="text-muted-foreground">Remember Password</span>
                </label>
                <button 
                  type="button"
                  onClick={() => {
                    if (onForgotPassword) {
                      onForgotPassword();
                    } else if (tenantSlug) {
                      navigate(`/bms/${tenantSlug}/forgot-password`);
                    } else {
                      navigate('/forgot-password');
                    }
                  }}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Forget Password
                </button>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-accent hover:shadow-glow transition-all duration-300 font-medium"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <button 
                type="button"
                onClick={() => {
                  if (onSwitchToRegister) {
                    onSwitchToRegister();
                  } else if (tenantSlug) {
                    navigate(`/bms/${tenantSlug}/register`);
                  } else {
                    navigate('/register');
                  }
                }}
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Sign up now
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};