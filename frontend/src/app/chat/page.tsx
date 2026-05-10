import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';
import type {AppEvent, ChatMessage, User} from '../../lib/types';
import {fetchAssistantChatMessages, fetchEventById, postAssistantMessage} from '../../lib/api';
import {ArrowLeft, Send, Sparkles} from 'lucide-react';
import EventCard from '../../components/ui/EventCard';
import {MESSAGES, ROUTES, UI_TEXT} from '../../lib/constants';

const TRENDING_EVENT_IDS = [1, 2, 3, 4, 5];
const getRandomTrendingEventId = () => TRENDING_EVENT_IDS[Math.floor(Math.random() * TRENDING_EVENT_IDS.length)];

// Lightweight helper to format timestamps consistently
const formatTimestamp = () => new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date());

const INTENTS = [
  {
    key: 'greeting',
    keywords: ['привет', 'здравствуй', 'хай', 'добрый день', 'доброе утро', 'добрый вечер'],
    responder: () => ({
      type: 'text',
      text: 'Привет! Чем могу помочь сегодня?',
      suggestions: ['Найди события по экологии', 'Какие курсы для новичков?'],
    })
  },
  {
    key: 'thanks',
    keywords: ['спасибо', 'благодарю', 'круто'],
    responder: () => ({
      type: 'text',
      text: 'Пожалуйста! Если появятся еще вопросы — я рядом.',
      variant: 'tip'
    })
  },
  {
    key: 'eco',
    keywords: ['экология', 'природа', 'зел'],
    responder: async () => {
      const foundEvent = await fetchEventById(1) as AppEvent | undefined;
      return foundEvent ? {
        type: 'event-card',
        text: 'Нашла для вас событие, где нужна помощь природе 🌿',
        event: foundEvent,
        actions: [
          {label: 'Подробнее', route: ROUTES.EVENT_DETAIL(foundEvent.id)},
          {label: 'Все события', route: ROUTES.HOME}
        ]
      } : {
        type: 'text',
        text: MESSAGES.ASSISTANT.EVENT_NOT_FOUND
      };
    }
  },
  {
    key: 'animals',
    keywords: ['животные', 'зоо', 'приют'],
    responder: async () => {
      const foundEvent = await fetchEventById(2) as AppEvent | undefined;
      return foundEvent ? {
        type: 'event-card',
        text: 'Вот актуальное событие для помощи животным 🐾',
        event: foundEvent,
        actions: [
          {label: 'Подробнее', route: ROUTES.EVENT_DETAIL(foundEvent.id)},
          {label: 'Найти другое', route: ROUTES.HOME}
        ]
      } : {
        type: 'text',
        text: MESSAGES.ASSISTANT.EVENT_NOT_FOUND
      };
    }
  },
  {
    key: 'seniors',
    keywords: ['старшим', 'пожил', 'пенсион'],
    responder: async () => {
      const foundEvent = await fetchEventById(3) as AppEvent | undefined;
      return foundEvent ? {
        type: 'event-card',
        text: 'Вот добрый проект для поддержки старших 🤗',
        event: foundEvent,
        actions: [
          {label: 'Узнать детали', route: ROUTES.EVENT_DETAIL(foundEvent.id)},
          {label: 'Найти другое', route: ROUTES.HOME}
        ]
      } : {
        type: 'text',
        text: MESSAGES.ASSISTANT.EVENT_NOT_FOUND
      };
    }
  },
  {
    key: 'art',
    keywords: ['арт', 'искусство', 'творч'],
    responder: async () => {
      const foundEvent = await fetchEventById(4) as AppEvent | undefined;
      return foundEvent ? {
        type: 'event-card',
        text: 'Посмотрите это творческое событие 🎨',
        event: foundEvent,
        actions: [
          {label: 'Подробнее', route: ROUTES.EVENT_DETAIL(foundEvent.id)},
          {label: 'Все события', route: ROUTES.HOME}
        ]
      } : {
        type: 'text',
        text: MESSAGES.ASSISTANT.EVENT_NOT_FOUND
      };
    }
  },
  {
    key: 'sport',
    keywords: ['спорт', 'фитнес', 'турнир'],
    responder: async () => {
      const foundEvent = await fetchEventById(5) as AppEvent | undefined;
      return foundEvent ? {
        type: 'event-card',
        text: 'Нашла спортивное волонтерство для активных ⚽️',
        event: foundEvent,
        actions: [
          {label: 'Подробнее', route: ROUTES.EVENT_DETAIL(foundEvent.id)},
          {label: 'Все события', route: ROUTES.HOME}
        ]
      } : {
        type: 'text',
        text: MESSAGES.ASSISTANT.EVENT_NOT_FOUND
      };
    }
  },
  {
    key: 'courses',
    keywords: ['курс', 'курсы', 'учеб', 'обуч'],
    responder: (_, textToProcess: string) => {
      if (textToProcess.includes('нович')) {
        return {
          type: 'text',
          text: 'Для новичков есть серия коротких уроков, которые помогут стартовать уверенно.',
          actions: [{label: 'К курсам', route: ROUTES.TRAINING}],
          suggestions: ['Покажи курсы по первой помощи', 'Что за обучение для лидеров?']
        };
      }
      if (textToProcess.includes('первая помощь')) {
        return {
          type: 'text',
          text: 'Курс по первой помощи объясняет базовые алгоритмы и тренирует навыки.',
          actions: [{label: 'Открыть курс', route: ROUTES.TRAINING}]
        };
      }
      return {
        type: 'text',
        text: 'Есть онлайн и офлайн курсы: от коротких интенсивов до длинных программ.',
        actions: [{label: 'Посмотреть обучение', route: ROUTES.TRAINING}]
      };
    }
  },
  {
    key: 'profile',
    keywords: ['профил', 'аккаунт', 'достижен'],
    responder: () => ({
      type: 'text',
      text: 'Ваши достижения, уровни и сертификаты собраны в разделе профиля.',
      actions: [{label: 'Открыть профиль', route: ROUTES.PROFILE}]
    })
  },
  {
    key: 'organizations',
    keywords: ['организац', 'фонду', 'фонд'],
    responder: () => ({
      type: 'text',
      text: 'В каталоге организаций можно подписаться и следить за новостями.',
      actions: [{label: 'Перейти к организациям', route: ROUTES.ORGANIZATIONS}],
      suggestions: ['Какие новые организации?', 'Есть проверенные фонды?']
    })
  },
  {
    key: 'capabilities',
    keywords: ['что ты умеешь', 'что можешь', 'помоги', 'как ты можешь'],
    responder: () => ({
      type: 'text',
      text: 'Могу подобрать событие, подсказать курсы, рассказать о профиле или поделиться советами.',
      suggestions: ['Порекомендуй событие', 'Какие курсы сейчас популярны?']
    })
  },
  {
    key: 'events-general',
    keywords: ['событи', 'мероприят', 'куда пойти'],
    responder: async () => {
      const foundEvent = await fetchEventById(getRandomTrendingEventId()) as AppEvent | undefined;
      return foundEvent ? {
        type: 'event-card',
        text: 'Вот что сейчас в тренде среди волонтеров ✨',
        event: foundEvent,
        actions: [
          {label: 'Открыть событие', route: ROUTES.EVENT_DETAIL(foundEvent.id)},
          {label: 'Смотреть все', route: ROUTES.HOME}
        ]
      } : {
        type: 'text',
        text: MESSAGES.ASSISTANT.EVENT_NOT_FOUND
      };
    }
  }
] as const;

