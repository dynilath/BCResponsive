// ==UserScript==
// @name BC Responsive Loader
// @namespace https://www.bondageprojects.com/
// @version 1.1
// @description An anto response script for Bondage Club
// @author Saki Saotome
// @match bondageprojects.elementfx.com/*
// @match www.bondageprojects.elementfx.com/*
// @match bondage-europe.com/*
// @match www.bondage-europe.com/*
// @icon  https://dynilath.gitlab.io/SaotomeToyStore/favicon.ico
// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
    "use strict";
    const src = `https://dynilath.gitlab.io/SaotomeToyStoreVendor/Responsive/main.js?v=${Date.now()}`;
    const loadScript = (url, okay, failed) => fetch(url).then(r => {if(r.ok) return r.text();
        else throw new Error("Failed to load script")} ).then(okay).catch(() => { setTimeout(() => {failed(url, okay, failed)}, 5000); });
    loadScript(src, text => {if (typeof BCResponsive_Loaded === "undefined") eval(text);}, loadScript);
})();
