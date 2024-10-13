import { z } from 'zod';
import { ListMap } from '$lib/const';

export const createListSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: '请输入清单名称'
		})
		.min(2, {
			message: '清单名称至少2个字符'
		}),
	color: z.string().refine((color) => [...ListMap.keys()].includes(color), {
		message: '请选择清单颜色'
	})
});

export type CreateListSchema = typeof createListSchema;
