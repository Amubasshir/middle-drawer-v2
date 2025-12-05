import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import toast from 'react-hot-toast';
import { createClient } from "@/lib/supabase/client";
import { useAuth } from '@/contexts/auth-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

const SignupWithOTP: React.FC = () => {
  const supabase = createClient();
  
  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
    const { login, signup, signInWithGoogle, isLoading } = useAuth();
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [signupForm, setSignupForm] = useState({
      name: "",
      email: "",
      password: "",
    });

  
    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
  
      if (signupForm.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
  
      const success = await signup(
        signupForm.name,
        signupForm.email,
        signupForm.password
      );

      console.log("Signup success:", {success});
        if (success) {
        setSignupEmail(signupForm.email);
        setShowOTP(true);
        toast.success('Signup successful! Please verify your email.');
      } else {
        setError("User with this email already exists or signup failed");
      }
    };

  const handleOTPSubmit = async () => {
    if (otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifying(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: signupEmail,
        token: otp,
        type: 'email'
      });
      

      if (error) {
        toast.error(error.message || 'OTP verification failed');
        return;
      }

      if (data) {
        toast.success('Email verified successfully!');
        setShowOTP(false);
        setOtp('');
        // Redirect or update app state here
        // Example: router.push('/dashboard');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const resendOTP = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signupEmail,
      });

      if (error) {
        toast.error(error.message || 'Failed to resend OTP');
      } else {
        toast.success('OTP resent successfully!');
      }
    } catch (err) {
      toast.error('Failed to resend OTP');
      console.error(err);
    }
  };

  return (
    <div className="">
      <div className="max-w-md w-full">
        {!showOTP ? (
          // Signup Form
          <div className="">
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
                {error}
              </div>
            )}

             <form onSubmit={handleSignup} className="space-y-6">
                            <div className="space-y-3">
                              <Label htmlFor="signup-name" className="text-lg">
                                Full Name
                              </Label>
                              <Input
                                id="signup-name"
                                type="text"
                                placeholder="Enter your full name"
                                value={signupForm.name}
                                onChange={(e) =>
                                  setSignupForm({ ...signupForm, name: e.target.value })
                                }
                                className="text-lg py-3"
                                required
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="signup-email" className="text-lg">
                                Email
                              </Label>
                              <Input
                                id="signup-email"
                                type="email"
                                placeholder="Enter your email"
                                value={signupForm.email}
                                onChange={(e) =>
                                  setSignupForm({ ...signupForm, email: e.target.value })
                                }
                                className="text-lg py-3"
                                required
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="signup-password" className="text-lg">
                                Password
                              </Label>
                              <Input
                                id="signup-password"
                                type="password"
                                placeholder="Create a password (min 6 characters)"
                                value={signupForm.password}
                                onChange={(e) =>
                                  setSignupForm({ ...signupForm, password: e.target.value })
                                }
                                className="text-lg py-3"
                                required
                              />
                            </div>
                            {error && <p className="text-base text-red-600">{error}</p>}
                            <Button
                              type="submit"
                              className="w-full text-lg py-4"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              ) : null}
                              Sign Up
                            </Button>
                          </form>
            
          </div>
        ) : (
          // OTP Verification Modal/Overlay
          <div className="">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Verify Email</h2>
              <p className="text-gray-600 mt-2">
                Enter the 6-digit code sent to:
                <br />
                <span className="font-medium">{signupEmail}</span>
              </p>
            </div>

            <div className="space-y-6">
              {/* <div className="flex justify-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-12 h-12 mx-1 text-center !text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  )}
                  shouldAutoFocus
                />
              </div> */}
              <div className="flex justify-center">
  <OtpInput
    value={otp}
    onChange={setOtp}
    numInputs={6}
    renderInput={(props) => (
      <input
        {...props}
        className="w-12 h-12 mx-1 text-center text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 focus:outline-none transition-colors"
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
        }}
      />
    )}
    shouldAutoFocus
  />
</div>

              <div className="text-center space-y-4">
                <Button
                    onClick={handleOTPSubmit}
                    disabled={verifying || otp.length !== 6}
                       type="submit"
                       className="w-full text-lg py-4"
                >

                  {verifying ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <button
                  onClick={resendOTP}
                  className="text-orange-800 hover:text-blue-900 text-sm font-medium"
                >
                  Resend OTP
                </button>

                <button
                  onClick={() => setShowOTP(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Back to signup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupWithOTP;