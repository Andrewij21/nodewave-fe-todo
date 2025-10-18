import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  item: z.string(),
  userId: z.string(),
  isDone: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    role: z.string(),
    contact: z.string().optional(),
  }),
});

export const createTodoSchema = z.object({
  item: z.string().min(1, "Todo item cannot be empty"),
});

export const updateTodoSchema = z.object({
  action: z.string().min(1),
});

// 4. Ekspor Tipe (Types)
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
