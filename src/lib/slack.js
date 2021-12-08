import {http} from "$lib/http";
import {session} from "$app/stores";

const slack = (() => {
	const send = (msg) => {
		const nickname = session.user_info ? session.user_info.nickname : '未登入'
		return http.post(fetch,'/slack/post-message', {
			text: `${nickname}: ${msg}`
		})
	}
	return {
		send
	}
})()

export {slack}