import dayjs from "dayjs";
import 'dayjs/locale/zh-hk.js';
import updateLocale from 'dayjs/plugin/updateLocale.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
dayjs.extend(updateLocale)
dayjs.extend(localizedFormat)
dayjs.updateLocale('zh-hk', {
	formats: {
		LLL: 'M月D日（dddd）ah:mm',
		LLLL: 'YYYY年M月D日（dddd）ah:mm'
	},
	meridiem: (hour, minute, isLowercase) => {
		return hour > 12 ? '下午' : '上午'
	}
})
dayjs.locale('zh-hk')