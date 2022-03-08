const storageKeys = {
    isOpen: 'isOpen',
    todos: 'todos',
    windowId: 'windowId'
}

function openNewWindow() {
    chrome.storage.sync.get(storageKeys.isOpen, async function(result) {
        if(result.isOpen) {
            chrome.storage.sync.remove(storageKeys.isOpen);
            chrome.storage.sync.get(storageKeys.windowId,  function(result) {
                const {windowId} = result
                chrome.windows.remove(windowId)
            })
        } else {
            chrome.storage.sync.set({isOpen: true});
            chrome.windows.create({
                url: chrome.runtime.getURL("/newTab/index.html"),
                type: "popup",
                height: 800,
                width: 500
            }, function(window){
                chrome.storage.sync.set({windowId: window.id});
            })
        }
    });
}

chrome.action.onClicked.addListener(()=>openNewWindow())
chrome.windows.onRemoved.addListener(function(targetWindowId) {
    chrome.storage.sync.get(storageKeys.windowId,  function(result) {
        const {windowId} = result
        if(targetWindowId === windowId) {
            chrome.storage.sync.remove('isOpen');
        }
    })
})