// FILE: frontend/src/app/tabs/stories/detail/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Story detail with like, comments, share, and event link.
//   SCOPE: Load story, toggle like, post comment, share deep link
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES, M-FRONTEND-TELEGRAM
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   StoryDetailPage - story detail and comments
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {createStoryComment, fetchStoryById, likeStory, unlikeStory} from '../../../../lib/api';
import type {Comment, Story} from '../../../../lib/types';
import {ArrowLeft, Heart, MessageSquare, MoreHorizontal, Upload} from 'lucide-react';
import {buildDeepLink, tgShareUrl} from '../../../../lib/telegram-sdk';
import {ArticleSkeleton} from '../../../../components/ui/Skeletons';


const CommentView: React.FC<{ comment: Comment }> = ({comment}) => (
  <div className="flex items-start space-x-3">
    <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-10 h-10 rounded-full"/>
    <div className="flex-1">
      <div className="bg-gray-100 rounded-2xl p-3">
        <div className="flex items-baseline space-x-2">
          <p className="font-semibold text-sm text-[#0C0D0E]">{comment.author.name}</p>
          <p className="text-xs text-gray-500">{comment.timestamp}</p>
        </div>
        <p className="text-sm text-[#0C0D0E] mt-1">{comment.text}</p>
      </div>
    </div>
  </div>
);

// START_CONTRACT: StoryDetailPage
//   PURPOSE: Load a story and handle like, comment, and share
//   INPUTS: { id: number; currentUserAvatar: string }
//   OUTPUTS: { ReactElement - story detail }
//   SIDE_EFFECTS: fetchStoryById, likeStory, unlikeStory, createStoryComment
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-fetchStoryById, fn-createStoryComment
// END_CONTRACT: StoryDetailPage
const StoryDetailPage: React.FC<{
  id: number;
  currentUserAvatar: string;
}> = ({id, currentUserAvatar}) => {
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // START_BLOCK_LOAD_STORY
    const loadStory = async () => {
      setLoading(true);
      const data = await fetchStoryById(id);
      if (data) {
        setStory(data);
        setComments(data.commentsData);
        setLikes(data.likes);
        setIsLiked(data.isLiked ?? false);
      }
      setLoading(false);
    };
    loadStory();
  }, [id]);
    // END_BLOCK_LOAD_STORY

  const onBack = () => navigate('/app/stories');
  const onSelectEvent = (eventId: number) => navigate(`/app/events/${eventId}`);

  // START_BLOCK_STORY_ACTIONS
  const handleToggleLike = async () => {
    if (!story) return;
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

  const handlePostComment = async () => {
    if (!newComment.trim() || !story) return;
    const text = newComment.trim();
    setNewComment('');
    // Оптимистично показываем, затем заменяем на серверный коммент (с реальным id).
    const optimistic: Comment = {
      id: Date.now(),
      author: {name: 'Вы', avatarUrl: currentUserAvatar},
      timestamp: 'только что',
      text,
    };
    setComments(prev => [...prev, optimistic]);
    try {
      const saved = await createStoryComment(story.id, text);
      setComments(prev => prev.map(c => (c.id === optimistic.id ? saved : c)));
    } catch (e) {
      console.error('Failed to post comment:', e);
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
      setNewComment(text);
    }
  };
  // END_BLOCK_STORY_ACTIONS

  if (loading || !story) {
    return <ArticleSkeleton />;
  }

  // START_BLOCK_RENDER_STORY_DETAIL
  return (
    <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Назад">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-lg font-bold text-[#0C0D0E]">История</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Действия">
          <MoreHorizontal className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="p-4 flex items-center">
          <img src={story.author.avatarUrl} alt={story.author.name} className="w-12 h-12 rounded-full"/>
          <div className="ml-3">
            <p className="font-bold text-[#0C0D0E]">{story.author.name}</p>
            <p className="text-sm text-[rgb(12,13,14,0.52)]">{story.timestamp}</p>
          </div>
        </div>

        <img src={story.imageUrl} alt="Story visual" className="w-full object-cover"/>

        <div className="p-4">
          <p className="text-[#0C0D0E] leading-relaxed whitespace-pre-line">{story.text}</p>
        </div>

        <div className="px-4 pb-2">
          <button onClick={() => onSelectEvent(story.event.id)}
                  className="inline-block bg-gray-100 rounded-lg p-3 w-full text-left hover:bg-gray-200 transition-colors">
            <p className="text-sm text-[rgb(12,13,14,0.52)]">
              История с события <span className="font-semibold text-[#007AFF]">«{story.event.name}»</span>
            </p>
          </button>
        </div>

        <div className="flex justify-between items-center text-[rgb(12,13,14,0.52)] p-4 border-y border-gray-100">
          <div className="flex items-center space-x-6">
            <button onClick={handleToggleLike} className="flex items-center space-x-1.5 hover:text-[#FF303C]">
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current text-[#FF303C]' : ''}`}/>
              <span className="font-semibold text-sm">{likes}</span>
            </button>
            <div className="flex items-center space-x-1.5">
              <MessageSquare className="w-6 h-6"/>
              <span className="font-semibold text-sm">{comments.length}</span>
            </div>
          </div>
          <button onClick={() => tgShareUrl(buildDeepLink('story', id), 'История из Добро Club')}
                  className="hover:text-[#007AFF]">
            <Upload className="w-6 h-6"/>
          </button>
        </div>

        <section className="p-4 space-y-4">
          <h2 className="font-bold text-[#0C0D0E]">Комментарии ({comments.length})</h2>
          {comments.length > 0 ? (
            comments.map(comment => <CommentView key={comment.id} comment={comment}/>)
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Станьте первым, кто прокомментирует эту историю!</p>
            </div>
          )}
        </section>
        <div className="h-24"></div>
      </main>

      <footer className="flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-t border-gray-200 sticky bottom-0 z-20">
        <div className="flex items-center space-x-3">
          <img src={currentUserAvatar} alt="Ваш аватар" className="w-10 h-10 rounded-full"/>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
            placeholder="Ваш комментарий..."
            className="flex-grow bg-gray-100 border-transparent rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handlePostComment}
            disabled={!newComment.trim()}
            className="text-sm font-semibold text-[#007AFF] disabled:text-gray-400 px-3"
          >
            Отправить
          </button>
        </div>
      </footer>
    </div>
  );
  // END_BLOCK_RENDER_STORY_DETAIL
};

export default StoryDetailPage;
