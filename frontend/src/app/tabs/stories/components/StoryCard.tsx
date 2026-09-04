// FILE: frontend/src/app/tabs/stories/components/StoryCard.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Feed card for a volunteer story with like, comments, and event link.
//   SCOPE: Optimistic like toggle, navigation to story and event detail
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   StoryCard - stories feed card with like and comment actions
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import type {Story} from '../../../../lib/types';
import {likeStory, unlikeStory} from '../../../../lib/api';
import {Heart, MessageSquare, Upload} from 'lucide-react';

// START_CONTRACT: StoryCard
//   PURPOSE: Render a story preview and toggle like against the API
//   INPUTS: { story: Story }
//   OUTPUTS: { ReactElement - story card }
//   SIDE_EFFECTS: likeStory/unlikeStory; navigates to story or event
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-likeStory
// END_CONTRACT: StoryCard
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

  // START_BLOCK_TOGGLE_LIKE
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
  // END_BLOCK_TOGGLE_LIKE

  // START_BLOCK_RENDER_STORY_CARD
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
  // END_BLOCK_RENDER_STORY_CARD
});

export default StoryCard;
