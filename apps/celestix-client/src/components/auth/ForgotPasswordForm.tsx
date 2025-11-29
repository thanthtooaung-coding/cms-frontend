import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  onBack?: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("request-otp"); // 'request-otp' or 'reset-password'
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setError("");

    try {
      const response = await fetchApi("/auth/forgot-password", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your email address.",
        });
        setStep("reset-password");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError("OTP and new password are required.");
      return;
    }
    setError("");

    try {
      const response = await fetchApi("/auth/reset-password", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password.",
        });
        if (onBack) {
          onBack();
        } else if (tenantSlug) {
          navigate(`/bms/${tenantSlug}/login`);
        } else {
          navigate('/login');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden floating-elements">
      <div className="absolute inset-0 bg-gradient-cinema" />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 glass-card">
          {step === "request-otp" ? (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">FORGOT PASSWORD</h1>
              </div>
              <form className="space-y-6" onSubmit={handleRequestOtp}>
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    EMAIL <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                  />
                  {error && <p className="text-destructive text-xs">{error}</p>}
                </div>
                <Button type="submit" className="w-full bg-gradient-accent hover:shadow-glow transition-all duration-300 font-medium">
                  SEND OTP
                </Button>
              </form>
              <p className="text-muted-foreground text-sm">
                Remember your password?{" "}
                <button 
                  onClick={() => {
                    if (onBack) {
                      onBack();
                    } else if (tenantSlug) {
                      navigate(`/bms/${tenantSlug}/login`);
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="text-primary hover:text-primary/80 transition-colors underline"
                >
                  Back to login
                </button>
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">RESET PASSWORD</h1>
              </div>
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div className="space-y-2 text-left">
                  <Label htmlFor="otp" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    OTP <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    NEW PASSWORD <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                  />
                  {error && <p className="text-destructive text-xs">{error}</p>}
                </div>
                <Button type="submit" className="w-full bg-gradient-accent hover:shadow-glow transition-all duration-300 font-medium">
                  RESET PASSWORD
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};