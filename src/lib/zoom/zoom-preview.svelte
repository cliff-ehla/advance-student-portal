<script>
	import utc from "dayjs/plugin/utc.js"
	import timezone from "dayjs/plugin/timezone.js"
	import isBetween from 'dayjs/plugin/isBetween.js'
	import relativeTime from "dayjs/plugin/relativeTime";
	import dayjs from 'dayjs'

	dayjs.extend(isBetween)
	dayjs.extend(utc)
	dayjs.extend(timezone)
	dayjs.extend(relativeTime)

	export let z
	import Icon from '$lib/ui/icon.svelte'
	import {onMount} from 'svelte'
	import {slack} from "$lib/slack";

	let now = dayjs(new Date())
	let in_progress
	let expired
	let not_yet_started
	let min_diff
	let within_hour
	let within_3_min
	let is_show_homework

	$: start_time_hk = dayjs.utc(z.start_date).tz('Asia/Hong_Kong')
	$: end_time_hk = start_time_hk ? start_time_hk.add(z.duration, 'minutes') : null
	$: is_today = start_time_hk ? start_time_hk.isToday() : false

	$: classroom_type = z.big_classroom_type
	$: classroom_type_display = ['BIG','UNLIMITED'].includes(classroom_type) ? '大班課' : classroom_type === 'SMALL' ? '小班課' : ''

	$: {
		if (z) update()
	}

	const update = () => {
		now = dayjs()
		min_diff = start_time_hk.diff(now, 'minute') % 60
		expired = now.isAfter(end_time_hk)
		in_progress = now.isBetween(start_time_hk, end_time_hk)
		within_hour = start_time_hk.diff(now, 'minute') <= 60
		within_3_min = start_time_hk.diff(now, 'minute') <= 3
		not_yet_started = now.isBefore(start_time_hk)
		is_show_homework = start_time_hk.diff(now, 'day') <= 1
	}

	onMount(() => {
		let timer_id
		if (is_today) {
			timer_id = setInterval(update, 1000)
		}
		return () => {
			if (timer_id) clearInterval(timer_id)
		}
	})
</script>

<div class="rounded bg-white border border-gray-300 overflow-hidden">
	<div class="{expired ? 'bg-gray-300' : in_progress ? 'bg-yellow-500' : is_today ? 'bg-green-500' : 'bg-blue-300'} text-white flex px-4 h-8 items-center text">
		<div class="inline-flex items-center">
			<Icon name="stopwatch" className="w-4"/>
			<p class="ml-1 text-sm">
				{#if expired}
					課堂已完結
				{:else if in_progress}
					課堂進行中
				{:else}
					課堂將於{dayjs(start_time_hk).fromNow()}開始
				{/if}
			</p>
		</div>
	</div>

	<div class="p-4">
		<div class="mb-0.5">
			<p class="text-lg leading-tight text-black">{z.title || 'No title'}</p>
			<div class="flex items-center text-gray-500 my-1">
				<p class="text-sm">老師: {z.teacher_nickname}</p>
				{#if classroom_type_display}
					<div class="ml-2">
						<p class="{classroom_type_display === '小班課' ? 'bg-purple-500' : 'bg-blue-700'} rounded-full text-white text-xs px-2">{classroom_type_display}</p>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex mt-2">
			<div class="flex items-center">
				<Icon name="calendar" className="text-gray-400 w-6"/>
				<div class="ml-1 text-sm text-gray-500">{start_time_hk.format('LLL')}</div>
			</div>
			<div class="flex items-center ml-4">
				<Icon name="stopwatch" className="text-gray-400 w-5"/>
				<div class="ml-1 text-sm text-gray-500">{z.duration}分鐘</div>
			</div>
		</div>
		{#if is_today && !expired}
			{#if within_3_min || in_progress}
				<a on:click={() => {slack.send(`Clicked zoom link ${z.zoom_link}`)}} target="_blank" href={z.zoom_link} class="block bg-blue-500 hover:bg-blue-700 text-white mt-4 text-center px-12 py-2 rounded font-bold w-full">
					進入課堂
				</a>
			{:else}
				<div class="mt-4">
					<button disabled class="cursor-not-allowed bg-gray-200 text-gray-400 text-center px-2 py-2 rounded w-full">
						{#if within_hour}
							課堂連結將於<span class="font-bold border-b-2 border-current">{min_diff - 3}</span>分鐘後開啟
						{:else}
							課堂連結將會於開課前3分鐘開啟
						{/if}
					</button>
				</div>
			{/if}
		{/if}
		{#if z.homeworks && is_show_homework}
			<div class="mt-2 bg-blue-50 inline-block p-1 rounded">
				<p class="text-sm text-gray-500">下載附件</p>
				<div class="">
					{#each z.homeworks as h,i}
						<div class="flex items-center">
							<p class="text-sm text-blue-500">{i + 1}.</p>
							<a class="ml-2 leading-tight text-sm text-blue-500 hover:underline" target="_blank" href={h.link}>{h.title}</a>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>