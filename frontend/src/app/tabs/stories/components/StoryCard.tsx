import React from 'react';
import type {Story} from '../../../../lib/types';
import {ChatBubbleLeftRightIcon, HeartIcon, ShareIcon} from '../../../../components/ui/icons';

const StoryCard: React.FC<{
  story: Story;
}> = React.memo(({story}) => {

  const onSelectEvent = (id: number) => {
    window.location.hash = `#/events/${id}`;
  };

  const onSelectStory = (id: number) => {
    window.location.hash = `#/stories/${id}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg mx-auto">
      <div className="p-4 cursor-pointer" onClick={() => onSelectStory(story.id)}>
        {/* Header */}
        <div className="flex items-center mb-3">
          <img src={story.author.avatarUrl} alt={story.author.name} className="w-10 h-10 rounded-full"/>
          <div className="ml-3">
            <p className="font-bold text-[#0C0D0E] text-sm">{story.author.name}</p>
            <p className="text-xs text-[rgb(12,13,14,0.52)]">{story.timestamp}</p>
          </div>
        </div>

        {/* Context */}
        <p className="text-sm text-[rgb(12,13,14,0.52)] mb-2">
          поделился(-ась) историей с события{" "}
          <button onClick={(e) => {
            e.stopPropagation();
            onSelectEvent(story.event.id);
          }} className="font-semibold text-[#007AFF] hover:underline text-left">
            «{story.event.name}»
          </button>
        </p>

        {/* Text */}
        <p className="text-[#0C0D0E] text-sm mb-3 leading-relaxed">
          {story.text}
        </p>

        {/* Media */}
        <div className="mb-3">
          <img src={story.imageUrl} alt="Story visual" className="w-full rounded-lg object-cover"/>
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-between items-center text-[rgb(12,13,14,0.52)] p-4 pt-0"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-1.5 hover:text-[#FF303C]">
            <HeartIcon className="w-6 h-6"/>
            <span className="font-semibold text-sm">{story.likes}</span>
          </button>
          <button className="flex items-center space-x-1.5 hover:text-[#007AFF]">
            <ChatBubbleLeftRightIcon className="w-6 h-6"/>
            <span className="font-semibold text-sm">{story.comments}</span>
          </button>
        </div>
        <button className="hover:text-[#007AFF]">
          <ShareIcon className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
});

export default StoryCard;
