<script context="module">
	export const prerender = true;
	export const load = ({session}) => {
		// TODO I cannot delete the access token
		// if (session.access_token) {
		// 	return {
		// 		redirect: '/',
		// 		status: 302
		// 	}
		// }
		return true
	}
</script>

<script>
	import {http} from "$lib/http";
	import {goto} from '$app/navigation'
	import Icon from '$lib/ui/icon.svelte'
	import {getStores} from "$app/stores";
	import {sentry} from "$lib/sentry";

	let env = import.meta.env.VITE_ENV
	const {session} = getStores()

	let username = env !== 'production' ? 'queeniedevc4' : ''
	let password = env !== 'production' ? 'a12345678' : ''
	let error = false
	let loading = false

	const onLogin = async () => {
		if (loading) return
		loading = true
		let {data, success} = await http.post(fetch, '/user/login', {
			username,
			password
		})
		if (success) {
			session.set({
				user_info: {
					username: data.username,
					nickname: data.nickname
				}
			})
			sentry.setUser({
				username: data.username,
				nickname: data.nickname
			})
			goto('/')
		} else {
			loading = false
			error = true
		}
	}
</script>


<div class="transform translate-y-12 sm:translate-y-0 sm:-translate-x-48 bg-left-bottom md:bg-left max-w-screen-xl mx-auto bg-no-repeat bg-contain fixed inset-0" style="background-image: url('/login-bg.jpg')"></div>
<div class="fixed left-0 md:left-1/3 lg:left-1/2 right-0 inset-y-0 flex sm:items-center justify-center md:p-4 lg:p-8">
	<div class="px-8 sm:px-20 py-8 sm:py-16 sm:bg-white bg-opacity-90 sm:border sm:border-gray-300 rounded-lg sm:shadow-lg">
		<div class="flex justify-center mb-4">
			<div class="w-16 h-16">
				<img src="/logo.png" alt="logo" class="w-16">
			</div>
		</div>
		<h1 class="font-bold mb-8 text-xl text-center text-gray-500">學生網上課堂登入</h1>
		<div class="mb-4">
			<input on:input={() => {error = false}} type="text" placeholder="賬戶名稱" class="form-input w-full bg-gray-50" bind:value={username}>
		</div>
		<div>
			<input on:input={() => {error = false}} type="password" placeholder="密碼" class="form-input w-full bg-gray-50" bind:value={password}>
		</div>
		{#if error}
			<p class="text-red-500 py-2">賬戶名稱與密碼不符合</p>
		{/if}
		<div class="mt-6">
			<button on:click={onLogin} class="{loading ? 'bg-gray-300 text-white' : 'bg-blue-500 text-white'} w-full font-bold rounded py-3 px-8">登入</button>
		</div>
		<div class="mt-8">
			<p class="text-xs text-gray-500 text-center">
				若登入時遇到因難，請與我們的客服聯絡 <b>5578 0218</b>
			</p>
		</div>
	</div>
</div>

<svelte:head>
	<title>Login | EHLA Zoom class</title>
</svelte:head>

<style>
    input {
        @apply border border-gray-300 py-3 px-4 rounded;
    }
    .bg2 {
		    background-position: -40% 0;
		    background-repeat: no-repeat;
    }
</style>