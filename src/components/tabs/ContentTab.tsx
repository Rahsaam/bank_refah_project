import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, deletePost } from "../../api/posts";
import { fetchComments, deleteComment } from "../../api/comments";
import GenericCRUDTable from "../common/GenericCRUDTable";
import { useEffect, useState } from "react";
import EditPostModal from "../common/EditPostModal";
import EditCommentModal from "../common/EditCommentModal";

type SubtabType = "posts" | "comments";

interface ContentTabProps {
  initialSubtab?: string;
}

const ContentTab = ({ initialSubtab }: ContentTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPostId, setselectedPostId] = useState<number | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedCommentId, setselectedCommentId] = useState<number | null>(
    null,
  );

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
            setIsEditModalOpen(true);
            setselectedPostId(post.id);
          }}
          onCreate={() => alert("افزودن پست جدید (در حال توسعه)")}
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
          onCreate={() => alert("افزودن کامنت جدید (در حال توسعه)")}
        />
      )}

      {isEditModalOpen && selectedPostId !== null && (
        <EditPostModal
          postId={selectedPostId}
          onClose={() => {
            setIsEditModalOpen(false);
            setselectedPostId(null);
          }}
        />
      )}

      {isCommentModalOpen && selectedCommentId !== null && (
        <EditCommentModal
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
