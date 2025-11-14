import React, {useMemo, useState} from 'react';
import {ArrowLeft, Briefcase, CheckCircle, Eye, EyeOff, Lock, Mail, RefreshCw, User as UserIcon} from 'lucide-react';
import {HeartHandIcon, MaxIcon} from '../../components/ui/icons';
import {login, register} from '../../lib/auth';
import type {User} from '../../lib/types';
import {MESSAGES, PASSWORD_MIN_LENGTH} from '../../lib/constants';

const Spinner: React.FC = () => (
  <RefreshCw className="w-5 h-5 text-white animate-spin"/>
);

const LoginView: React.FC<{
  onAuthSuccess: (session: { user: User; token: string }) => void,
  onSwitchToRegister: () => void,
  onSwitchToForgotPassword: () => void
}> = ({onAuthSuccess, onSwitchToRegister, onSwitchToForgotPassword}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginAttempt = async (loginFn: () => Promise<{ user: User; token: string }>) => {
    setLoginError('');
    setIsLoading(true);
    try {
      const session = await loginFn();
      onAuthSuccess(session);
    } catch (err) {
      setLoginError(MESSAGES.AUTH.LOGIN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = () => {
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
      handleLoginAttempt(() => login(email, password));
    }
  };

  const handleVolunteerLogin = () => handleLoginAttempt(() => login('volunteer@test.com', 'password'));
  const handleOrganizerLogin = () => handleLoginAttempt(() => login('organizer@test.com', 'password'));

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

  return (
    <div className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-24 h-24 text-[#007AFF] mb-8"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-10 text-center">
          Добро пожаловать!
        </h1>
        {loginError && <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">{loginError}</p>}
        <div className="w-full flex flex-col items-center space-y-3">
          <button
            onClick={handleVolunteerLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50">
            <MaxIcon className="w-6 h-6 mr-3"/>
            Войти через MAX (Волонтер)
          </button>
          <button
            onClick={handleOrganizerLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50">
            <Briefcase className="w-5 h-5 mr-3"/>
            Войти через MAX (Организатор)
          </button>
          <div className="flex items-center w-full py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-[rgb(12,13,14,0.52)] text-sm font-medium">или</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400"/>
              </span>
              <input type="email" value={email} onChange={handleEmailChange} placeholder="Ваш email"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                     aria-label="Email" aria-invalid={!!emailError} aria-describedby="email-error"/>
            </div>
            {emailError && <p id="email-error" className="text-red-600 text-xs mt-1 ml-1">{emailError}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400"/>
              </span>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange}
                     placeholder="Пароль"
                     className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                     aria-label="Password" aria-invalid={!!passwordError} aria-describedby="password-error"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}>
                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
              </button>
            </div>
            {passwordError && <p id="password-error" className="text-red-600 text-xs mt-1 ml-1">{passwordError}</p>}
          </div>
          <button onClick={handleFormSubmit} disabled={isLoading}
                  className="w-full bg-transparent border-2 border-[#007AFF] text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-2 h-[50px] flex items-center justify-center disabled:opacity-50">
            {isLoading ? <Spinner/> : 'Продолжить'}
          </button>
          <div className="w-full flex justify-between items-center pt-2">
            <button onClick={onSwitchToForgotPassword} className="text-sm text-[#007AFF] hover:underline">
              Забыли пароль?
            </button>
            <button onClick={onSwitchToRegister} className="text-sm text-[#007AFF] hover:underline font-semibold">
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterView: React.FC<{
  onRegisterSuccess: (session: { user: User; token: string }) => void,
  onSwitchToLogin: () => void
}> = ({onRegisterSuccess, onSwitchToLogin}) => {
  const [formData, setFormData] = useState({firstName: '', lastName: '', email: '', password: '', confirmPassword: ''});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = MESSAGES.AUTH.FIRST_NAME_REQUIRED;
    if (!formData.lastName) newErrors.lastName = MESSAGES.AUTH.LAST_NAME_REQUIRED;
    if (!formData.email) newErrors.email = MESSAGES.AUTH.EMAIL_REQUIRED;
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = MESSAGES.AUTH.EMAIL_INVALID;
    if (!formData.password) newErrors.password = MESSAGES.AUTH.PASSWORD_REQUIRED;
    else if (formData.password.length < PASSWORD_MIN_LENGTH) newErrors.password = MESSAGES.AUTH.PASSWORD_MIN_LENGTH(PASSWORD_MIN_LENGTH);
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = MESSAGES.AUTH.PASSWORDS_DONT_MATCH;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
    if (registerError) setRegisterError('');
  };

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

  const isFormValid = useMemo(() => {
    return Object.values(formData).every(value => typeof value === 'string' && value.length > 0) && formData.password.length >= PASSWORD_MIN_LENGTH && formData.password === formData.confirmPassword && /^\S+@\S+\.\S+$/.test(formData.email);
  }, [formData]);

  return (
    <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-16 h-16 text-[#007AFF] mb-6"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-8 text-center">Создать аккаунт</h1>
        {registerError &&
            <p className="text-red-600 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">{registerError}</p>}
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><UserIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Имя"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
            </div>
            {errors.firstName && <p className="text-red-600 text-xs mt-1 ml-1">{errors.firstName}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><UserIcon
                className="w-5 h-5 text-gray-400"/></span>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Фамилия"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
            </div>
            {errors.lastName && <p className="text-red-600 text-xs mt-1 ml-1">{errors.lastName}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Mail
                className="w-5 h-5 text-gray-400"/></span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock
                className="w-5 h-5 text-gray-400"/></span>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                     onChange={handleChange} placeholder="Пароль"
                     className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock
                className="w-5 h-5 text-gray-400"/></span>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                     value={formData.confirmPassword} onChange={handleChange} placeholder="Повторите пароль"
                     className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>
          <button onClick={handleRegister} disabled={!isFormValid || isLoading}
                  className="w-full bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed h-[50px] flex items-center justify-center">
            {isLoading ? <Spinner/> : 'Зарегистрироваться'}
          </button>
          <p className="text-sm pt-4">
            <span className="text-[rgb(12,13,14,0.52)]">Уже есть аккаунт? </span>
            <button onClick={onSwitchToLogin} className="font-semibold text-[#007AFF] hover:underline">
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const ForgotPasswordView: React.FC<{ onBackToLogin: () => void }> = ({onBackToLogin}) => {
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

  if (isSubmitted) {
    return (
      <div
        className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased text-center">
        <div className="w-full max-w-sm flex flex-col items-center">
          <CheckCircle className="w-24 h-24 text-green-500 mb-6"/>
          <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-4">Письмо отправлено!</h1>
          <p className="text-[rgb(12,13,14,0.52)] mb-8">
            Мы отправили ссылку для восстановления пароля на <span
            className="font-semibold text-[#0C0D0E]">{email}</span>. Пожалуйста, проверьте ваш почтовый ящик.
          </p>
          <button onClick={onBackToLogin}
                  className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200">
            Вернуться ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased">
      <div className="w-full max-w-sm flex flex-col items-center">
        <HeartHandIcon className="w-16 h-16 text-[#007AFF] mb-6"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-2 text-center">Забыли пароль?</h1>
        <p className="text-[rgb(12,13,14,0.52)] mb-8 text-center">
          Введите email, и мы пришлем вам ссылку для восстановления.
        </p>
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400"/>
              </span>
              <input type="email" value={email} onChange={handleEmailChange} placeholder="Ваш email"
                     className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                     aria-label="Email" aria-invalid={!!emailError} aria-describedby="email-error"/>
            </div>
            {emailError && <p id="email-error" className="text-red-600 text-xs mt-1 ml-1">{emailError}</p>}
          </div>
          <button onClick={handleSendRequest} disabled={!email}
                  className="w-full bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Отправить ссылку
          </button>
          <button onClick={onBackToLogin}
                  className="flex items-center space-x-2 text-sm text-[#007AFF] hover:underline font-semibold pt-4">
            <ArrowLeft className="w-4 h-4"/>
            <span>Вернуться ко входу</span>
          </button>
        </div>
      </div>
    </div>
  );
};

type AuthMode = 'login' | 'register' | 'forgotPassword';

interface AuthPageProps {
  onAuthSuccess: (session: { user: User; token: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({onAuthSuccess}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  switch (authMode) {
    case 'register':
      return <RegisterView onRegisterSuccess={onAuthSuccess} onSwitchToLogin={() => setAuthMode('login')}/>;
    case 'forgotPassword':
      return <ForgotPasswordView onBackToLogin={() => setAuthMode('login')}/>;
    case 'login':
    default:
      return <LoginView onAuthSuccess={onAuthSuccess} onSwitchToRegister={() => setAuthMode('register')}
                        onSwitchToForgotPassword={() => setAuthMode('forgotPassword')}/>;
  }
}

export default AuthPage;
