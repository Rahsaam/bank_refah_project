import { useQuery } from '@tanstack/react-query';
import axiosInstance from './services/axios';
import './index.css'

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axiosInstance.get('/posts?_limit=5');
  return data;
};

function App() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div className="text-center p-8">در حال بارگذاری...</div>;
  if (error) return <div className="text-center p-8 text-red-500">خطا در دریافت داده‌ها</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="text-right">
        <h1 className="text-blue-600 mb-4">
          تست API با React Query
        </h1>
        <div className="space-y-4">
          {posts?.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-600">{post.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;