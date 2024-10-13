<script lang="ts">
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import ClerkLoading from 'clerk-sveltekit/client/ClerkLoading.svelte';

	import {
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
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
		<Button>添加清单</Button>
	</CardFooter>
</Card>
