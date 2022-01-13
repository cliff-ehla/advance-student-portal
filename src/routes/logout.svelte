<script>
	import {onMount} from 'svelte'
	import {goto} from "$app/navigation"
	import {getStores} from "$app/stores";
	import {http} from "$lib/http";
	const {session} = getStores()
	import {sentry} from "$lib/sentry";
	import {user_info} from "$lib/store/user_info.js";

	onMount(() => {
		http.post(fetch, '/user/logout')
		session.set({})
		sentry.clearUser()
		user_info.set(undefined)
		goto('/login')
	})
</script>