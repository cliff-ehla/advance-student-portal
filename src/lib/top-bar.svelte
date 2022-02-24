<script>
	import {user_info, authorized} from "$lib/store/user_info.js";
</script>

<header class="flex h-14 items-center px-4 border border-b sticky bg-white inset-x-0 top-0">
	<a class="flex items-center" href="/">
		<img src="/logo.png" alt="ehla" class="w-10 rounded"/>
		<p class="ml-4 font-light text-lg">EHLA 網上課堂</p>
	</a>
	<div class="ml-auto hover:text-blue-500 flex items-center">
		{#if $authorized}
			<a href="/profile" class="inline-flex items-center">
				{#if $user_info.profile_pic}
					<img class="rounded-full w-8 h-8" src={$user_info.profile_pic} alt="profile">
				{/if}
				<span class="ml-2">{$user_info.nickname}</span>
			</a>
		{:else}
			<a href="/login">Login</a>
		{/if}
	</div>
</header>