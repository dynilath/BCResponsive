// ==UserScript==
// @name __NAME__
// @namespace https://www.bondageprojects.com/
// @version 1.6
// @description __DESCRIPTION__
// @author __AUTHOR__
// @include /^https?:\/\/(www\.)?(bondageprojects\.elementfx|bondage-europe)\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
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
        document.head.appendChild(script);
    }
})();