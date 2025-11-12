import React, {useEffect, useRef, useState} from 'react';
import type {ChatMessage, User} from '../../lib/types';
import {GoogleGenAI, Type} from '@google/genai';
import {allEvents} from '../../lib/mockData';
import {ArrowLeft, Send, Sparkles} from 'lucide-react';
import EventCard from '../../components/ui/EventCard';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: 'The conversational response to the user.',
    },
    event: {
      type: Type.OBJECT,
      description: 'An event object if the user is asking to find an event. Only include if an event is explicitly found.',
      nullable: true,
      properties: {
        id: {
          type: Type.NUMBER,
          description: 'The ID of the event found.'
        },
        title: {
          type: Type.STRING,
          description: 'The title of the event.'
        }
      }
    }
  }
};

const AssistantChatPage: React.FC<{
  onClose: () => void;
  user: User;
}> = ({onClose, user}) => {
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

  const onSelectEvent = (id: number) => {
    window.location.hash = `#/events/${id}`;
  };

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

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textToSend,
        config: {
          systemInstruction: `You are Помощник Добра (Helper of Good), a friendly and helpful AI assistant for a volunteering app called MAXДобро. You help users find volunteering events, answer questions about the app, and encourage them to do good deeds. Your name is Max. Keep your answers concise, friendly and helpful. Respond in Russian. The user's name is ${user.firstName}. If you find an event for the user, include the event object in your response.`,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      let assistantResponse: ChatMessage;

      try {
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.event && jsonResponse.event.id) {
          const foundEvent = allEvents.find(e => e.id === jsonResponse.event.id);
          if (foundEvent) {
            assistantResponse = {
              id: Date.now() + 1,
              sender: 'assistant',
              type: 'event-card',
              text: jsonResponse.text || `Нашел для вас событие!`,
              event: foundEvent,
            };
          } else {
            assistantResponse = {
              id: Date.now() + 1,
              sender: 'assistant',
              type: 'text',
              text: jsonResponse.text || "Я нашел событие, но не смог загрузить детали."
            };
          }
        } else {
          assistantResponse = {id: Date.now() + 1, sender: 'assistant', type: 'text', text: jsonResponse.text};
        }
      } catch (e) {
        console.error("JSON parsing error, falling back to text:", e);
        assistantResponse = {id: Date.now() + 1, sender: 'assistant', type: 'text', text: response.text};
      }

      setMessages(prev => [...prev, assistantResponse]);

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        type: 'text',
        text: 'К сожалению, у меня возникла небольшая проблема. Попробуйте спросить что-нибудь еще чуть позже.',
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
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
                  <button onClick={() => onSelectEvent(msg.event!.id)}
                          className="w-full transition-transform duration-200 active:scale-95">
                    <EventCard event={msg.event}/>
                  </button>
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