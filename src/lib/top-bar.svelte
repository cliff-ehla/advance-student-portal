<script>
	export let user_info
</script>

<header class="flex h-16 items-center px-4">
	<a class="flex items-center" href="/">
		<img src="/logo.png" alt="ehla" class="w-12 rounded"/>
		<p class="ml-4 font-bold">EHLA 網上課堂</p>
	</a>
	<div class="ml-auto hover:text-blue-500 flex items-center">
		{#if user_info}
			<a href="/profile" class="inline-flex items-center">
				{#if user_info.profile_pic}
					<img class="rounded-full w-8 h-8" src={user_info.profile_pic} alt="profile">
				{/if}
				<span class="ml-2">{user_info.nickname}</span>
			</a>
		{:else}
			<a href="/login">Login</a>
		{/if}
	</div>
</header>