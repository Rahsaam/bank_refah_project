import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, deletePost } from '../../api/posts';
import { fetchComments, deleteComment } from '../../api/comments';
import GenericCRUDTable from '../common/GenericCRUDTable';

type SubtabType = 'posts' | 'comments';

const ContentTab = () => {
  const [activeSubtab, setActiveSubtab] = useState<SubtabType>('posts');


  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });


  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  const columns = {
    posts: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'عنوان' },
      { key: 'body', label: 'محتوا', render: (value: string) => value.substring(0, 50) + '...' },
    ],
    comments: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'نام' },
      { key: 'email', label: 'ایمیل' },
      { key: 'body', label: 'متن', render: (value: string) => value.substring(0, 50) + '...' },
    ],
  };

  const subtabs = [
    { id: 'posts', label: 'پست‌ها' },
    { id: 'comments', label: 'کامنت‌ها' },
  ];

  return (
    <div>
      {/* زیرتب‌ها */}
      <div className="flex gap-2 border-b mb-4">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubtab(tab.id as SubtabType)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeSubtab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوای زیرتب فعال */}
      {activeSubtab === 'posts' && (
        <GenericCRUDTable
          title="مدیریت پست‌ها"
          data={posts}
          columns={columns.posts}
          deleteFn={deletePost}
          queryKey="posts"
          isLoading={postsLoading}
          onView={(post) => alert(`پست: ${post.title}\n${post.body}`)}
          onEdit={(post) => alert(`ویرایش پست ${post.id} (در حال توسعه)`)}
          onCreate={() => alert('افزودن پست جدید (در حال توسعه)')}
        />
      )}

      {activeSubtab === 'comments' && (
        <GenericCRUDTable
          title="مدیریت کامنت‌ها"
          data={comments}
          columns={columns.comments}
          deleteFn={deleteComment}
          queryKey="comments"
          isLoading={commentsLoading}
          onView={(comment) => alert(`کامنت: ${comment.name}\n${comment.body}`)}
          onEdit={(comment) => alert(`ویرایش کامنت ${comment.id} (در حال توسعه)`)}
          onCreate={() => alert('افزودن کامنت جدید (در حال توسعه)')}
        />
      )}
    </div>
  );
};

export default ContentTab;