import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { createListSchema } from '$lib/schema/createList';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, error } from '@sveltejs/kit';
import { type List } from '@prisma/client';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.session.userId;
	if (!userId) {
		error(401, '尚未登录，请先登录');
	}

	try {
		const checkLists: List[] = await prisma.list.findMany({
			where: {
				userId
			}
		});

		return {
			createListForm: await superValidate(zod(createListSchema)),
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
	}
};
