import { z } from 'zod';

export const createTaskSchema = z.object({
	listId: z.number().nonnegative(),
	content: z.string().min(1, {
		message: '请填写任务内容'
	}),
	expiresAt: z.string().optional()
});

export type CreateTaskSchema = typeof createTaskSchema;
