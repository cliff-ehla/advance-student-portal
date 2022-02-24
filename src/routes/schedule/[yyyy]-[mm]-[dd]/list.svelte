<script context="module">
	import {http, onFail} from "$lib/http";

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
				zoom_list: data
			}
		}
	}
</script>

<script>
	import dayjs from "dayjs";
	import {page} from "$app/stores";
	import isToday from "dayjs/plugin/isToday.js";
	import isBetween from "dayjs/plugin/isBetween.js";
	import ZoomPreview from '$lib/zoom/zoom-preview.svelte'

	export let zoom_list
	dayjs.extend(isToday)
	dayjs.extend(isBetween)
	$: date_key = `${$page.params.yyyy}-${$page.params.mm}-${$page.params.dd}`
	$: zoom_list_by_date = date_key ? groupByDate(zoom_list) : []
	const groupByDate = (zoom_list) => {
		let results = []
		zoom_list.forEach(z => {
			if (!z) return
			if (dayjs(z.start_date).isSame(date_key, 'month')) {
				let date = dayjs(z.start_date).format('YYYY-MM-DD')
				let obj = results.find(r => r.date === date)
				if (!obj) {
					results.push({
						date,
						zoom_list: [z]
					})
				} else {
					obj.zoom_list.push(z)
				}
			}
		})
		return results
	}

</script>

{#each zoom_list_by_date as date}
	<div data-date={dayjs(date.date).format('YYYY-MM-DD')} class="transition-colors duration-1000 flex border-b border-gray-300 items-start">
		<div class="w-40 px-2 flex items-center">
			<div class:active={dayjs(date.date).isToday()} class="rounded-full w-10 h-10 cc mr-2">{dayjs(date.date).format('D')}</div>
			<p class="text-xs uppercase mt-0.5">{dayjs(date.date).format('MMM, ddd')}</p>
		</div>
		<div class="w-full">
			{#each date.zoom_list as z}
				<ZoomPreview {z}/>
			{/each}
		</div>
	</div>
{/each}