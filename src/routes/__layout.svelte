<script context="module">
	import {user_info} from "$lib/store/user_info.js";
	export const load = ({session}) => {
		user_info.set(session.user_info)
		return true
	}
</script>

<script>
	import {sentry} from "$lib/sentry";
	import Header from '$lib/top-bar.svelte';
	import LoadingBar from '$lib/ui/indeterminate-loading-bar.svelte'
	import {navigating} from "$app/stores";
	import '../styles/tailwind-output.css';
	import {page} from '$app/stores'
	import {onMount} from 'svelte'
	import '$lib/app-shelf/dayjs-setting.js'

	onMount(() => {
		sentry.init()
	})
</script>

{#if $page.path !== '/login'}
	<Header/>
{/if}

<main class="bg-gray-50">
	{#if $navigating}
		<div class="fixed inset-x-0 top-0 z-50">
			<LoadingBar/>
		</div>
	{/if}
	<slot />
</main>
