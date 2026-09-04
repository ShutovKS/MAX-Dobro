// FILE: frontend/src/app/organization/events/create/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Create or edit an organizer event with map, rewards, and publish.
//   SCOPE: Form fields, map pick, reward presets, publish payload
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES, M-FRONTEND-TELEGRAM
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CreateEventPage - create and edit event form
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useState} from 'react';
import type {Course, EventCreatePayload, OrganizationEvent, User} from '../../../../lib/types';
import {fetchAllCourses, fetchOrganizationEvents} from '../../../../lib/api';
import {parseRuDateToDateTimeLocal} from '../../../../lib/dateUtils';
import {ArrowLeft, Camera, MapPin, Sparkles, Clock, Users} from 'lucide-react';
import {DEFAULT_MAP_CENTER, EVENT_CATEGORIES, EVENT_REWARD_PRESETS} from '../../../../lib/constants';
import InteractiveMap from '../../../../components/ui/InteractiveMap';
import {tgHaptic} from '../../../../lib/telegram-sdk';

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
  user: User;
  event?: OrganizationEvent | null;
  onBack: () => void;
  onPublish: (data: EventCreatePayload) => void;
}

// START_CONTRACT: CreateEventPage
//   PURPOSE: Collect event fields and publish via onPublish
//   INPUTS: { user: User; event?: OrganizationEvent | null; onBack: () => void; onPublish: (data: EventCreatePayload) => void }
//   OUTPUTS: { ReactElement - event form }
//   SIDE_EFFECTS: fetchAllCourses, fetchOrganizationEvents, haptic
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-createEvent, fn-updateEvent
// END_CONTRACT: CreateEventPage
const CreateEventPage: React.FC<CreateEventPageProps> = ({user, event, onBack, onPublish}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(parseRuDateToDateTimeLocal(event?.date));
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<'Офлайн' | 'Онлайн'>('Офлайн');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [volunteerCount, setVolunteerCount] = useState(event?.capacity ? event.capacity.toString() : '10');
  const [requirements, setRequirements] = useState('');
  // Бонусы — кнопками (наша интеграция), а не свободным текстом.
  const [karmaPoints, setKarmaPoints] = useState<number>(50);
  const [durationHours, setDurationHours] = useState<number>(3);
  const [recommendedCourseId, setRecommendedCourseId] = useState<number | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // START_BLOCK_LOAD_EVENT_FORM
  useEffect(() => {
    fetchAllCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

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
  // END_BLOCK_LOAD_EVENT_FORM

  const handlePickPoint = (lat: number, lng: number) => {
    setCoords({lat, lng});
    if (!address) setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    tgHaptic.selection();
  };

  const isFormValid = title && category && description && startDate && (format === 'Онлайн' || address);

  // START_BLOCK_PUBLISH_EVENT
  const handlePublish = () => {
    if (!isFormValid) return;
    const payload: EventCreatePayload = {
      title,
      description,
      date: new Date(startDate).toISOString(),
      location: format === 'Онлайн' ? 'Онлайн' : address,
      maxParticipants: volunteerCount ? parseInt(volunteerCount, 10) : undefined,
      category: category || undefined,
      requirements: requirements || undefined,
      latitude: format === 'Офлайн' ? coords?.lat : undefined,
      longitude: format === 'Офлайн' ? coords?.lng : undefined,
      karmaPoints,
      durationHours,
      recommendedCourseId: recommendedCourseId ?? undefined,
    };
    onPublish(payload);
  };
  // END_BLOCK_PUBLISH_EVENT

  const PresetGroup: React.FC<{
    label: string;
    Icon: React.FC<any>;
    options: number[];
    value: number;
    onChange: (v: number) => void;
    suffix?: string;
  }> = ({label, Icon, options, value, onChange, suffix}) => (
    <InputField label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => { onChange(opt); tgHaptic.selection(); }}
            className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${value === opt ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}
          >
            <Icon className="w-4 h-4" />
            {opt}{suffix ? ` ${suffix}` : ''}
          </button>
        ))}
      </div>
    </InputField>
  );

  // START_BLOCK_RENDER_EVENT_FORM
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
            <InputField label="Адрес* — отметьте точку на карте">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><MapPin
                  className="w-5 h-5 text-gray-400"/></span>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                       placeholder="Нажмите на карту или введите адрес"
                       className="w-full p-3 pl-10 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div className="mt-2 h-56 rounded-xl overflow-hidden border border-gray-200">
                <InteractiveMap
                  markers={[]}
                  onMarkerClick={() => {}}
                  center={coords ? [coords.lat, coords.lng] : DEFAULT_MAP_CENTER}
                  zoom={coords ? 14 : 10}
                  onMapClick={handlePickPoint}
                  pickedPosition={coords ? [coords.lat, coords.lng] : null}
                />
              </div>
              {coords && (
                <p className="text-xs text-gray-500 mt-1">
                  Координаты: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
              )}
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
        </FormSection>

        <FormSection title="Что получат волонтеры">
          <PresetGroup
            label="Карма за участие"
            Icon={Sparkles}
            options={EVENT_REWARD_PRESETS.karma}
            value={karmaPoints}
            onChange={setKarmaPoints}
          />
          <PresetGroup
            label="Часы добра"
            Icon={Clock}
            options={EVENT_REWARD_PRESETS.hours}
            value={durationHours}
            onChange={setDurationHours}
            suffix="ч"
          />
          <InputField label="Сертификат курса по завершении (необязательно)">
            <select
              value={recommendedCourseId ?? ''}
              onChange={(e) => setRecommendedCourseId(e.target.value ? parseInt(e.target.value, 10) : null)}
              className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Без сертификата</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
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
  // END_BLOCK_RENDER_EVENT_FORM
};

export default CreateEventPage;
