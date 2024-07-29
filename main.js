// ==UserScript==
// @name         Attention-span
// @namespace    http://tampermonkey.net/
// @description  Removing annoying things
// @version      0.0.1
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const observer = new MutationObserver(main);
  observer.observe(document.body, { childList: true });
})();

function main() {
  const hosts = {
    "www.youtube.com": handleYoutubeShorts,
  };

  let hostHandler = hosts[window.location.host];

  if (hostHandler) hostHandler();
}

function handleYoutubeShorts() {
  // Redirection
  if (window.location.href.includes("shorts")) {
    window.location.replace("https://www.youtube.com/");
  }

  // Removing YT Shorts block
  const spanElements = document.querySelectorAll("span");
  const ytShortsBlocks = Array.from(spanElements).filter(
    (el) => el.id === "title" && el.innerText === "YouTube Shorts"
  );

  function getDismissibleTag(el) {
    if (el == null) return null;
    if (el.id.toLowerCase() === "dismissible") return el;
    else return getDismissibleTag(el.parentElement);
  }

  for (const block of ytShortsBlocks) {
    const dismissibleTag = getDismissibleTag(block);
    if (dismissibleTag) dismissibleTag.remove();
  }

  // Removing YT Shorts links
  function getRenderedAnchorTag(el) {
    if (el == null) return null;
    if (el.tagName.toLowerCase() === "ytd-guide-entry-renderer") return el;
    else return getRenderedAnchorTag(el.parentElement);
  }

  const formattedStringElements = document.querySelectorAll(
    "yt-formatted-string"
  );
  const ytShortsLinks = Array.from(formattedStringElements).filter(
    (el) => el.innerText === "YouTube Shorts"
  );

  for (const link of ytShortsLinks) {
    const linkTag = getRenderedAnchorTag(link);
    if (linkTag) linkTag.remove();
  }
}
