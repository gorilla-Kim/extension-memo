let windowId = 0

function openNewWindow(windowId) {
    chrome.storage.sync.get('isOpen', async function(result) {
        if(result.isOpen) {
            chrome.storage.sync.remove('isOpen');
            chrome.windows.remove(windowId)
        } else {
            chrome.storage.sync.set({isOpen: true});
            chrome.windows.create({
                url: chrome.runtime.getURL("/newTab/index.html"),
                type: "popup",
                height: 800,
                width: 500
            }, function(window){
                windowId = window.id
            })
        }
    });
}

chrome.action.onClicked.addListener(()=>openNewWindow(windowId))
chrome.windows.onRemoved.addListener(function(targetWindowId) {
    if(targetWindowId === windowId) {
        chrome.storage.sync.remove('isOpen');
    }
})