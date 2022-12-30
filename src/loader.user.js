// ==UserScript==
// @name BC Responsive
// @namespace https://www.bondageprojects.com/
// @version 1.0
// @description An anto response script for Bondage Club
// @author Saki Saotome
// @include /^https:\/\/(www\.)?bondage(?:projects\.elementfx|-europe)\.com\/R\d+\/(BondageClub|\d+)(\/)?(((index|\d+)\.html)?)?$/
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    if (typeof BCResponsive_Loaded === "undefined") {
        const script = document.createElement("script");
        script.src = `https://dynilath.gitlab.io/SaotomeToyStoreVendor/Responsive/main.js?v=${Date.now()}`;
        document.head.appendChild(script);
    }
})();
