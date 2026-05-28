import { useQuery } from "@tanstack/react-query";
import { fetchUsers, deleteUser } from "../../api/users";
import { fetchTodos, deleteTodo } from "../../api/todos";
import GenericCRUDTable from "../common/GenericCRUDTable";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import TodoFormModal from "../modals/TodoFormModal";
import UserFormModal from "../modals/UserFormModal";

type SubtabType = "todos" | "users";

interface ManagementTabProps {
  initialSubtab?: string;
}

const ManagementTab = ({ initialSubtab }: ManagementTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  

  const activeSubtab: SubtabType =
    initialSubtab === "users" ? "users" : "todos";

  useEffect(() => {
    if (!searchParams.get("subtab")) {
      setSearchParams({
        tab: "management",
        subtab: "todos",
      });
    }
  }, [searchParams, setSearchParams]);

  const { data: todos = [], isLoading: todosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const handleSubtabChange = (subtabId: SubtabType) => {
    setSearchParams({
      tab: "management",
      subtab: subtabId,
    });
  };

  const columns = {
    todos: [
      { key: "id", label: "ID" },
      { key: "title", label: "عنوان" },
      {
        key: "completed",
        label: "وضعیت",
        render: (value: boolean) => (
          <span
            className={`px-2 py-1 rounded text-xs ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {value ? "انجام شده" : "انجام نشده"}
          </span>
        ),
      },
    ],
    users: [
      { key: "id", label: "ID" },
      { key: "name", label: "نام" },
      { key: "email", label: "ایمیل" },
      { key: "phone", label: "تلفن" },
    ],
  };

  const subtabs = [
    { id: "todos", label: "کارهای روزمره" },
    { id: "users", label: "کاربران" },
  ];

  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSubtabChange(tab.id as SubtabType)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeSubtab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubtab === "todos" && (
        <GenericCRUDTable
          title="مدیریت کارهای روزمره"
          data={todos.slice(0, 20)}
          columns={columns.todos}
          deleteFn={deleteTodo}
          queryKey="todos"
          isLoading={todosLoading}
          onEdit={(todo) => {
            setIsTodoModalOpen(true);
            setSelectedTodoId(todo.id);
          }}
          onCreate={() => {
            setIsTodoModalOpen(true);
            setSelectedTodoId(null);
          }}
          hideCreateButton={true}
          customCreateButton={
            <button
              onClick={() => {
                setSelectedTodoId(null);
                setIsTodoModalOpen(true);
              }}
              className="bg-blue-500 text-white px-3 rounded-lg sm:text-sm flex items-center gap-1 sm:py-1 py-2 text-xs hover:bg-blue-600"
            >
              <Plus size={16} /> افزودن کار روزمره جدید
            </button>
          }
        />
      )}

      {activeSubtab === "users" && (
        <GenericCRUDTable
          title="مدیریت کاربران"
          data={users}
          columns={columns.users}
          deleteFn={deleteUser}
          queryKey="users"
          isLoading={usersLoading}
          onEdit={(user) => {
            setIsUserModalOpen(true);
            setSelectedUserId(user.id);
          }}
          onCreate={() => {
            setIsUserModalOpen(true);
            setSelectedUserId(null);
          }}
          hideCreateButton={true}
          customCreateButton={
            <button
              onClick={() => {
                setSelectedUserId(null);
                setIsUserModalOpen(true);
              }}
              className="bg-blue-500 text-white px-3 rounded-lg sm:text-sm flex items-center gap-1 sm:py-1 py-2 text-xs hover:bg-blue-600"
            >
              <Plus size={16} /> افزودن کاربر جدید
            </button>
          }
        />
      )}
      {isTodoModalOpen && (
        <TodoFormModal
          todoId={selectedTodoId}
          onClose={() => {
            setIsTodoModalOpen(false);
            setSelectedTodoId(null);
          }}
        />
      )}

      {isUserModalOpen && (
        <UserFormModal
          userId={selectedUserId}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default ManagementTab;
