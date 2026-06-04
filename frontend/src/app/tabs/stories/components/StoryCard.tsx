import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import type {Story} from '../../../../lib/types';
import {likeStory, unlikeStory} from '../../../../lib/api';
import {Heart, MessageSquare, Upload} from 'lucide-react';

const StoryCard: React.FC<{
  story: Story;
}> = React.memo(({story}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(story.likes);
  const [isLiked, setIsLiked] = useState(story.isLiked ?? false);

  const onSelectEvent = (id: number) => {
    navigate(`/app/events/${id}`);
  };

  const onSelectStory = (id: number) => {
    navigate(`/app/stories/${id}`);
  };

  const onToggleLike = async () => {
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikes(prev => Math.max(0, prev + (nextIsLiked ? 1 : -1)));
    try {
      if (nextIsLiked) {
        await likeStory(story.id);
      } else {
        await unlikeStory(story.id);
      }
    } catch {
      setIsLiked(!nextIsLiked);
      setLikes(prev => Math.max(0, prev + (nextIsLiked ? -1 : 1)));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg mx-auto">
      <div className="p-4 cursor-pointer" onClick={() => onSelectStory(story.id)}>
        <div className="flex items-center mb-3">
          <img src={story.author.avatarUrl} alt={story.author.name} className="w-10 h-10 rounded-full"/>
          <div className="ml-3">
            <p className="font-bold text-[#0C0D0E] text-sm">{story.author.name}</p>
            <p className="text-xs text-[rgb(12,13,14,0.52)]">{story.timestamp}</p>
          </div>
        </div>

        <p className="text-sm text-[rgb(12,13,14,0.52)] mb-2">
          поделился(-ась) историей с события{" "}
          <button onClick={(e) => {
            e.stopPropagation();
            onSelectEvent(story.event.id);
          }} className="font-semibold text-[#007AFF] hover:underline text-left">
            «{story.event.name}»
          </button>
        </p>

        <p className="text-[#0C0D0E] text-sm mb-3 leading-relaxed">
          {story.text}
        </p>

        <div className="mb-3">
          <img src={story.imageUrl} alt="Story visual" className="w-full rounded-lg object-cover"/>
        </div>
      </div>
      <div className="flex justify-between items-center text-[rgb(12,13,14,0.52)] p-4 pt-0"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-6">
          <button onClick={onToggleLike} className="flex items-center space-x-1.5 hover:text-[#FF303C]">
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current text-[#FF303C]' : ''}`}/>
            <span className="font-semibold text-sm">{likes}</span>
          </button>
          <button onClick={() => onSelectStory(story.id)} className="flex items-center space-x-1.5 hover:text-[#007AFF]">
            <MessageSquare className="w-6 h-6"/>
            <span className="font-semibold text-sm">{story.comments}</span>
          </button>
        </div>
        <button className="hover:text-[#007AFF]">
          <Upload className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
});

export default StoryCard;
