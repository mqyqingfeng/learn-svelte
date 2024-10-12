<script>
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
</script>

<SignedIn let:user>
	欢迎 {user?.fullName}!
</SignedIn>
