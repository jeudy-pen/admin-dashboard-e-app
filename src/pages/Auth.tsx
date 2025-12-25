import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/modal';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [redirectAfterOk, setRedirectAfterOk] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !agreeTerms) {
      setModalTitle(t('error'));
      setModalMessage(t('agreeToTerms'));
      setShowErrorModal(true);
      return;
    }
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setModalTitle(t('error'));
          setModalMessage(error.message);
          setShowErrorModal(true);
        } else {
          setModalTitle(t('welcomeBack'));
          setModalMessage(t('signInSuccess'));
          setRedirectAfterOk(true);
          setShowSuccessModal(true);
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setModalTitle(t('error'));
          setModalMessage(error.message);
          setShowErrorModal(true);
        } else {
          // Show OTP verification
          setShowOTP(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setModalTitle(t('error'));
      setModalMessage(t('enterEmail'));
      setShowErrorModal(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) {
        setModalTitle(t('error'));
        setModalMessage(error.message);
        setShowErrorModal(true);
      } else {
        setModalTitle(t('resetPasswordSent'));
        setModalMessage(t('checkEmailReset'));
        setShowSuccessModal(true);
        setShowForgotPassword(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    });
    
    if (error) {
      setModalTitle(t('error'));
      setModalMessage(error.message);
      setShowErrorModal(true);
    } else {
      setModalTitle(t('verificationSuccess'));
      setModalMessage(t('signInSuccess'));
      setRedirectAfterOk(true);
      setShowSuccessModal(true);
    }
  };

  const handleResendOTP = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    
    if (error) {
      setModalTitle(t('error'));
      setModalMessage(error.message);
      setShowErrorModal(true);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    if (redirectAfterOk) {
      navigate('/');
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-[10px] shadow-xl p-8">
            <OTPVerification
              email={email}
              onVerify={handleOTPVerify}
              onBack={() => setShowOTP(false)}
              onResend={handleResendOTP}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-[10px] shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">{t('adminDashboard')}</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? t('signInToAccount') : t('createYourAccount')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('enterFullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('enterPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password strength for signup */}
              {!isLogin && <PasswordStrength password={password} />}
            </div>

            {/* Remember me / Forgot password for login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                    {t('rememberMe')}
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            {/* Terms and conditions for signup */}
            {!isLogin && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="agreeTerms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="agreeTerms" className="text-sm cursor-pointer leading-relaxed">
                  {t('agreeToTerms')}
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? t('signingIn') : t('creatingAccount')}
                </>
              ) : (
                isLogin ? t('signIn') : t('signUp')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm"
            >
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <Modal open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t('forgotPassword')}</ModalTitle>
            <ModalDescription>{t('enterEmail')}</ModalDescription>
          </ModalHeader>
          <div className="py-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="email"
                placeholder={t('enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowForgotPassword(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleForgotPassword} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('send')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <ModalTitle>{modalTitle}</ModalTitle>
              <ModalDescription className="text-center">{modalMessage}</ModalDescription>
            </div>
          </ModalHeader>
          <ModalFooter className="justify-center">
            <Button onClick={handleSuccessOk} className="min-w-[100px]">
              {t('okay')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Error Modal */}
      <Modal open={showErrorModal} onOpenChange={setShowErrorModal}>
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <ModalTitle>{modalTitle}</ModalTitle>
              <ModalDescription className="text-center">{modalMessage}</ModalDescription>
            </div>
          </ModalHeader>
          <ModalFooter className="justify-center">
            <Button onClick={() => setShowErrorModal(false)} className="min-w-[100px]">
              {t('okay')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
