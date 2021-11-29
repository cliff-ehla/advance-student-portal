import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday.js'
import isTomorrow from 'dayjs/plugin/isTomorrow.js'

dayjs.extend(isToday)
dayjs.extend(isTomorrow)

export const groupByTime = list => {
	list = list.sort((a, b) => a.start_date > b.start_date ? 1: -1)
	const today_list = []
	const in_a_week_list = []
	const future_list = []
	const now = dayjs(new Date())
	list.forEach(z => {
		const start = dayjs(z.start_date)
		const is_today = start.isToday()
		const is_tomorrow = start.isTomorrow()
		const day_diff = start.diff(now, 'day')
		const in_a_week = is_tomorrow || (day_diff >= 1 && day_diff <= 7)
		const is_future = day_diff > 7
		if (is_today) {
			today_list.push(z)
		} else if (in_a_week) {
			in_a_week_list.push(z)
		} else if (is_future) {
			future_list.push(z)
		}
	})
	return [
		{
			title: '今天',
			zoom_list: today_list
		},
		{
			title: '本星期',
			zoom_list: in_a_week_list
		},
		{
			title: '下星期及後',
			zoom_list: future_list
		}
	]
}