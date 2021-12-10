import {http} from "$lib/http";
import {session} from "$app/stores";
import {get} from "svelte/store";

const slack = (() => {
	const send = (msg) => {
		let _session = get(session)
		const nickname = _session.user_info ? _session.user_info.nickname : '未登入'
		return http.post(fetch,'/slack/post-message', {
			text: `${nickname}: ${msg}`
		})
	}
	return {
		send
	}
})()

export {slack}