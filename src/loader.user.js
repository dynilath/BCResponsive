// ==UserScript==
// @name __NAME__
// @namespace https://www.bondageprojects.com/
// @version 1.3
// @description __DESCRIPTION__
// @author __AUTHOR__
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
    if (typeof __LOAD_FLAG__ === "undefined") {
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        document.head.appendChild(n);
    }
})();