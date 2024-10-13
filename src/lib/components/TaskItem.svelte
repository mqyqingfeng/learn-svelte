<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { type Task } from '@prisma/client';
	import { cn } from '$lib/utils';
	const { task }: { task: Task } = $props();
	import { enhance, applyAction, deserialize } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let taskChecked: boolean = $state(task.done);
	$effect(() => {
		taskChecked = task.done;
	});
</script>

<div class="flex items-center gap-2">
	<Checkbox
		id={task.id.toString()}
		class="bg-white"
		bind:checked={taskChecked}
		onCheckedChange={async (checked) => {
			const formData = new FormData();
			formData.append('taskId', String(task.id));
			formData.append('checked', String(checked));

			const response = await fetch('?/setTask', {
				method: 'POST',
				body: formData
			});

			const result: ActionResult = deserialize(await response.text());
			console.log(result);
			if (result.type === 'success' && checked) {
				toast.success('恭喜完成任务');
			} else if (result.type === 'failure' || result.type == 'error') {
				toast.error('修改任务失败！');
			}
			await invalidateAll();
			applyAction(result);
		}}
	/>
	<label
		for={task.id.toString()}
		class={cn('flex flex-row items-center gap-2', task.done && 'line-through')}
	>
		{task.content}
		{#if task.expiresAt}
			<p
				class={cn('text-xs text-white', {
					'text-red-800': Date.now() - task.expiresAt.getTime() > 0
				})}
			>
				{task.expiresAt.toLocaleDateString()}
			</p>
		{/if}
	</label>
</div>
