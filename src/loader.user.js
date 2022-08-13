// ==UserScript==
// @name BC Moaner Reloaded
// @namespace https://www.bondageprojects.com/
// @version 1.0
// @description Bondage Club Moaner, originally https://github.com/kimei-nishimura/moaner, only reactive moaners implemented here
// @author Saki Saotome
// @include /^https:\/\/(www\.)?bondage(?:projects\.elementfx|-europe)\.com\/R\d+\/(BondageClub|\d+)(\/)?(((index|\d+)\.html)?)?$/
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-end
// ==/UserScript==

// hot/medium/light/low: 通过抚慰和玩具刺激触发，根据喜好和兴奋度触发不同等级
// orgasm: 在高潮时触发，忍住高潮不会触发
// pain: 在被拍打/掐捏/扇脸/电击时触发，同时会根据喜好和兴奋度触发hot/medium/light/low
// tickle: 在挠痒时触发，同时会根据喜好和兴奋度触发hot/medium/light/low
// 每个词条都是等概率的，可以填入空词条来减少触发概率，或者干脆不填词条来使它不触发

const MoanerValue = {
    "hot": ["n... Nyah♥", "Oooh", "mmmmmh!", "NYyaaA♥"],
    "medium": ["mm", "aaaah", "nyAh♥"],
    "light": ["nyah♥", "Aah!", "mh", "oh!♥", "mh♥"],
    "low": ["", "", "mh", "♥oh♥", "ah", "...♥"],
    "orgasm": ["Nya...Ny...NyaaAAaah!", "Mmmmh... MMmh... Hhhmmmm...", "Oooooh... Mmmmh... OooOOOOh!", "Mmmhnn... Nyhmm... Nyah!"],
    "pain": ["Aie!", "Aoouch!", "Aaaaie!", "Ouch", "Aow"],
    "tickle": ["Hahaha!", "Mmmmhahaha!", "Muhahah...", "Ha!Ha!"],
};

(function () {
    let MoanerOn = GM_getValue('BCTampermonkeyMoanerOn', false);
    let MenuText = ['Moaner is ON', 'Moaner is OFF'];
    let mid;

    let f = () => {
        let newMoanerOn = !GM_getValue('BCTampermonkeyMoanerOn', false);
        GM_setValue('BCTampermonkeyMoanerOn', newMoanerOn);
        GM_unregisterMenuCommand(mid);
        mid = GM_registerMenuCommand(MenuText[newMoanerOn ? 0 : 1], f, "switch_key");
        if (BCMoanerReloaded !== undefined) {
            BCMoanerReloaded(newMoanerOn, MoanerValue);
        }
    }

    mid = GM_registerMenuCommand(MenuText[MoanerOn ? 0 : 1], f, "switch_key");

    if (typeof BCMoanerReloaded_Loaded === "undefined") {
        let n = document.createElement("script");
        n.setAttribute("language", "JavaScript");
        n.setAttribute("crossorigin", "anonymous");
        n.setAttribute("src", "https://dynilath.gitlab.io/SaotomeToyStore/Moaner/main.js?_=" + Date.now());
        n.onload = () => {
            if (BCMoanerReloaded !== undefined) {
                BCMoanerReloaded(MoanerOn, MoanerValue);
            }
            n.remove()
        };
        document.head.appendChild(n);
    }
})();