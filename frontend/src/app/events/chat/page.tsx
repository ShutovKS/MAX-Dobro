// FILE: frontend/src/app/events/chat/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Event participant chat with pinned organizer note and send box.
//   SCOPE: Load event and messages, post message, render bubbles
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventChatPage - event participant chat screen
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useRef, useState} from 'react';
import type {AppEvent, EventChatMessage, User} from '../../../lib/types';
import {fetchEventById, fetchEventChatMessages, postEventChatMessage} from '../../../lib/api';
import {ArrowLeft, MoreHorizontal, Paperclip, Pin, Send, X} from 'lucide-react';
import {ChatSkeleton} from '../../../components/ui/Skeletons';

const MessageBubble: React.FC<{ message: EventChatMessage; isOutgoing: boolean; showAuthor: boolean }> = ({
                                                                                                            message,
                                                                                                            isOutgoing,
                                                                                                            showAuthor
                                                                                                          }) => (
  <div className={`flex items-end gap-2 ${isOutgoing ? 'flex-row-reverse' : ''}`}>
    {!isOutgoing && (
      <img src={message.author.avatarUrl} alt={message.author.name}
           className={`w-8 h-8 rounded-full ${showAuthor ? 'opacity-100' : 'opacity-0'}`}/>
    )}
    <div className={`max-w-xs md:max-w-md ${isOutgoing ? 'ml-10' : 'mr-10'}`}>
      {!isOutgoing && showAuthor &&
          <p className="text-sm font-semibold text-gray-600 mb-1 ml-3">{message.author.name}</p>}
      <div
        className={`px-4 py-2 text-base ${isOutgoing ? 'bg-[linear-gradient(155deg,#526EFF_6.6%,#007AFF_84.12%)] text-white rounded-t-2xl rounded-bl-2xl' : 'bg-white text-[#0C0D0E] shadow-sm rounded-t-2xl rounded-br-2xl'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <p
          className={`text-xs mt-1 ${isOutgoing ? 'text-white/70 text-right' : 'text-gray-400 text-right'}`}>{message.timestamp}</p>
      </div>
    </div>
  </div>
);

const PinnedMessage: React.FC<{ onDismiss: () => void }> = ({onDismiss}) => (
  <div className="flex-shrink-0 bg-blue-50/70 backdrop-blur-sm p-3 flex items-start space-x-3">
    <Pin className="w-5 h-5 text-[#007AFF] mt-0.5 flex-shrink-0"/>
    <div className="flex-1 text-sm text-blue-900">
      <span className="font-semibold">Организатор:</span> Встречаемся у главного входа в 10:00. Мой телефон: +7 (999)
      123-45-67
    </div>
    <button onClick={onDismiss} className="text-blue-500 hover:text-blue-700">
      <X className="w-5 h-5"/>
    </button>
  </div>
);

// START_CONTRACT: EventChatPage
//   PURPOSE: Load event chat history and send messages
//   INPUTS: { eventId: number; user: User; onBack: () => void }
//   OUTPUTS: { ReactElement - event chat }
//   SIDE_EFFECTS: fetchEventById, fetchEventChatMessages, postEventChatMessage
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-postEventChatMessage
// END_CONTRACT: EventChatPage
const EventChatPage: React.FC<{
  eventId: number;
  user: User;
  onBack: () => void;
}> = ({eventId, user, onBack}) => {
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<EventChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showPinned, setShowPinned] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // START_BLOCK_LOAD_EVENT_CHAT
    const loadData = async () => {
      setLoading(true);
      const [eventData, messagesData] = await Promise.all([
        fetchEventById(eventId),
        fetchEventChatMessages(eventId)
      ]);
      if (eventData) setEvent(eventData as AppEvent);
      setMessages(messagesData);
      setLoading(false);
    };
    loadData();
  }, [eventId]);
    // END_BLOCK_LOAD_EVENT_CHAT

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  // START_BLOCK_SEND_EVENT_MESSAGE
  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend) return;

    setInput('');
    try {
      const postedMessage = await postEventChatMessage(eventId, textToSend);
      setMessages(prev => [...prev, postedMessage]);
    } catch {
      const fallbackMessage: EventChatMessage = {
        id: Date.now(),
        author: {id: user.id, name: `${user.firstName} ${user.lastName}`, avatarUrl: user.avatarUrl},
        text: textToSend,
        timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'}),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
  // END_BLOCK_SEND_EVENT_MESSAGE
    e.preventDefault();
    handleSend();
  };

  if (loading || !event) {
    return <ChatSkeleton />;
  }

  // START_BLOCK_RENDER_EVENT_CHAT
  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Назад">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-[#0C0D0E] text-center leading-tight">{event.title}</h1>
          <p className="text-sm text-gray-500 font-medium">{event.participantCount || 0} участников</p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Действия">
          <MoreHorizontal className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      {showPinned && <PinnedMessage onDismiss={() => setShowPinned(false)}/>}

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        <div
          className="text-center text-sm text-gray-400 bg-gray-200 rounded-full px-3 py-1 inline-block mx-auto">Сегодня
        </div>
        {messages.map((msg, index) => {
          const prevMessage = messages[index - 1];
          const showAuthor = !prevMessage || prevMessage.author.id !== msg.author.id;
          return (
            <MessageBubble key={msg.id} message={msg} isOutgoing={msg.author.id === user.id}
                           showAuthor={showAuthor}/>
          );
        })}
        <div ref={messagesEndRef}/>
      </main>

      <footer className="flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200 sticky bottom-0 z-20">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
          <button type="button" className="p-2 text-gray-500 hover:text-[#007AFF]">
            <Paperclip className="w-6 h-6"/>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Сообщение..."
            className="flex-grow bg-gray-100 border-transparent rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button type="submit" disabled={!input.trim()}
                  className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white disabled:bg-gray-300 transition-colors">
            <Send className="w-6 h-6"/>
          </button>
        </form>
      </footer>
    </div>
  );
  // END_BLOCK_RENDER_EVENT_CHAT
};

export default EventChatPage;
