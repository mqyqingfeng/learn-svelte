import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { createListSchema } from '$lib/schema/createList';
import { createTaskSchema } from '$lib/schema/createTask';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, error } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import prisma from '$lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listWithTasks = Prisma.validator<Prisma.ListDefaultArgs>()({
	include: { tasks: true }
});
type ListWithTask = Prisma.ListGetPayload<typeof listWithTasks>;

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.session.userId;
	if (!userId) {
		error(401, '尚未登录，请先登录');
	}

	try {
		const checkLists: ListWithTask[] = await prisma.list.findMany({
			where: {
				userId
			},
			include: {
				tasks: true
			}
		});

		return {
			createListForm: await superValidate(zod(createListSchema)),
			createTaskForm: await superValidate(zod(createTaskSchema)),
			checkLists
		};
	} catch (e) {
		console.error(e);
		error(401, '清单获取失败');
	}
};

export const actions: Actions = {
	addList: async (event) => {
		const form = await superValidate(event, zod(createListSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const userId = event.locals.session.userId;
			// 创建清单
			await prisma.list.create({
				data: {
					userId,
					color: form.data.color,
					name: form.data.name
				}
			});
		} catch (e) {
			console.error(e);
			return fail(400, {
				form,
				message: '清单创建失败~'
			});
		}

		console.log(form);
		return {
			form
		};
	},
	deleteList: async (event) => {
		try {
			const userId = event.locals.session.userId;
			const data = await event.request.formData();
			const id = Number(data.get('id'));
			await prisma.list.delete({
				where: {
					id,
					userId
				}
			});
		} catch (e) {
			console.error(e);
			return fail(400, {
				message: '删除清单失败'
			});
		}
	},
	addTask: async (event) => {
		const form = await superValidate(event, zod(createTaskSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const userId = event.locals.session.userId;
			const { content, expiresAt, listId } = form.data;

			await prisma.task.create({
				data: {
					userId,
					content,
					expiresAt: expiresAt ? new Date(expiresAt) : null,
					list: {
						connect: {
							id: listId
						}
					}
				}
			});
		} catch (e) {
			console.error(e);
			return fail(400, {
				message: '添加任务失败',
				form
			});
		}

		console.log(form);

		return {
			form
		};
	},
	setTask: async (event) => {
		try {
			const data = await event.request.formData();
			const taskId = data.get('taskId') as string;
			const checked = data.get('checked') as string;
			const userId = event.locals.session.userId;

			await prisma.task.update({
				where: {
					id: +taskId,
					userId
				},
				data: {
					done: checked == 'true' ? true : false
				}
			});
		} catch (e) {
			console.error(e);
			return fail(400, {
				message: '修改任务失败'
			});
		}
	}
};
