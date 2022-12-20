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
    user_id: 4329,
    user_session_id: "2bX44NO3eiD6PvZTbq4BTC2k18KMoA",   // change to own user session
    client_version: "html5_210",
    auth: "f3058b5410e0d66e7a6f29cf5fa66cd7",
    rct: 1,
    keep_active: "true",
    device_type: "web"
}
const BOT_TOKEN = "5604393426:AAGQQhnEjqfyEWvdpkN47BttMhEGaCAtw-Y"
const CHAT_ID = "956543322"

function send_telegram_message(text = "Its working") {
    const URL = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage?chat_id=" + CHAT_ID + "&text=" + text

    fetch(URL)
        .then(res => res.json())
        .then(res => console.log(res))

}


const random = (n) => {
    return Math.floor(Math.random() * n)
}


async function donate_to_guild(amount = 3) {
    let res = await fetch("https://tr12.herozerogame.com/request.php", {
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
    console.log("Action : donate_to_guild", json)
    return json
}



async function claim_quest_rewards() {
    let res = await fetch("https://tr12.herozerogame.com/request.php", {
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
    console.log("Claim quest rewards", json)
    return json
}

async function start_quest(quest_id = 5905475) {
    let res = await fetch("https://tr12.herozerogame.com/request.php", {
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
    console.log(`Action : start_quest , quest_id : ${quest_id} `, json)
    return json
}

async function buy_quest_energy() {
    let response = await fetch("https://tr12.herozerogame.com/request.php", {
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
    console.log(`action : buy_quest_enery   `, json)
    return json
}


async function auto_login_user() {
    let response = await fetch("https://tr12.herozerogame.com/request.php", {
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
    console.log(`action : auto_login_user   `, json)
    return json
}


async function auto_xp() {
    send_telegram_message('auto xp started')
    let response = await auto_login_user()
    await claim_quest_rewards()

    if (response.error != "") {
        console.log(`auto_login_user ERROR `, response)
        send_telegram_message(`auto_login_user ERROR ${response.error} `)
        return false
    }
    let quests = await response.data.quests
    let response1 = await start_quest(quests[random(quests.length)].id)

    if (response.error == 'errRemoveQuestEnergyNotEnough') {
        await buy_quest_energy()
        response1 = await start_quest(quests[random(quests.length)].id);
        console.log("Enery Not Enough Second try", response1.error)
        send_telegram_message(` ERROR : Energy Not Enough , second time tried and response is ${response1} `,)
    }

}


auto_xp()

