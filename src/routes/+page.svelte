<script lang="ts">
	import type { PageData } from './$types.js';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import ClerkLoading from 'clerk-sveltekit/client/ClerkLoading.svelte';

	import {
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
		CardContent
	} from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import CreateListModal from '$lib/components/CreateListModal.svelte';
	import ListFooter from '$lib/components/ListFooter.svelte';
	import TaskItem from '$lib/components/TaskItem.svelte';
	import { ListMap } from '$lib/const';
	import { cn } from '$lib/utils';

	const { data }: { data: PageData } = $props();
</script>

<Card class="mx-4">
	<CardHeader class="pb-3">
		<CardTitle class="text-lg">
			<SignedIn let:user>
				欢迎 {user?.fullName}!
			</SignedIn>
			<ClerkLoading>
				<Skeleton class="h-7 w-[150px]" />
			</ClerkLoading>
		</CardTitle>
		<CardDescription class="text-primary max-w-lg text-balance leading-relaxed">
			道虽迩，不行不至；事虽小，不为不成
		</CardDescription>
	</CardHeader>
	<CardFooter>
		<CreateListModal />
	</CardFooter>
</Card>

<div class="mx-4 mt-6 flex flex-col gap-4">
	{#if data.checkLists.length > 0}
		{#each data.checkLists as { id, name, color, tasks }, index (id)}
			<Card class={cn('w-full text-white sm:col-span-2', ListMap.get(color))}>
				<CardHeader>
					<CardTitle>{name}</CardTitle>
				</CardHeader>
				<CardContent>
					{#if tasks && tasks.length === 0}
						<p>目前没有任务</p>
					{:else if tasks && tasks.length > 0}
						<div>
							{#each tasks as task (task.id)}
								<TaskItem {task} />
							{/each}
						</div>
					{/if}
				</CardContent>
				<CardFooter class="flex-col pb-2">
					<ListFooter checkList={data.checkLists[index]} />
				</CardFooter>
			</Card>
		{/each}
	{:else}
		<span class="text-center">尚未创建清单，快创建一个吧</span>
	{/if}
</div>
