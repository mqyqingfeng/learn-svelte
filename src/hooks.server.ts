import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { CLERK_SECRET_KEY } from '$env/static/private';

const publicPaths = ['/signin', '/signup'];

export const handle: Handle = sequence(
	handleClerk(CLERK_SECRET_KEY, {
		debug: true,
		protectedPaths: [
			(event) => {
				if (publicPaths.includes(event.url.pathname)) {
					return false;
				}
				return true;
			}
		],
		signInUrl: '/signin'
	})
);
