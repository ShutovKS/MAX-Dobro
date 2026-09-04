// FILE: frontend/src/app/auth/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Login, register, and forgot-password entry for mock and Telegram sessions.
//   SCOPE: Telegram auto-login, demo login, email register, password-reset UI
//   DEPENDS: M-FRONTEND-AUTH, M-FRONTEND-TELEGRAM, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AuthPage - switches login, register, and forgot-password views
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  Send,
  User as UserIcon,
} from 'lucide-react';
import { HeartHandIcon } from '../../components/ui/icons';
import { login, register, getCurrentSession, logout } from '../../lib/auth';
import type { User } from '../../lib/types';
import { MESSAGES, PASSWORD_MIN_LENGTH, TELEGRAM_APP_LINK } from '../../lib/constants';
import {
  getTelegramInitData,
  isTelegramClient,
  telegramLogin,
  waitForTelegramInitData,
} from '../../lib/telegram-sdk';

const Spinner: React.FC = () => (
  <RefreshCw className="w-5 h-5 text-white animate-spin" />
);

const LoginView: React.FC<{
  onAuthSuccess: (session: { user: User; token: string }) => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}> = ({ onAuthSuccess, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const isMock = import.meta.env.VITE_API_MODE === 'mock';
  // Режим входа определяем по НАЛИЧИЮ initData, а не по объекту SDK:
  // telegram-web-app.js создаёт window.Telegram.WebApp и в обычном браузере
  // (с пустым initData). 'checking' — ждём initData, 'telegram' — реальный
  // клиент, 'browser' — открыто вне Telegram (показываем deep-link).
  type EntryMode = 'checking' | 'telegram' | 'browser' | 'demo';
  const [entryMode, setEntryMode] = useState<EntryMode>(
    isMock ? 'demo' : 'checking',
  );

  // START_BLOCK_TELEGRAM_LOGIN
  const handleTelegramLogin = async () => {
    setLoginError('');
    setIsLoading(true);
    try {
      const initData = getTelegramInitData();
      if (!initData) {
        if (isMock) {
          console.warn(
            'Telegram initData not found. Using mock volunteer login.',
          );
          const session = await login('volunteer@test.com', 'password');
          onAuthSuccess(session);
          return;
        }
        throw new Error('Откройте приложение внутри Telegram');
      }

      const ok = await telegramLogin();
      if (!ok) {
        throw new Error('Не удалось войти через Telegram');
      }

      const session = await getCurrentSession();
      if (session) {
        setIsLoading(false);
        onAuthSuccess(session);
      } else {
        throw new Error('Не удалось получить сессию после входа');
      }
    } catch (err: any) {
      setLoginError(err.message || MESSAGES.AUTH.LOGIN_ERROR);
      setIsLoading(false);
    }
  };
  // END_BLOCK_TELEGRAM_LOGIN

  // START_BLOCK_EMAIL_LOGIN
  const handleFormSubmit = async () => {
    let isValid = true;
    if (!email) {
      setEmailError(MESSAGES.AUTH.EMAIL_REQUIRED);
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError(MESSAGES.AUTH.EMAIL_INVALID);
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError(MESSAGES.AUTH.PASSWORD_REQUIRED);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      setLoginError('');
      setIsLoading(true);
      try {
        const session = await login(email, password);
        onAuthSuccess(session);
      } catch (err) {
        setLoginError(MESSAGES.AUTH.LOGIN_ERROR);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // END_BLOCK_EMAIL_LOGIN

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
    if (loginError) setLoginError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
    if (loginError) setLoginError('');
  };

  // Внутри Telegram входим автоматически — без формы. В браузере (SDK есть,
  // но initData пустой) показываем кнопку «Открыть в Telegram».
  useEffect(() => {
    if (isMock) return;
    let cancelled = false;
    (async () => {
      const initData = isTelegramClient()
        ? await waitForTelegramInitData()
        : null;
      if (cancelled) return;
      if (initData) {
        setEntryMode('telegram');
        handleTelegramLogin();
      } else {
        setEntryMode('browser');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Подавляем неиспользуемые предупреждения для оставшегося email/демо-пути.
  void email; void password; void showPassword; void emailError; void passwordError;
  void handleFormSubmit; void handleEmailChange; void handlePasswordChange;
  void onSwitchToRegister; void onSwitchToForgotPassword;

  // START_BLOCK_RENDER_LOGIN
  return (
    <div className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <HeartHandIcon className="w-24 h-24 text-[#007AFF] mb-8" />
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-6 text-center">
          MAX<span className="text-[#007AFF]">Добро</span>
        </h1>
        {loginError && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">
            {loginError}
          </p>
        )}

        {entryMode === 'demo' ? (
          <button
            onClick={handleTelegramLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? <Spinner /> : 'Войти (демо)'}
          </button>
        ) : entryMode === 'telegram' ? (
          <div className="w-full flex flex-col items-center space-y-4">
            <p className="text-[rgb(12,13,14,0.52)]">Входим…</p>
            <button
              onClick={handleTelegramLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? <Spinner /> : 'Войти через Telegram'}
            </button>
          </div>
        ) : entryMode === 'browser' ? (
          <div className="w-full flex flex-col items-center space-y-4">
            <p className="text-[rgb(12,13,14,0.52)]">
              Это приложение работает внутри Telegram.
            </p>
            <a
              href={TELEGRAM_APP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <button className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200">
                <Send className="w-5 h-5 mr-3" />
                Открыть в Telegram
              </button>
            </a>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-4">
            <RefreshCw className="w-6 h-6 text-[#007AFF] animate-spin" />
            <p className="text-[rgb(12,13,14,0.52)]">Проверяем вход…</p>
          </div>
        )}
      </div>
    </div>
  );
  // END_BLOCK_RENDER_LOGIN
};

const RegisterView: React.FC<{
  onRegisterSuccess: (session: { user: User; token: string }) => void;
  onSwitchToLogin: () => void;
}> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName)
      newErrors.firstName = MESSAGES.AUTH.FIRST_NAME_REQUIRED;
    if (!formData.lastName)
      newErrors.lastName = MESSAGES.AUTH.LAST_NAME_REQUIRED;
    if (!formData.email) newErrors.email = MESSAGES.AUTH.EMAIL_REQUIRED;
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = MESSAGES.AUTH.EMAIL_INVALID;
    if (!formData.password) newErrors.password = MESSAGES.AUTH.PASSWORD_REQUIRED;
    else if (formData.password.length < PASSWORD_MIN_LENGTH)
      newErrors.password =
        MESSAGES.AUTH.PASSWORD_MIN_LENGTH(PASSWORD_MIN_LENGTH);
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = MESSAGES.AUTH.PASSWORDS_DONT_MATCH;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (registerError) setRegisterError('');
  };

  // START_BLOCK_REGISTER_SUBMIT
  const handleRegister = async () => {
    if (validate()) {
      setIsLoading(true);
      setRegisterError('');
      try {
        const session = await register(formData);
        onRegisterSuccess(session);
      } catch (err) {
        setRegisterError(MESSAGES.AUTH.REGISTER_ERROR);
        setIsLoading(false);
      }
    }
  };
  // END_BLOCK_REGISTER_SUBMIT

  const isFormValid = useMemo(() => {
    return (
      Object.values(formData).every(
        (value) => typeof value === 'string' && value.length > 0,
      ) &&
      formData.password.length >= PASSWORD_MIN_LENGTH &&
      formData.password === formData.confirmPassword &&
      /^\S+@\S+\.\S+$/.test(formData.email)
    );
  }, [formData]);

  // START_BLOCK_RENDER_REGISTER
  return (
    <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-16 h-16 text-[#007AFF] mb-6" />
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-8 text-center">
          Создать аккаунт
        </h1>
        {registerError && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">
            {registerError}
          </p>
        )}
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Имя"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-600 text-xs mt-1 ml-1">{errors.firstName}</p>
            )}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Фамилия"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-600 text-xs mt-1 ml-1">{errors.lastName}</p>
            )}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Пароль"
                className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторите пароль"
                className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1 ml-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button
            onClick={handleRegister}
            disabled={!isFormValid || isLoading}
            className="w-full bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed h-[50px] flex items-center justify-center"
          >
            {isLoading ? <Spinner /> : 'Зарегистрироваться'}
          </button>
          <p className="text-sm pt-4">
            <span className="text-[rgb(12,13,14,0.52)]">Уже есть аккаунт? </span>
            <button
              onClick={onSwitchToLogin}
              className="font-semibold text-[#007AFF] hover:underline"
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
  // END_BLOCK_RENDER_REGISTER
};

const ForgotPasswordView: React.FC<{ onBackToLogin: () => void }> = ({
                                                                       onBackToLogin,
                                                                     }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendRequest = () => {
    if (email && /^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('');
      setIsSubmitted(true);
    } else {
      setEmailError(MESSAGES.AUTH.EMAIL_INVALID);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  // START_BLOCK_RENDER_FORGOT_PASSWORD
  if (isSubmitted) {
    return (
      <div className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased text-center">
        <div className="w-full max-w-sm flex flex-col items-center">
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
          <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-4">
            Письмо отправлено!
          </h1>
          <p className="text-[rgb(12,13,14,0.52)] mb-8">
            Мы отправили ссылку для восстановления пароля на{' '}
            <span className="font-semibold text-[#0C0D0E]">{email}</span>.
            Пожалуйста, проверьте ваш почтовый ящик.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200"
          >
            Вернуться ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-16 h-16 text-[#007AFF] mb-6" />
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-2 text-center">
          Забыли пароль?
        </h1>
        <p className="text-[rgb(12,13,14,0.52)] mb-8 text-center">
          Введите email, и мы пришлем вам ссылку для восстановления.
        </p>
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Ваш email"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="Email"
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
            </div>
            {emailError && (
              <p id="email-error" className="text-red-600 text-xs mt-1 ml-1">
                {emailError}
              </p>
            )}
          </div>
          <button
            onClick={handleSendRequest}
            disabled={!email}
            className="w-full bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Отправить ссылку
          </button>
          <button
            onClick={onBackToLogin}
            className="flex items-center space-x-2 text-sm text-[#007AFF] hover:underline font-semibold pt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться ко входу</span>
          </button>
        </div>
      </div>
    </div>
  );
  // END_BLOCK_RENDER_FORGOT_PASSWORD
};

type AuthMode = 'login' | 'register' | 'forgotPassword';

interface AuthPageProps {
  onAuthSuccess: (session: { user: User; token: string }) => void;
}

// START_CONTRACT: AuthPage
//   PURPOSE: Switch login, register, and forgot-password views and report session success
//   INPUTS: { onAuthSuccess: (session: { user: User; token: string }) => void }
//   OUTPUTS: { ReactElement - active auth view }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-login, fn-telegramLogin
// END_CONTRACT: AuthPage
const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // START_BLOCK_AUTH_MODE_SWITCH
  switch (authMode) {
    case 'register':
      return (
        <RegisterView
          onRegisterSuccess={onAuthSuccess}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    case 'forgotPassword':
      return <ForgotPasswordView onBackToLogin={() => setAuthMode('login')} />;
    case 'login':
    default:
      return (
        <LoginView
          onAuthSuccess={onAuthSuccess}
          onSwitchToRegister={() => setAuthMode('register')}
          onSwitchToForgotPassword={() => setAuthMode('forgotPassword')}
        />
      );
  }
  // END_BLOCK_AUTH_MODE_SWITCH
};

export default AuthPage;
