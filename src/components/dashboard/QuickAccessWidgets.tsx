import { Users, MessageSquare, Image } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../api/products";
import { fetchComments } from "../../api/comments";
import { fetchPosts } from "../../api/posts";
import { fetchAlbums } from "../../api/albums";
import { useAuth } from "../../hooks/useAuth";
import Widget from "./Widget";
import AdminWidget from "./AdminWidget";
import { fetchUsers } from "../../api/users";

const QuickAccessWidgets = () => {
  const { hasPermission } = useAuth();


  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });


  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });


  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });


  const {
    data: albums = [],
    isLoading: albumsLoading,
    error: albumsError,
  } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  
  const {
    data: photos = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["photos"],
    queryFn: fetchUsers,
  });

  // دسترسی افزودن محصول (Admin یا Editor)
  const canCreateProduct = hasPermission("create");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminWidget
        productCount={products.length}
        hasCreatePermission={canCreateProduct}
        isLoading={isLoading}
        error={error}
      />

      <Widget
        title="کاربران"
        value={10}
        icon={Users}
        linkTo="/tabs?tab=management&subtab=users"
        isLoading={usersLoading}
        error={usersError}
        linkText="مدیریت کاربران"
        color="bg-green-500"
      />

      <Widget
        title="محتوا"
        value={posts.length + comments.length}
        icon={MessageSquare}
        linkTo="/tabs?tab=content&subtab=posts"
        isLoading={postsLoading}
        error={postsError}
        linkText="مدیریت محتوا"
        color="bg-purple-500"
      />

      <Widget
        title="رسانه"
        value={albums.length + photos.length}
        icon={Image}
        linkTo="/tabs?tab=media&subtab=photos"
        isLoading={albumsLoading}
        error={albumsError}
        linkText="مدیریت رسانه"
        color="bg-orange-500"
      />
    </div>
  );
};

export default QuickAccessWidgets;
