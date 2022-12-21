const DEFAULT_HEADERS = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
	"Accept": "*/*",
	"Accept-Language": "en-US,en;q=0.5",
	"Content-Type": "application/x-www-form-urlencoded",
	"Sec-Fetch-Dest": "empty",
	"Sec-Fetch-Mode": "cors",
	"Sec-Fetch-Site": "same-origin"
}

const DEFAULT_BODY = {
	user_id: 561894,
	user_session_id: "hwyBtwIObJVYDYpApP2ukTloTgOVDX",   // change to own user session
	client_version: "html5_210",
	auth: "81bacc666055b88168cb34dc36b235bc",
	rct: 1,
	keep_active: "true",
	device_type: "web"
}
const URL = "https://ap1.herozerogame.com/request.php"
const BOT_TOKEN = "5604393426:AAGQQhnEjqfyEWvdpkN47BttMhEGaCAtw-Y"
const CHAT_ID = "956543322"

function send_telegram_message(text = "Its working") {
	const URL = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage?chat_id=" + CHAT_ID + "&text=" + text

	fetch(URL)
		.then(res => res.json())
		.then(res => {
			// console.log(res)
		})

}


const random = (n) => {
	return Math.floor(Math.random() * n)
}


async function donate_to_guild(amount = 3) {
	let res = await fetch(URL, {
		"headers": DEFAULT_HEADERS,
		"referrer": "https://tr12.herozerogame.com/",
		body: new URLSearchParams({
			...DEFAULT_BODY,
			action: "donateToGuild",
			game_currency_amount: amount,
			premium_currency_amount: 0,
		}).toString(),

		"method": "POST",
		"mode": "cors"
	})
	let json = await res.json()
	console.log(`action : donate_to_guild , game_currency_amount : ${amount} , error : ${json.error}`)
	return json
}



async function claim_quest_rewards() {
	let res = await fetch(URL, {
		"headers": DEFAULT_HEADERS,
		"referrer": "https://tr12.herozerogame.com/",
		"body": new URLSearchParams({
			...DEFAULT_BODY,
			discard_item: "false",
			create_new: "true",
			action: "claimQuestRewards",

		}).toString(),

		"method": "POST",
		"mode": "cors"
	})
	let json = await res.json()
	console.log(`action : claim quest rewards, error : ${json.error} `,)
	return json
}

async function start_quest(quest_id = 5905475) {
	let res = await fetch(URL, {
		"headers": DEFAULT_HEADERS,
		"referrer": "https://tr12.herozerogame.com/",
		body: new URLSearchParams({
			...DEFAULT_BODY,
			quest_id: quest_id,
			action: "startQuest"
		}).toString(),
		"method": "POST",
		"mode": "cors"
	});
	let json = await res.json()
	console.log(`action : start_quest , quest_id : ${quest_id}  , error : ${json.error} `,)
	return json
}

async function buy_quest_energy() {
	let response = await fetch(URL, {
		"headers": DEFAULT_HEADERS,
		"referrer": "https://tr12.herozerogame.com/",
		body: new URLSearchParams({
			...DEFAULT_BODY,
			use_premium: "false",
			action: "buyQuestEnergy"
		}),
		"method": "POST",
		"mode": "cors"
	})
	let json = await response.json()
	console.log(`action : buy_quest_enery , error : ${json.error}  `,)
	return json
}


async function auto_login_user() {
	let response = await fetch(URL, {
		"headers": DEFAULT_HEADERS,
		"referrer": "https://tr12.herozerogame.com/",
		body: new URLSearchParams({
			existing_session_id: DEFAULT_BODY.user_session_id,
			existing_user_id: DEFAULT_BODY.user_id,
			client_id: "tr121671486318",
			app_version: "210",
			action: 'autoLoginUser',
			user_id: "0",
			user_session_id: "0",
			client_version: DEFAULT_BODY.client_version,
			auth: DEFAULT_BODY.auth,
			rct: DEFAULT_BODY.rct,
			keep_active: DEFAULT_BODY.keep_active,
			device_type: DEFAULT_BODY.device_type
		}),
		"method": "POST",
		"mode": "cors"
	})
	let json = await response.json()
	console.log(`action : auto_login_user , error : ${json.error}  `,)
	return json
}


async function check_for_quest_complete() {
	let response = await fetch(URL, {
		"headers": DEFAULT_HEADERS,
		"referrer": "https://tr12.herozerogame.com/",
		body: new URLSearchParams({
			reload_user: true,
			action: "check_for_quest_complete",
			...DEFAULT_BODY
		}),
		"method": "POST",
		"mode": "cors"
	}).toString()
	let json = await response.json()
	console.log(`action :check_for_quest_complete , error : ${json.error}  `,)
	return json
}


async function auto_xp() {
	await donate_to_guild()
	let response_check_for_quest_complete = await check_for_quest_complete()
	let response_claim = await claim_quest_rewards()
	let response = await auto_login_user()

	if (response.error != "") {
		console.log(`auto_login_user ERROR `, response)
		send_telegram_message(`auto_login_user ERROR ${response.error} `)
		return false
	} else {
		send_telegram_message('auto xp started')
	}
	let quests = await response.data.quests
	let j = 0

	for (let i = 1; i < quests.length; i++) {
		let maxRatio = JSON.parse(quests[j].rewards).xp / parseInt(quests[j].energy_cost)
		let currentRatio = JSON.parse(quests[i].rewards).xp / parseInt(quests[i].energy_cost)
		if (currentRatio > maxRatio) {
			j = i
		}
	}
	let response1 = await start_quest(quests[j].id)

	if (response1.error == 'errRemoveQuestEnergyNotEnough') {
		await buy_quest_energy()
		response1 = await start_quest(quests[random(quests.length)].id);
		console.log("Energy Not Enough Second try", response1.error)
		send_telegram_message(` ERROR : Energy Not Enough , second time tried and response is ${response1.error} `,)
	} else if (response1.error == "") {
		send_telegram_message(`Mission started.  xp : ${quests[j].rewards.xp}  , coins : ${quests[j].rewards.coins} , average :   ${quests[j].rewards.xp / quests[j].energy_cost} XP`)
	}

}



module.exports = {
	auto_xp
}