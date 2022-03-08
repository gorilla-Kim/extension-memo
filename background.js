function openNewTap() {
    chrome.tabs.create({'url':'chrome://newtab'})
}
function openNewWindow() {
    chrome.windows.create({
        url: chrome.runtime.getURL("newTab.html"),
        type: "popup",
        height: 800,
        width: 500
    })
}
chrome.action.onClicked.addListener(openNewWindow)