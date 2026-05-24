import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';


// ساخته شدن QueryClient با تنظیمات پیشفرض
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقیقه دادهfresh بمونه
      refetchOnWindowFocus: false, // وقتی کاربر تب رو عوض میکنه دوباره fetch نکنه
      retry: 1, // فقط یک بار تلاش مجدد
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
