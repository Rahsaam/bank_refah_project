import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { Pencil, Trash2, Eye } from "lucide-react";
import type { IGenericCRUDTableProps } from "../../types";
import toast from "react-hot-toast";

const GenericCRUDTable = ({
  title,
  data,
  columns,
  deleteFn,
  // onCreate,
  onEdit,
  onView,
  queryKey,
  isLoading,
  //  hideCreateButton = false,
  customCreateButton,
}: IGenericCRUDTableProps) => {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("آیتم با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطا در حذف آیتم");
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("آیا از حذف این آیتم مطمئن هستید؟")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">در حال بارگذاری...</div>;
  }

  console.log("data", data);
  console.log("columns", columns);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">{title}</h3>
        {/* اگه hideCreateButton true باشه، دکمه پیش‌فرض نمایش داده نمیشه */}
        {/* {!hideCreateButton && hasPermission("create") && onCreate && (
          <button
            onClick={onCreate}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600"
          >
            <Plus size={16} /> افزودن جدید
          </button>
        )} */}
        {/* دکمه سفارشی (برای مواردی که میخوایم مودال مخصوص خودش رو داشته باشه) */}
        {customCreateButton}
      </div>

      {/* نمایش جدول در دسکتاپ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 text-right text-sm font-medium text-gray-600"
                >
                  {col.label}
                </th>
              ))}
              <th className="p-3 text-right text-sm font-medium text-gray-600">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {columns.map((col) => (
                  <td key={col.key} className="p-3 text-sm">
                    {col.render
                      ? col.render(item[col.key], item)
                      : item[col.key]}
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {hasPermission("edit") && onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    {hasPermission("delete") && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نمایش کارتی در موبایل */}
      <div className="md:hidden divide-y">
        {data.map((item) => (
          <div key={item.id} className="p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between py-1">
                <span className="text-gray-500 text-sm">{col.label}:</span>
                <span className="text-sm text-left w-44 mr-auto">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </span>
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-3 pt-2">
              {onView && (
                <button
                  onClick={() => onView(item)}
                  className="text-blue-500 text-sm"
                >
                  <Eye size={18} />
                </button>
              )}
              {hasPermission("edit") && onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="text-yellow-500 text-sm"
                >
                  <Pencil size={18} />
                </button>
              )}
              {hasPermission("delete") && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 text-sm"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          هیچ داده‌ای یافت نشد
        </div>
      )}
    </div>
  );
};

export default GenericCRUDTable;
