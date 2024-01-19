// ==UserScript==
// @name BC Responsive Loader (Loader)
// @namespace https://www.bondageprojects.com/
// @version 1.2
// @description An anto response script for Bondage Club
// @author Saki Saotome
// @match bondageprojects.elementfx.com/*/BondageClub/*
// @match www.bondageprojects.elementfx.com/*/BondageClub/*
// @match bondage-europe.com/*/BondageClub/*
// @match www.bondage-europe.com/*/BondageClub/*
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    const src = `__DEPLOY_SITE__?v=${Date.now()}`;
    if (typeof BCResponsive_Loaded === "undefined") {
        const n = document.createElement("script");
        n.setAttribute("type", "text/javascript");
        n.setAttribute("src", src);
        document.head.appendChild(n);
    }
})();
