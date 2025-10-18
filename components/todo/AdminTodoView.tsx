"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useGetTodos } from "@/queries/todo";
import type { Todo } from "@/schemas/todoSchema";

export function AdminTodoView() {
  // 1. Ganti useState dengan React Query
  const { data: apiResponse, isLoading, isError } = useGetTodos();
  // Ambil data todos, atau array kosong jika belum siap
  const todos: Todo[] = apiResponse?.content.entries || [];

  const [searchQuery, setSearchQuery] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.item.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || String(todo.isDone) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [todos, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = filteredTodos.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput); // Terapkan filter dari input
    setCurrentPage(1); // Reset ke halaman 1
  };
  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };
  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }
  if (isError) {
    return <div className="p-6 text-red-500">Failed to load data.</div>;
  }
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6">
          <Card className="p-6">
            <div className="flex gap-4 mb-6 items-center">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name or todo..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      // Hapus 'setSearchQuery' dan 'setCurrentPage' dari sini
                    }}
                    // 3. Tambahkan onKeyDown untuk 'Enter'
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchSubmit();
                      }
                    }}
                    className="pl-10"
                  />
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSearchSubmit}
                >
                  Search
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Filter by Status
                </span>
                <select
                  value={statusFilter} // <-- Gunakan state langsung
                  onChange={(e) => {
                    setStatusFilter(e.target.value); // <-- Set string value
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-md border border-border bg-background text-foreground cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="true">Done</option>
                  <option value="false">Not Done</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      To do
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTodos.map((todo) => (
                    <tr
                      key={todo.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-foreground">
                        {todo.user.fullName}
                      </td>
                      <td className="py-4 px-4 text-foreground">{todo.item}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            todo.isDone
                          )}`}
                        >
                          {todo.isDone ? "Done" : "Not Done"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 ${
                        currentPage === page
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-secondary hover:bg-muted text-foreground"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
