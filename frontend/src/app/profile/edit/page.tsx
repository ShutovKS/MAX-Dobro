import React, {useEffect, useRef, useState} from 'react';
import type {User} from '../../../lib/types';
import {Camera, Loader2} from 'lucide-react';
import {uploadImage} from '../../../lib/upload';

const EditProfilePage: React.FC<{
  user: User;
  onCancel: () => void;
  onSave: (updatedUser: User) => void;
}> = ({user, onCancel, onSave}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about,
  });
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [isChanged, setIsChanged] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hasChanged = formData.firstName !== user.firstName ||
      formData.lastName !== user.lastName ||
      formData.about !== user.about ||
      avatar !== user.avatarUrl;
    setIsChanged(hasChanged);
  }, [formData, avatar, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSave = () => {
    if (isChanged) {
      onSave({...user, ...formData, avatarUrl: avatar});
    }
  };

  const handleChangePhotoClick = () => {
    setUploadError('');
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError('');
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setAvatar(url);
    } catch (err: any) {
      setUploadError(err.message || 'Не удалось загрузить фото');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between">
        <button onClick={onCancel} className="text-lg font-medium text-[#007AFF]">Отмена</button>
        <h1 className="text-lg font-bold text-[#0C0D0E]">Редактирование</h1>
        <button
          onClick={handleSave}
          disabled={!isChanged}
          className={`text-lg font-bold ${isChanged ? 'text-[#007AFF]' : 'text-gray-400'}`}
        >
          Готово
        </button>
      </header>

      <main className="flex-grow overflow-y-auto pt-8 space-y-8 pb-8">
        <section className="flex flex-col items-center">
          <div className="relative mb-2">
            <img src={avatar} alt="User Avatar" className="w-28 h-28 rounded-full shadow-lg object-cover"/>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin"/>
              </div>
            )}
          </div>
          <button onClick={handleChangePhotoClick} disabled={isUploading}
                  className="flex items-center space-x-2 text-lg font-medium text-[#007AFF] disabled:opacity-60">
            <Camera className="w-5 h-5"/>
            <span>{isUploading ? 'Загрузка…' : 'Изменить фото'}</span>
          </button>
          {uploadError && (
            <p className="text-red-600 text-sm mt-2">{uploadError}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
          />
        </section>

        <section>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mx-4">
            <div className="p-4">
              <label htmlFor="firstName" className="text-xs text-gray-500">Имя</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-transparent text-lg text-[#0C0D0E] focus:outline-none"
              />
            </div>
            <div className="p-4">
              <label htmlFor="lastName" className="text-xs text-gray-500">Фамилия</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-transparent text-lg text-[#0C0D0E] focus:outline-none"
              />
            </div>
            <div className="p-4">
              <label htmlFor="about" className="text-xs text-gray-500">О себе</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent text-lg text-[#0C0D0E] focus:outline-none resize-none"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditProfilePage;