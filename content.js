let isRemovedInThisSession = false;

function clean() {
    chrome.storage.sync.get(['enabled'], (result) => {
        if (result.enabled === false) return;

        const overlays = document.querySelectorAll('div[class*="profile-hidden-overlay"]');
        if (overlays.length > 0) {
            overlays.forEach(el => el.remove());
            isRemovedInThisSession = true;
            console.log('Discord Sensor Unblocker: Оверлей удален');
        }
    });
}

const observer = new MutationObserver(() => clean());
observer.observe(document.body, { childList: true, subtree: true });

clean();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkStatus") {
        const currentOverlay = document.querySelector('div[class*="profile-hidden-overlay"]');
        sendResponse({ found: isRemovedInThisSession || !!currentOverlay });
    }
});