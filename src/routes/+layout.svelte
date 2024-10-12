<script lang="ts">
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import ClerkLoading from 'clerk-sveltekit/client/ClerkLoading.svelte';

	import '../app.css';
</script>

<nav class="flex h-[60px] w-full items-center justify-between p-4">
	<h1><a href="/" data-sveltekit-reload>嗒嗒清单</a></h1>
	<div class="flex items-center gap-2">
		<ClerkLoading>
			<div>加载中...</div>
		</ClerkLoading>
		<SignedIn>
			<UserButton afterSignOutUrl="/" />
		</SignedIn>
		<SignedOut>
			<a href="/signin">登录</a> <span>|</span> <a href="/signup">注册</a>
		</SignedOut>
	</div>
</nav>

<slot />

<style>
	:global(.cl-internal-b3fm6y),
	:global(.cl-userButtonPopoverFooter),
	:global(.cl-profileSection__connectedAccounts .cl-internal-fqx4fd) {
		display: none;
	}
</style>
