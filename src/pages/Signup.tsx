import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowLeft, Loader2, Mail, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendSignupOTP, generateAuthCode, isValidEmail } from '@/lib/authEmailService';
import emailjs from '@emailjs/browser';

export default function Signup() {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate OTP
      const otp = generateAuthCode();
      setGeneratedOTP(otp);

      // Debug: Check EmailJS configuration
      const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const EMAILJS_TEMPLATE_ID = 'template_a9l1gx7'; // Use authentication template
      const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      console.log('🔧 EmailJS Debug:');
      console.log('Service ID:', EMAILJS_SERVICE_ID);
      console.log('Auth Template ID:', EMAILJS_TEMPLATE_ID);
      console.log('Public Key:', EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing');

      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        toast({
          title: 'Configuration Error',
          description: 'Email service not properly configured. Please check console.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Send professional authentication email to customer
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        
        const authEmailParams = {
          to_email: email, // Customer's email
          to_name: username,
          from_name: 'BALAJI & CO',
          subject: 'Verify Your Email - BALAJI & CO',
          company_name: 'BALAJI & CO',
          auth_type: 'Email Verification',
          message_title: 'Welcome to BALAJI & CO!',
          verification_code: otp,
          message_body: `Thank you for signing up with BALAJI & CO. Your verification code is: ${otp}. This code will expire in 10 minutes. Please do not share this code with anyone.`,
          expiry_time: '10 minutes',
          support_email: 'info@balajicotrader.com',
          website_url: window.location.origin,
          current_date: new Date().toLocaleString('en-IN', {
            dateStyle: 'full',
            timeStyle: 'short',
          }),
        };

        console.log('📧 Sending authentication email to customer:', email);
        console.log('Template params:', authEmailParams);

        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          authEmailParams,
          EMAILJS_PUBLIC_KEY
        );

        console.log('✅ Authentication email sent:', response.status, response.text);

        if (response.status === 200) {
          setStep('otp');
          toast({
            title: 'Verification code sent!',
            description: `Please check your email ${email} for the 6-digit verification code.`,
          });
        } else {
          throw new Error('EmailJS failed with status: ' + response.status);
        }
      } catch (emailError) {
        console.error('❌ Authentication email failed:', emailError);
        toast({
          title: 'Failed to send email',
          description: 'Please check your email address and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: 'Failed to send verification code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Verify OTP
    if (otp !== generatedOTP) {
      toast({
        title: 'Invalid code',
        description: 'Please enter the correct verification code.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Create account after OTP verification
    const result = await signup(username, password, email);

    if (result.success) {
      toast({
        title: 'Account created!',
        description: 'Email verified and account created successfully.',
      });
      navigate('/customer-background');
    } else {
      toast({
        title: 'Signup failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const newOTP = generateAuthCode();
      setGeneratedOTP(newOTP);
      
      const emailSent = await sendSignupOTP(email, newOTP, username);
      
      if (emailSent) {
        toast({
          title: 'New verification code sent!',
          description: `Please check your email ${email} for the new code.`,
        });
      } else {
        toast({
          title: 'Failed to send email',
          description: 'Please try again or check your email address.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend verification code.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                {step === 'details' ? (
                  <Package className="h-7 w-7 text-primary-foreground" />
                ) : (
                  <Shield className="h-7 w-7 text-primary-foreground" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-heading">
              {step === 'details' ? 'Create Account' : 'Verify Email'}
            </CardTitle>
            <CardDescription>
              {step === 'details' 
                ? 'Join BALAJI & CO and start trading today' 
                : `Enter the verification code sent to ${email}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'details' ? (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <p className="text-xs text-muted-foreground">We'll send a verification code to this email</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    autoComplete="username"
                  />
                  <p className="text-xs text-muted-foreground">At least 3 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">At least 6 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending verification code...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">Check your email inbox and spam folder</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify & Create Account
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Resend verification code'}
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep('details')}
                    className="text-sm"
                  >
                    ← Back to details
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
