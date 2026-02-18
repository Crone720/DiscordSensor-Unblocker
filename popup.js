document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleService');
    const statusDiv = document.getElementById('status');

    if (!toggle || !statusDiv) return;

    chrome.storage.sync.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== false; 
        toggle.checked = isEnabled;
        
        if (!isEnabled) {
            statusDiv.innerText = "Выключено";
            statusDiv.className = "status-box disabled";
        } else {
            checkOverlayStatus();
        }
    });

    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.sync.set({ enabled: isEnabled }, () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0] && tabs[0].url.includes("discord-sensor.com")) {
                    chrome.tabs.reload(tabs[0].id);
                }
                window.close(); 
            });
        });
    });

    function checkOverlayStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (!tabs[0]) return;

            chrome.tabs.sendMessage(tabs[0].id, {action: "checkStatus"}, (response) => {
                if (chrome.runtime.lastError || !response) {
                    statusDiv.innerText = "Откройте discord-sensor.com";
                    statusDiv.className = "status-box disabled";
                    return;
                }

                if (response.found) {
                    statusDiv.innerText = "Оверлей удален ✅";
                    statusDiv.className = "status-box found";
                } else {
                    statusDiv.innerText = "Оверлей не найден";
                    statusDiv.className = "status-box not-found";
                }
            });
        });
    }
});