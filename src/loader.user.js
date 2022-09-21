// ==UserScript==
// @name BC Moaner Reloaded
// @namespace https://www.bondageprojects.com/
// @version 1.0
// @description Bondage Club Moaner, originally https://github.com/kimei-nishimura/moaner, only reactive moaners implemented here
// @author Saki Saotome
// @include /^https:\/\/(www\.)?bondage(?:projects\.elementfx|-europe)\.com\/R\d+\/(BondageClub|\d+)(\/)?(((index|\d+)\.html)?)?$/
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    if (typeof BCMoanerReloaded_Loaded === "undefined") {
        const script = document.createElement("script");
        script.src = `https://dynilath.gitlab.io/SaotomeToyStoreVendor/Moaner/main.js?v=${Date.now()}`;
        document.head.appendChild(script);
    }
})();
