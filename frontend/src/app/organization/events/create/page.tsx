import React, {useEffect, useState} from 'react';
import type {OrganizationEvent} from '../../../../lib/types';
import {fetchOrganizationEvents} from '../../../../lib/api';
import {parseRuDateToDateTimeLocal} from '../../../../lib/dateUtils';
import {ArrowLeft, Camera, MapPin, Users} from 'lucide-react';
import {EVENT_CATEGORIES} from '../../../../lib/constants';

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({title, children}) => (
  <section className="bg-white rounded-2xl shadow-sm">
    <h2 className="px-4 pt-4 pb-2 text-xl font-bold text-[#0C0D0E]">{title}</h2>
    <div className="p-4 space-y-4">
      {children}
    </div>
  </section>
);

const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({label, children}) => (
  <div>
    <label className="text-sm font-semibold text-gray-600 mb-1 block">{label}</label>
    {children}
  </div>
);

const ToggleSwitch: React.FC<{
  options: [string, string];
  selected: string;
  onChange: (value: string) => void
}> = ({options, selected, onChange}) => (
  <div className="flex bg-gray-100 rounded-xl p-1">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${selected === opt ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
      >
        {opt}
      </button>
    ))}
  </div>
);


interface CreateEventPageProps {
  event?: OrganizationEvent | null;
  onBack: () => void;
  onPublish: (data: any) => void;
}

const CreateEventPage: React.FC<CreateEventPageProps> = ({event, onBack, onPublish}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(parseRuDateToDateTimeLocal(event?.date));
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<'Офлайн' | 'Онлайн'>('Офлайн');
  const [address, setAddress] = useState('');
  const [volunteerCount, setVolunteerCount] = useState(event?.capacity ? event.capacity.toString() : '10');
  const [requirements, setRequirements] = useState('');
  const [rewards, setRewards] = useState('');

  useEffect(() => {
    if (event?.id) {
      const loadEventData = async () => {
        const allOrgEvents = await fetchOrganizationEvents();
        const existingEvent = allOrgEvents.find(e => e.id === event.id);
        if (existingEvent) {
          setTitle(existingEvent.title);
          setStartDate(parseRuDateToDateTimeLocal(existingEvent.date));
          setVolunteerCount(existingEvent.capacity.toString());
        }
      };
      loadEventData();
    }
  }, [event]);

  const isFormValid = title && category && description && startDate && (format === 'Онлайн' || address);

  const handlePublish = () => {
    if (isFormValid) {
      onPublish({
        title,
        category,
        description,
        startDate,
        endDate,
        format,
        address,
        volunteerCount,
        requirements,
        rewards
      });
    }
  }

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <div className="w-10">
          <button onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-2"
                  aria-label="Назад">
            <ArrowLeft className="w-6 h-6 text-gray-700"/>
          </button>
        </div>
        <h1 className="text-lg font-bold text-[#0C0D0E]">{event ? 'Редактирование события' : 'Новое событие'}</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4 pb-28">
        <FormSection title="Основная информация">
          <InputField label="Название события*">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                   placeholder="Например, Субботник в парке"
                   className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </InputField>
          <InputField label="Обложка">
            <button
              className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 border-2 border-dashed border-gray-300">
              <Camera className="w-8 h-8 mb-2"/>
              <span className="font-semibold">Загрузить фото</span>
            </button>
          </InputField>
          <InputField label="Категория события*">
            <div className="flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${category === cat ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </InputField>
          <InputField label="Подробное описание*">
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
                      placeholder="Расскажите, что предстоит делать волонтерам, какая цель у события..."
                      className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </InputField>
        </FormSection>

        <FormSection title="Дата и место">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Начало*">
              <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)}
                     className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </InputField>
            <InputField label="Окончание">
              <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)}
                     className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </InputField>
          </div>
          <InputField label="Формат">
            <ToggleSwitch options={['Офлайн', 'Онлайн']} selected={format} onChange={val => setFormat(val as any)}/>
          </InputField>
          {format === 'Офлайн' && (
            <InputField label="Адрес*">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MapPin
                  className="w-5 h-5 text-gray-400"/></span>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                       placeholder="Укажите место на карте"
                       className="w-full p-3 pl-10 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </InputField>
          )}
        </FormSection>

        <FormSection title="Требования к волонтерам">
          <InputField label="Количество волонтеров">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Users
                className="w-5 h-5 text-gray-400"/></span>
              <input type="number" value={volunteerCount} onChange={e => setVolunteerCount(e.target.value)}
                     placeholder="10"
                     className="w-full p-3 pl-10 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </InputField>
          <InputField label="Требования">
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={3}
                      placeholder="Например: возраст 18+, удобная одежда"
                      className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </InputField>
          <InputField label="Что получат волонтеры">
            <textarea value={rewards} onChange={e => setRewards(e.target.value)} rows={3}
                      placeholder="Например: +50 кармы, +3 часа добра"
                      className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </InputField>
        </FormSection>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100 z-30">
        <div className="flex items-stretch space-x-2">
          <button
            className="bg-gray-200 text-gray-800 font-semibold px-4 rounded-xl hover:bg-gray-300 flex items-center justify-center">
            <span className="text-center text-sm leading-tight">Сохранить<br/>в<br/>черновик</span>
          </button>
          <button className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-400">
            Предпросмотр
          </button>
          <button
            onClick={handlePublish}
            disabled={!isFormValid}
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            Опубликовать
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CreateEventPage;
