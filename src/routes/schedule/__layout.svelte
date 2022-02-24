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
	<div class="ml-auto flex items-center text-gray-500">
		<a use:tooltip={'Month view'} href="/schedule/{dayjs().format('YYYY-MM-DD')}/month" class:active={slug === 'month'} class="calendar-button ml-1">
			<Icon name="month"/>
		</a>
		<a use:tooltip={'Schedule view'} href="/schedule/{dayjs().format('YYYY-MM-DD')}/list" class:active={slug  === 'list'} class="calendar-button ml-1">
			<svg viewBox="0 0 36 36" class="fill-current w-5"><path d="M11 14h25v8H11zM0 25h8v7H0zM11 25h25v7H11zM11 4h25v7H11zM0 4h8v7H0zM0 14h8v8H0z"></path></svg>
		</a>
	</div>
</div>

<slot/>

<style>
	.active {
		@apply bg-gray-200 text-blue-500;
	}
</style>