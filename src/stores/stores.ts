import { writable } from 'svelte/store';

type User = {
	name: string;
	roomId: string;
};

export const user = writable<User>({
	name: '',
	roomId: ''
});
