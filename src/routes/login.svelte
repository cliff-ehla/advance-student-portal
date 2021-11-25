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
			goto('/')
		} else {
			loading = false
			error = true
		}
	}
</script>


<div class="p-2 bg-white">
	<img src="/logo.png" alt="logo" class="w-12 mx-auto">
</div>

<div class="md:py-12 md:px-8">
	<div class="max-w-screen-sm mx-auto bg-white md:rounded-lg py-8 md:py-16 px-4 md:px-36 md:border md:border-gray-300">
		<div>
			<h1 class="font-bold mb-8 text-t1 text-center text-gray-500">EHLA Student Portal</h1>
			<div class="w-32 h-32 mb-8 border border-gray-300 rounded-full mx-auto flex items-center justify-center">
				<Icon name="avatar" className="w-20 text-gray-300"/>
			</div>
			<div class="mb-4">
				<input on:input={() => {error = false}} type="text" placeholder="Username" class="form-input w-full bg-gray-50" bind:value={username}>
			</div>
			<div>
				<input on:input={() => {error = false}} type="password" placeholder="Password" class="form-input w-full bg-gray-50" bind:value={password}>
			</div>
			{#if error}
				<p class="text-red-500 py-2">Password and username not match</p>
			{/if}
			<div class="mt-6">
				<button on:click={onLogin} class="{loading ? 'bg-gray-300 text-white' : 'bg-blue-500 text-white'} w-full font-bold rounded py-3 px-8">Log in</button>
			</div>
			<div class="mt-8">
				<p class="text-xs text-gray-400 text-center">
					Whatsapp us if you encounter any difficulties: <b>5578 0218</b>
				</p>
			</div>
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
</style>