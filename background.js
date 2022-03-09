const storageKeys = {
    isOpen: 'isOpen',
    todos: 'todos',
    windowId: 'windowId'
}

function openNewWindow() {
    chrome.storage.sync.get([storageKeys.isOpen, storageKeys.windowId], async function(result) {
        const {isOpen, windowId} = result
        if(isOpen) {
            chrome.storage.sync.remove(storageKeys.isOpen);
            chrome.windows.remove(windowId)
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

function removeWindowHandler(targetWindowId) {
    chrome.storage.sync.get(storageKeys.windowId,  function(result) {
        const {windowId} = result
        if(targetWindowId === windowId) {
            chrome.storage.sync.remove('isOpen');
            chrome.storage.sync.remove('windowId');
        }
    })
}

function commandHandler(command) {
    switch (command) {
        case 'open:window':
            openNewWindow()
            break;
    }
}

chrome.action.onClicked.addListener(openNewWindow)
chrome.windows.onRemoved.addListener(removeWindowHandler)

chrome.commands.onCommand.addListener(commandHandler);