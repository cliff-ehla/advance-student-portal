<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({fetch, page}) => {
		const res = await http.get(fetch, '/user/user_info')
		const {success, data, debug} = res
		if (!success) return onFail(debug)
		return {
			props: {
				user_info: data[0]
			}
		}
	}
</script>

<script>
	export let user_info
	import {sentry} from "$lib/sentry";
</script>

<div class="container py-8">
	<div class="bg-white p-8 rounded border border-gray-300">
		<div class="p-4 border-b border-gray-200">
			<p class="text-sm text-gray-400">Username</p>
			<p>{user_info.username}</p>
		</div>
		<div on:click={() => {sentry.log('testing click')}} class="p-4 border-b border-gray-200">
			<p class="text-sm text-gray-400">Nickname</p>
			<p>{user_info.nickname}</p>
		</div>
		<div class="p-4">
			<a class="button" href="/logout">Logout</a>
		</div>
	</div>
</div>
