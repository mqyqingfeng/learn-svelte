import type { HandleClientError } from '@sveltejs/kit';
// To use Clerk components:
import { initializeClerkClient } from 'clerk-sveltekit/client';
// Or for headless mode:
// import { initializeClerkClient } from 'clerk-sveltekit/headless'
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
import { zhCN } from '@clerk/localizations';
import merge from 'lodash.merge';
import zhCNlocales from '$lib/locales/zh.json';

const localization = merge(zhCN, zhCNlocales);

initializeClerkClient(PUBLIC_CLERK_PUBLISHABLE_KEY, {
	localization,
	afterSignInUrl: '/admin/',
	afterSignUpUrl: '/admin/',
	signInUrl: '/sign-in',
	signUpUrl: '/sign-up'
});

export const handleError: HandleClientError = async ({ error, event }) => {
	console.error(error, event);
};
