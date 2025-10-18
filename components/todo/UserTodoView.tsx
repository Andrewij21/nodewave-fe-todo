"use client";

import { useMemo, useState } from "react";
import { Trash2, Check, Loader2, X } from "lucide-react"; // Import Loader2
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  useGetTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "@/queries/todo"; // Impor hook dan tipe
import { toast } from "sonner";
import AppHeader from "../layouts/AppHeader";

export function UserTodoView() {
  // 1. Ganti useState dengan React Query
  const { data: apiResponse, isLoading, isError } = useGetTodos();
  // Ambil data todos, atau array kosong jika belum siap
  const todos = apiResponse?.content.entries || [];
  const [searchQuery, setSearchQuery] = useState("");
  // 2. Siapkan semua hook mutasi
  const { mutate: createTodo, isPending: isCreating } = useCreateTodo();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();
  const filteredTodos = useMemo(() => {
    if (!searchQuery) {
      return todos; // Kembalikan semua jika search kosong
    }
    return todos.filter((todo) =>
      todo.item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todos, searchQuery]);
  // State lokal untuk UI tetap dipertahankan
  const [newTodo, setNewTodo] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 3. Hubungkan handler ke mutasi
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      // Panggil createTodo dengan skema yang benar
      createTodo(
        { item: newTodo },
        {
          onSuccess: () => {
            setNewTodo(""); // Reset input setelah berhasil
          },
        }
      );
    }
  };

  const handleToggleTodo = (id: string) => {
    // Cari todo saat ini untuk mendapatkan status 'completed'-nya
    const toastId = toast.loading("Loading...");
    const todoToToggle = todos.find((t) => t.id === id);
    if (!todoToToggle) return;
    const payload = todoToToggle.isDone ? "UNDONE" : "DONE";
    // Panggil updateTodo dengan skema yang benar
    updateTodo(
      {
        todoId: id,
        action: { action: payload },
      },
      {
        // Argumen 2: Opsi callback
        onSuccess: () => {
          // 3. Jika berhasil, update toast-nya
          toast.success("Todo updated!", { id: toastId });
        },
        onError: (error) => {
          // 4. Jika gagal, update toast-nya
          // (Pastikan 'error' adalah objek Error)
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          toast.error(`Failed: ${errorMessage}`, { id: toastId });
        },
      }
    );
  };
  // 1. Jadikan fungsi ini 'async'
  const handleDeleteSelected = async () => {
    const toastId = toast.loading(`Deleting ${selectedIds.size} items...`);

    try {
      const deletePromises = Array.from(selectedIds).map((id) => {
        return deleteTodo(id);
      });
      await Promise.all(deletePromises);

      toast.success("All items deleted!", { id: toastId });
      setSelectedIds(new Set());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed: ${errorMessage}`, { id: toastId });
    }
  };
  // Handler untuk checkbox (ini murni state UI lokal)
  const handleSelectTodo = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <>
      <AppHeader
        role="USER"
        onSearchChange={setSearchQuery} // <-- Hubungkan ke state
        searchPlaceholder="Search your todos..."
      />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4 bg-red-300">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          To Do
        </h1>
        <Card className="w-full max-w-2xl p-8 shadow-lg">
          <div className="mb-8">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Add a new task
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="What needs to be done?" // Diubah
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
                className="flex-1"
                disabled={isCreating} // Nonaktifkan saat sedang membuat
              />
              <Button
                onClick={handleAddTodo}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreating} // Nonaktifkan saat sedang membuat
              >
                {isCreating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Add Todo"
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* 4. Tambahkan penanganan Loading dan Error */}
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading...</span>
              </div>
            )}

            {isError && (
              <div className="text-center text-destructive">
                Failed to load todos.
              </div>
            )}

            {!isLoading &&
              !isError &&
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 pb-4 border-b border-border"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(todo.id)}
                    onChange={() => handleSelectTodo(todo.id)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`flex-1 text-left text-lg font-medium transition-all ${
                      todo.isDone
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {todo.item} {/* 5. Ubah dari title ke item */}
                  </button>
                  {todo.isDone ? (
                    <Check
                      className="w-6 h-6 text-green-500 hover:cursor-pointer"
                      onClick={() => handleToggleTodo(todo.id)}
                    />
                  ) : (
                    <X
                      className="w-6 h-6 text-red-500 hover:cursor-pointer"
                      onClick={() => handleToggleTodo(todo.id)}
                    />
                  )}
                </div>
              ))}
          </div>

          {selectedIds.size > 0 && (
            <Button
              onClick={handleDeleteSelected}
              className="w-full bg-destructive hover:bg-destructive/90 text-white"
            >
              Deleted Selected ({selectedIds.size})
            </Button>
          )}
        </Card>
      </div>
    </>
  );
}
