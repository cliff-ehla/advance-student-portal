<script context="module">
	import dayjs from "dayjs";

	export const load = async ({fetch, session}) => {
		return {
			status: 302,
			redirect: `/schedule/${dayjs().format('YYYY-MM-DD')}/list`
		}
	}
</script>

<svelte:head>
	<title>EHLA Zoom class</title>
</svelte:head>

