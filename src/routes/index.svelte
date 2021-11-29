<script context="module">
	import {http, onFail} from "$lib/http";
	import {groupByTime} from "$lib/zoom/group-by-time";

	export const load = async ({fetch, session}) => {
		if (!session.user_info) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		const {success, data, debug} = await http.post(fetch, '/zoom/zoom_list_all', {})
		if (!success) return onFail(debug)
		return {
			props: {
				category_list: groupByTime(data)
			}
		}
	}
</script>

<script>
	import Preview from '$lib/zoom/zoom-preview.svelte'
	export let category_list
</script>

<div class="bg-gray-100">
	<div class="container">
		<div class="p-8 max-w-screen-xl">
			{#if category_list}
				{#each category_list as cat}
					<div class="mb-12">
						<h2 class="font-bold text-black mb-4">{cat.title}</h2>
						{#if cat.zoom_list.length}
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{#each cat.zoom_list as z}
									<Preview {z}/>
								{/each}
							</div>
						{:else}
							<div class="p-8 bg-white rounded">
								<p>没有課堂</p>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="p-8">
					載入中...
				</div>
			{/if}
		</div>
	</div>
</div>

<svelte:head>
	<title>EHLA Zoom class</title>
</svelte:head>

