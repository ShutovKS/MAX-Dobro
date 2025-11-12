import React from 'react';
import {RefreshCw, ServerCrash, WifiOff} from 'lucide-react';

type ErrorPageProps = {
  type: 'network' | 'server';
  onRetry: () => void;
};

const errorDetails = {
  network: {
    Icon: WifiOff,
    title: "Ой, нет подключения!",
    subtitle: "Пожалуйста, проверьте ваше интернет-соединение и попробуйте снова."
  },
  server: {
    Icon: ServerCrash,
    title: "Что-то пошло не так",
    subtitle: "Мы уже знаем о проблеме и чиним ее. Пожалуйста, попробуйте позже."
  }
};

const ErrorPage: React.FC<ErrorPageProps> = ({type, onRetry}) => {
  const {Icon, title, subtitle} = errorDetails[type];

  return (
    <div
      className="bg-white w-full h-screen flex flex-col items-center justify-center p-6 font-sans antialiased text-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Icon className="w-48 h-48 mb-8 text-gray-300"/>
        <h1 className="text-[28px] font-bold text-[#0C0D0E] mb-2">{title}</h1>
        <p className="text-[rgb(12,13,14,0.52)] mb-8">{subtitle}</p>
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center bg-[#007AFF] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <RefreshCw className="w-5 h-5 mr-2"/>
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
