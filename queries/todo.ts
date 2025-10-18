import { apiClient } from "@/lib/api";
import type { ApiResponse, ListContent } from "@/lib/type";
import type {
  Todo,
  CreateTodoSchema,
  UpdateTodoSchema,
} from "@/schemas/todoSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getTodos = async (): Promise<ApiResponse<ListContent<Todo>>> => {
  // Langsung ambil properti 'data' dari hasil await
  return await apiClient.get("/todos");
};
const createTodo = async (
  todo: CreateTodoSchema
): Promise<ApiResponse<Todo>> => {
  return await apiClient.post("/todos", todo);
};

const updateTodo = async ({
  todoId,
  action,
}: {
  todoId: string;
  action: UpdateTodoSchema;
}): Promise<ApiResponse<Todo>> => {
  // Mengirim patch ke /todo/:id dengan body { completed: true/false }
  return await apiClient.put(`/todos/${todoId}/mark`, action);
};

const deleteTodo = async (todoId: string): Promise<ApiResponse<any>> => {
  return await apiClient.delete(`/todos/${todoId}`);
};

// --- React Query Keys ---

export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  detail: (todoId: string) => [...todoKeys.all, "detail", todoId] as const,
};

// --- React Query Hooks ---

export const useGetTodos = () => {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: getTodos,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Saat berhasil membuat, data 'lists' sudah tidak valid, fetch ulang
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

// Hook untuk "mark done/undone"
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (data, variables) => {
      // `variables` berisi { todoId, todoData }
      // Saat berhasil update, fetch ulang 'lists'
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });

      // Dan perbarui cache 'detail' secara manual
      queryClient.setQueryData(todoKeys.detail(variables.todoId), data);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // Saat berhasil menghapus, fetch ulang 'lists'
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};
