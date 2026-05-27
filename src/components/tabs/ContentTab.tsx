import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, deletePost } from "../../api/posts";
import { fetchComments, deleteComment } from "../../api/comments";
import GenericCRUDTable from "../common/GenericCRUDTable";
import { useEffect, useState } from "react";
import PostFormModal from "../common/PostFormModal";
import { Plus } from "lucide-react";
import CommentFormModal from "../common/CommentFormModal";

type SubtabType = "posts" | "comments";

interface ContentTabProps {
  initialSubtab?: string;
}

const ContentTab = ({ initialSubtab }: ContentTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedCommentId, setselectedCommentId] = useState<number | null>(null);
  const [isCreateCommentModalOpen, setCreateIsCommentModalOpen] =useState(false);
  const [isCreatePostModalOpen, setCreateIsPostModalOpen] = useState(false);

  console.log(isCreateCommentModalOpen, isCreatePostModalOpen);
  
  const activeSubtab: SubtabType =
    initialSubtab === "comments" ? "comments" : "posts";

  useEffect(() => {
    if (!searchParams.get("subtab")) {
      setSearchParams({
        tab: "content",
        subtab: "posts",
      });
    }
  }, [searchParams, setSearchParams]);

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  const handleSubtabChange = (subtabId: SubtabType) => {
    setSearchParams({
      tab: "content",
      subtab: subtabId,
    });
  };

  const columns = {
    posts: [
      { key: "id", label: "ID" },
      { key: "title", label: "عنوان" },
      {
        key: "body",
        label: "محتوا",
        render: (value: string) => value.substring(0, 50) + "...",
      },
    ],
    comments: [
      { key: "id", label: "ID" },
      { key: "name", label: "نام" },
      { key: "email", label: "ایمیل" },
      {
        key: "body",
        label: "متن",
        render: (value: string) => value.substring(0, 50) + "...",
      },
    ],
  };

  const subtabs = [
    { id: "posts", label: "پست‌ها" },
    { id: "comments", label: "کامنت‌ها" },
  ];

  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSubtabChange(tab.id as SubtabType)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeSubtab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubtab === "posts" && (
        <GenericCRUDTable
          title="مدیریت پست‌ها"
          data={posts}
          columns={columns.posts}
          deleteFn={deletePost}
          queryKey="posts"
          isLoading={postsLoading}
          onView={(post) => alert(`پست: ${post.title}\n${post.body}`)}
          onEdit={(post) => {
            setIsPostModalOpen(true);
            setSelectedPostId(post.id);
          }}
          onCreate={() => {
            setCreateIsPostModalOpen(true);
            setSelectedPostId(null);
          }}
          hideCreateButton={true}
          customCreateButton={
            <button
              onClick={() => {
                setSelectedPostId(null);
                setIsPostModalOpen(true);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600"
            >
              <Plus size={16} /> افزودن پست جدید
            </button>
          }
        />
      )}

      {activeSubtab === "comments" && (
        <GenericCRUDTable
          title="مدیریت کامنت‌ها"
          data={comments}
          columns={columns.comments}
          deleteFn={deleteComment}
          queryKey="comments"
          isLoading={commentsLoading}
          onView={(comment) => alert(`کامنت: ${comment.name}\n${comment.body}`)}
          onEdit={(comment) => {
            setIsCommentModalOpen(true);
            setselectedCommentId(comment.id);
          }}
          onCreate={() => {
            setCreateIsCommentModalOpen(true);
            setselectedCommentId(null);
          }}
          hideCreateButton={true}
          customCreateButton={
            <button
              onClick={() => {
                setselectedCommentId(null);
                setIsCommentModalOpen(true);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600"
            >
              <Plus size={16} /> افزودن کامنت جدید
            </button>
          }
        />
      )}

      {isPostModalOpen && (
        <PostFormModal
          postId={selectedPostId}
          onClose={() => {
            setIsPostModalOpen(false);
            setSelectedPostId(null);
          }}
        />
      )}

      {isCommentModalOpen && (
        <CommentFormModal
          commentId={selectedCommentId}
          onClose={() => {
            setIsCommentModalOpen(false);
            setselectedCommentId(null);
          }}
        />
      )}
    </div>
  );
};

export default ContentTab;
