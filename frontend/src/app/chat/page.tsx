import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';
import type {AppEvent, ChatMessage, User} from '../../lib/types';
import {fetchEventById} from '../../lib/api';
import {ArrowLeft, Send, Sparkles} from 'lucide-react';
import EventCard from '../../components/ui/EventCard';
import {MESSAGES, ROUTES} from '../../lib/constants';


// Mock function to simulate an assistant's response without using AI
const getMockAssistantResponse = async (text: string): Promise<ChatMessage> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const textToProcess = text.toLowerCase();
  let response: ChatMessage;

  if (textToProcess.includes('экология')) {
    const foundEvent = await fetchEventById(1) as AppEvent | undefined;
    if (foundEvent) {
      response = {
        id: Date.now(),
        sender: 'assistant',
        type: 'event-card',
        text: `Нашел для вас подходящее событие по экологии!`,
        event: foundEvent,
        actions: [
          {label: 'Подробнее о событии', route: ROUTES.EVENT_DETAIL(foundEvent.id)},
          {label: 'Найти другие события', route: ROUTES.HOME}
        ]
      };
    } else {
      response = {id: Date.now(), sender: 'assistant', type: 'text', text: MESSAGES.ASSISTANT.EVENT_NOT_FOUND};
    }
  } else if (textToProcess.includes('курс')) {
    response = {
      id: Date.now(),
      sender: 'assistant',
      type: 'text',
      text: 'У нас много интересных курсов! Вы можете посмотреть их все в разделе "Обучение".',
      actions: [
        {label: 'Перейти к курсам', route: ROUTES.TRAINING}
      ]
    };
  } else if (textToProcess.includes('что ты умеешь')) {
    response = {
      id: Date.now(),
      sender: 'assistant',
      type: 'text',
      text: 'Я могу помочь вам найти волонтерские события или курсы. Просто спросите, что вас интересует, например, "экологические события" или "курсы первой помощи".'
    };
  } else {
    response = {
      id: Date.now(),
      sender: 'assistant',
      type: 'text',
      text: 'Я не совсем понял ваш вопрос. Попробуйте переформулировать.'
    };
  }

  return response;
};


const AssistantChatPage: React.FC<{
  onClose: () => void;
  user: User;
}> = ({onClose, user}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'assistant',
        type: 'text',
        text: `Привет, ${user.firstName}! Я ваш Помощник Добра. Я могу помочь найти события, курсы или ответить на ваши вопросы по приложению.`
      },
      {
        id: 2,
        sender: 'assistant',
        type: 'suggestion-chips',
        suggestions: ["Найди события по экологии", "Какие курсы для новичков?", "Что ты умеешь?"]
      }
    ]);
    inputRef.current?.focus();
  }, [user.firstName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text: textToSend,
    };

    const messagesWithoutSuggestions = messages.filter(m => m.type !== 'suggestion-chips');
    setMessages([...messagesWithoutSuggestions, userMessage]);

    if (!messageText) setInput('');
    setIsLoading(true);

    const assistantResponse = await getMockAssistantResponse(textToSend);

    setMessages(prev => [...prev, assistantResponse]);
    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Назад">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-[#007AFF]"/>
            <h1 className="text-lg font-bold text-[#0C0D0E]">Помощник</h1>
          </div>
          <p className="text-sm text-green-500 font-semibold">онлайн</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs md:max-w-md">
              {msg.type === 'text' && (
                <div
                  className={`px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-bl-lg' : 'bg-white text-[#0C0D0E] shadow-sm rounded-br-lg'}`}>
                  {msg.text}
                </div>
              )}
              {msg.type === 'suggestion-chips' && msg.suggestions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.suggestions.map(s => (
                    <button key={s} onClick={() => handleSend(s)}
                            className="px-3 py-1.5 text-sm font-semibold bg-white shadow-sm text-[#007AFF] rounded-full hover:bg-gray-100 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msg.type === 'event-card' && msg.event && (
                <div className="space-y-2">
                  {msg.text && <div
                      className="px-4 py-2 rounded-2xl bg-white text-[#0C0D0E] shadow-sm rounded-br-lg">{msg.text}</div>}
                  <div className="w-full">
                    <EventCard event={msg.event}/>
                  </div>
                </div>
              )}
              {msg.actions && msg.sender === 'assistant' && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.route)}
                      className="px-4 py-2 text-sm font-semibold bg-white border border-gray-200 text-[#007AFF] rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs">
              <div
                className="px-4 py-2 rounded-2xl bg-white text-[#0C0D0E] shadow-sm rounded-br-lg flex items-center space-x-1">
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </main>

      <footer className="flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200 sticky bottom-0 z-20">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спросите что-нибудь..."
            className="flex-grow bg-gray-100 border-transparent rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button type="submit" disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white disabled:bg-gray-300 transition-colors">
            <Send className="w-6 h-6"/>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AssistantChatPage;