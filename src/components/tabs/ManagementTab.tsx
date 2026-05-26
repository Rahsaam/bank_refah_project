import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers, deleteUser } from '../../api/users';
import { fetchTodos, deleteTodo } from '../../api/todos';
import GenericCRUDTable from '../common/GenericCRUDTable';

type SubtabType = 'todos' | 'users';

const ManagementTab = () => {
  const [activeSubtab, setActiveSubtab] = useState<SubtabType>('todos');

  const { data: todos = [], isLoading: todosLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const columns = {
    todos: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'عنوان' },
      { 
        key: 'completed', 
        label: 'وضعیت',
        render: (value: boolean) => (
          <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {value ? 'انجام شده' : 'انجام نشده'}
          </span>
        )
      },
    ],
    users: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'نام' },
      { key: 'email', label: 'ایمیل' },
      { key: 'phone', label: 'تلفن' },
    ],
  };

  const subtabs = [
    { id: 'todos', label: 'کارهای روزمره' },
    { id: 'users', label: 'کاربران' },
  ];

  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubtab(tab.id as SubtabType)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeSubtab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubtab === 'todos' && (
        <GenericCRUDTable
          title="مدیریت کارهای روزمره"
          data={todos.slice(0, 20)}
          columns={columns.todos}
          deleteFn={deleteTodo}
          queryKey="todos"
          isLoading={todosLoading}
        />
      )}

      {activeSubtab === 'users' && (
        <GenericCRUDTable
          title="مدیریت کاربران"
          data={users}
          columns={columns.users}
          deleteFn={deleteUser}
          queryKey="users"
          isLoading={usersLoading}
        />
      )}
    </div>
  );
};

export default ManagementTab;