const empatheticPhrases = [
  'Рада помочь!',
  'Если что-то не подошло — давай поищем еще ✅',
  'Можем сузить поиск по интересам',
];

const getMockAssistantResponse = async (text: string): Promise<ChatMessage> => {
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

  const processed = text.toLowerCase();
  const intent = INTENTS.find(({keywords}) => keywords.some(keyword => processed.includes(keyword)));

  let payload: Partial<ChatMessage> | undefined;
  if (intent) {
    payload = await intent.responder(text, processed) as Partial<ChatMessage>;
  }

  if (!payload) {
    payload = {
      type: 'text',
      text: 'Пока я не понимаю запрос. Попробуйте уточнить тему или спросите про события и обучение.',
      variant: 'system',
      suggestions: ['Что ты умеешь?', 'Какие есть события?']
    };
  }

  return {
    id: Date.now(),
    sender: 'assistant',
    type: payload.type ?? 'text',
    text: payload.text,
    event: payload.event,
    actions: payload.actions,
    suggestions: payload.suggestions,
    variant: payload.variant,
    timestamp: formatTimestamp()
  };
};

const AssistantChatPage: React.FC<{
  onClose: () => void;
  user: User;
}> = ({onClose, user}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextTip, setContextTip] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    const initialMessages: ChatMessage[] = [
      {
        id: 1,
        sender: 'assistant',
        type: 'text',
        text: `Привет, ${user.firstName}! Я ваш Помощник Добра. Я могу помочь найти события, курсы или ответить на ваши вопросы по приложению.`,
        timestamp: formatTimestamp()
      },
      {
        id: 2,
        sender: 'assistant',
        type: 'suggestion-chips',
        suggestions: ['Порекомендуй событие', 'Найди события по экологии', 'Какие курсы для новичков?']
      },
      {
        id: 3,
        sender: 'assistant',
        type: 'text',
        variant: 'tip',
        text: 'Совет: спрашивайте по конкретной теме, например “Помоги животным в выходные”.',
        timestamp: formatTimestamp()
      }
    ];
    setMessages(initialMessages);
    fetchAssistantChatMessages()
      .then((history) => {
        if (isMounted && history.length > 0) {
          setMessages(history);
        }
      })
      .catch(() => undefined);
    inputRef.current?.focus();
    return () => {
      isMounted = false;
    };
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
      timestamp: formatTimestamp()
    };

    const messagesWithoutSuggestions = messages.filter(m => m.type !== 'suggestion-chips');
    setMessages([...messagesWithoutSuggestions, userMessage]);

    if (!messageText) setInput('');
    setIsLoading(true);

    let assistantResponse: ChatMessage;
    try {
      assistantResponse = await postAssistantMessage(textToSend);
    } catch {
      assistantResponse = await getMockAssistantResponse(textToSend);
    }

    setMessages(prev => [...prev, assistantResponse]);
    const randomTip = empatheticPhrases[Math.floor(Math.random() * empatheticPhrases.length)];
    setContextTip(randomTip);
    setTimeout(() => setContextTip(null), 4000);
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
        {contextTip && (
          <div className="text-xs text-gray-500 text-center">{contextTip}</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs md:max-w-md">
              {msg.type === 'text' && (
                <div
                  className={`px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-bl-lg' : 'bg-white text-[#0C0D0E] shadow-sm rounded-br-lg'} ${msg.variant === 'tip' ? 'border border-dashed border-blue-200 bg-blue-50 text-[#007AFF]' : ''} ${msg.variant === 'system' ? 'text-gray-500 bg-gray-50 border border-gray-100' : ''}`}>
                  {msg.text}
                  {msg.timestamp && <span className="block text-[11px] opacity-70 mt-1">{msg.timestamp}</span>}
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
              {msg.type === 'course-card' && (
                <div className="space-y-2">
                  {msg.text && <div
                      className="px-4 py-2 rounded-2xl bg-white text-[#0C0D0E] shadow-sm rounded-br-lg">{msg.text}</div>}
                  <button
                    onClick={() => navigate(ROUTES.TRAINING)}
                    className="px-4 py-2 text-sm font-semibold bg-white border border-gray-200 text-[#007AFF] rounded-full hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    К курсам
                  </button>
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isLoading ? 'bg-gray-300' : 'bg-[#007AFF]'}`}>
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/>
            ) : (
              <Send className="w-6 h-6"/>
            )}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AssistantChatPage;
