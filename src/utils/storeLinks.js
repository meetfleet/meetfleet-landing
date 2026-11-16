// Store links. On phones, open the native store app instead of the store's web
// page: the Play Store app on Android, the TestFlight app on iOS. Anywhere else
// (desktop, or the "other" phone OS) the link's href is followed as usual.

const PLAY_ID = 'com.meetfleet.mobile';
export const PLAY_URL = `https://play.google.com/store/apps/details?id=${PLAY_ID}`;
const PLAY_APP_URL =
  `intent://details?id=${PLAY_ID}#Intent;scheme=market;package=com.android.vending;` +
  `S.browser_fallback_url=${encodeURIComponent(PLAY_URL)};end`;

const TESTFLIGHT_PATH = 'testflight.apple.com/join/nXyfPMSc';
export const TESTFLIGHT_URL = `https://${TESTFLIGHT_PATH}`;
const TESTFLIGHT_APP_URL = `itms-beta://${TESTFLIGHT_PATH}`;

const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
const isAndroid = /Android/i.test(ua);
// iPadOS Safari reports itself as a Mac, so also check for touch support.
const isIOS =
  /iPhone|iPad|iPod/i.test(ua) ||
  (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// A custom scheme fails silently when its app isn't installed, so if the page
// is still in front shortly after, send the visitor to the web page instead.
function openApp(appUrl, webUrl) {
  let left = false;
  const markLeft = () => { left = true; };
  document.addEventListener('visibilitychange', markLeft, { once: true });
  window.addEventListener('pagehide', markLeft, { once: true });
  window.addEventListener('blur', markLeft, { once: true });

  setTimeout(() => {
    document.removeEventListener('visibilitychange', markLeft);
    window.removeEventListener('pagehide', markLeft);
    window.removeEventListener('blur', markLeft);
    if (!left && document.visibilityState === 'visible') window.location.href = webUrl;
  }, 1500);

  window.location.href = appUrl;
}

// onClick handler for a store link: storeClick('play') or storeClick('testflight').
// Pass `then` to run something after (e.g. closing a menu).
export const storeClick = (store, then) => (e) => {
  then?.();
  if (store === 'play' && isAndroid) {
    e.preventDefault();
    openApp(PLAY_APP_URL, PLAY_URL);
  } else if (store === 'testflight' && isIOS) {
    e.preventDefault();
    openApp(TESTFLIGHT_APP_URL, TESTFLIGHT_URL);
  }
};
