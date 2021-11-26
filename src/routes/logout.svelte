<script>
	import {onMount} from 'svelte'
	import {goto} from "$app/navigation"
	import {getStores} from "$app/stores";
	import {http} from "$lib/http";
	const {session} = getStores()
	import {sentry} from "$lib/sentry";

	onMount(() => {
		http.post(fetch, '/user/logout')
		session.set({})
		sentry.clearUser()
		goto('/login')
	})
</script>