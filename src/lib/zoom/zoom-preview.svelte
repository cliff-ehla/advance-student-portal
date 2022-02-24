<script>
	import utc from "dayjs/plugin/utc.js"
	import timezone from "dayjs/plugin/timezone.js"
	import isBetween from 'dayjs/plugin/isBetween.js'
	import dayjs from 'dayjs'
	import {sentry} from "$lib/sentry";

	dayjs.extend(isBetween)
	dayjs.extend(utc)
	dayjs.extend(timezone)

	export let z
	import Icon from '$lib/ui/icon.svelte'
	import {onMount} from 'svelte'
	import {slack} from "$lib/slack";

	const start = dayjs(z.start_date)
	let now = dayjs(new Date())
	const not_set = !z.start_date
	const day_diff = start.diff(now, 'day')
	const is_today = start.isToday()

	let in_progress
	let expired
	let not_yet_started
	let hour_diff
	let min_diff
	let within_hour
	let within_5_min

	$: status = not_set ? 'not_set' : expired ? 'expired' : in_progress ? 'in_progress' : within_hour ? 'in_hour' : is_today ? 'today' : 'coming_soon'
	$: zoom_button_active = (within_5_min || in_progress)

	$: start_time_hk = dayjs.utc(z.start_date).tz('Asia/Hong_Kong')
	$: end_time_hk = start_time_hk ? start_time_hk.add(z.duration, 'minutes') : null

	$: classroom_type = z.big_classroom_type
	$: classroom_type_display = ['BIG','UNLIMITED'].includes(classroom_type) ? '大班課' : classroom_type === 'SMALL' ? '小班課' : ''

	const status_to_style = {
		'not_set': 'bg-blue-100 text-red-500',
		'expired': 'bg-gray-200 text-gray-400',
		'in_progress': 'bg-yellow-600 text-white',
		'in_hour': 'bg-green-500 text-white',
		'today': 'bg-green-500 text-white',
		'coming_soon': 'bg-blue-100 text-blue-500'
	}

	const update = () => {
		now = dayjs()
		hour_diff = start_time_hk.diff(now, 'hour')
		min_diff = start_time_hk.diff(now, 'minute') % 60
		expired = now.isAfter(end_time_hk)
		in_progress = now.isBetween(start_time_hk, end_time_hk)
		within_hour = start_time_hk.diff(now, 'minute') <= 60
		within_5_min = start_time_hk.diff(now, 'minute') <= 3
		not_yet_started = now.isBefore(start_time_hk)
	}

	onMount(() => {
		let timer_id
		update()
		if (is_today) {
			hour_diff = start.diff(now, 'hour')
			timer_id = setInterval(update, 1000)
		}
		return () => {
			if (timer_id) clearInterval(timer_id)
		}
	})
</script>

<div class="rounded bg-white border border-gray-300 overflow-hidden">
	<div class="{status_to_style[status]} flex px-4 h-8 items-center text">
		{#if not_set}
			<p class="text-xs font-bold uppercase">No date</p>
			<p class="text-xxs ml-2">Your tutor have not set the class time</p>
		{:else if expired}
			<p class="text-xs font-bold uppercase">課堂已完成</p>
		{:else if not_yet_started}
			{#if within_hour}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{min_diff}分鐘後開始</p>
				</div>
			{:else if is_today}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{hour_diff}小時後開始</p>
				</div>
			{:else}
				<div class="inline-flex items-center">
					<Icon name="stopwatch" className="w-5"/>
					<p class="text-sm ml-1 leading-none">{day_diff}天後開始</p>
				</div>
			{/if}
		{:else if in_progress}
			<p class="text-xs font-bold uppercase">進行中</p>
		{/if}
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
		{#if within_hour}
			{#if zoom_button_active && !expired}
				<a on:click={() => {slack.send(`Clicked zoom link ${z.zoom_link}`)}} target="_blank" href={z.zoom_link} class="block bg-blue-500 hover:bg-blue-700 text-white mt-4 text-center px-12 py-2 rounded font-bold w-full">
					進入課堂
				</a>
				<a on:click={() => {slack.send(`Clicked zoom link ${z.zoom_link}`)}} href={z.zoom_link} class="block text-xs leading-tight mt-2 text-gray-500 hover:text-blue-500">{z.zoom_link}</a>
			{:else if is_today && !expired}
				<div class="mt-4">
					<button disabled class="bg-gray-100 text-gray-400 text-center px-2 py-2 rounded w-full">
						課堂連結將於<span class="font-bold border-b-2 border-current">{min_diff - 3}</span>分鐘後開啟
					</button>
				</div>
			{/if}
		{/if}
		{#if z.homeworks}
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