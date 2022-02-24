<script>
	import Icon from '$lib/ui/icon.svelte'
	import {page} from '$app/stores'
	import dayjs from "dayjs";
	import {tooltip} from "$lib/action/tooltip.js";

	$: slug = $page.path.split('/').pop()
	$: nav_key = slug === 'list' ? 'month' : slug
	$: date_key = `${$page.params.yyyy}-${$page.params.mm}-${$page.params.dd}`
	$: start_of_week = dayjs(date_key).startOf('week')
	$: end_of_week = dayjs(date_key).endOf('week')
</script>

<div class="px-4 flex h-12 items-center border-b border-gray-300 sticky top-14 bg-white z-10">
	<div class="flex items-center font-light">
		<a href="/schedule/{dayjs().format('YYYY-MM-DD')}/{slug}" class="calendar-button">Today</a>
		<div class="flex mx-2">
			<a href="/schedule/{dayjs(date_key).subtract(1,nav_key).format('YYYY-MM-DD')}/{slug}" class="block cc w-8 h-8 rounded-full hover:bg-gray-200 transition-colors">
				<Icon name="right" className="w-3 transform rotate-180"/>
			</a>
			<a href="/schedule/{dayjs(date_key).add(1,nav_key).format('YYYY-MM-DD')}/{slug}" class="block cc w-8 h-8 rounded-full hover:bg-gray-200 transition-colors">
				<Icon name="right" className="w-3"/>
			</a>
		</div>
		<div class="text-xl flex items-center">
			{#if slug === 'week'}
				<p>{start_of_week.format('DD MMM')} - {end_of_week.format('DD MMM YYYY')}</p>
			{:else if slug === 'month' || slug === 'list'}
				<p>{dayjs(date_key).format('MMM YYYY')}</p>
			{/if}
		</div>
	</div>
</div>

<slot/>

<style>
	.active {
		@apply bg-gray-200 text-blue-500;
	}
</style>