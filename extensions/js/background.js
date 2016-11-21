var isLocal = false;
var g_uri = isLocal ? 'http://localhost:3001' : 'http://torch.gaopinghuang.com';

// contact between background and popup
function updateDomInfo(info) {
    console.log(info)

    // Credit: http://stackoverflow.com/a/13549245/4246348
    chrome.extension.onConnect.addListener(function(port) {
        console.log("Connected .....");
        port.onMessage.addListener(function(msg) {
        // console.log("message recieved "+ msg);
        port.postMessage(info);
    });
    });
}

function prepareInfo(info, tab) {
    var msg = {
        url: info.srcUrl,
        text: info.selectionText,
        title: tab.title,
        menuItemId: info.menuItemId,
        isPDF: true
    };

    // not in PDF viewer, get location
    if (typeof info.srcUrl === 'undefined') {  
        msg.url = info.pageUrl;
        msg.isPDF = false;
        chrome.tabs.sendMessage(tab.id, {from: 'eventpage', "message": "get_location"}, 
            function(response) {
                if (response) {
                    msg.location = response.location;
                }
        })
    }

    return msg;
}

// The onClicked callback function.
function onClickHandler(info, tab) {
    var msg = prepareInfo(info, tab);

    if (info.menuItemId === 'more-detail' || info.menuItemId === 'save-direct') {
        // Credit: http://stackoverflow.com/a/10341102/4246348
        chrome.tabs.create({
            url: chrome.extension.getURL('dialog.html'),
            active: false
        }, function(tab) {
            var w = 650,
                h = 320,
                left = (screen.width/2) - (w/2),
                top = (screen.height/2) - (h/2);

            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                width: w,
                height: h,
                left: left,
                top: top,
                incognito: false
                // incognito, top, left, ...
            }, function(window) {
                // get project id if saved
                $.ajax({
                    url: g_uri + '/api/website/info',
                    method: 'POST',
                    data: {'website': msg.url}
                }).success(function(response) {
                    if (response && response.length) {
                        msg.project = response[0]
                    }
                    updateDomInfo(msg)
                }).error(function(response) {
                    console.log('error')
                })
            });
        })
    }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    // chrome.contextMenus.create({'title': 'Save directly', 'contexts': ['all'], 'id': 'save-direct'});
    chrome.contextMenus.create({'title': 'TORC save', 'contexts': ['all'], 'id': 'more-detail'});
    console.log('Buttons created')

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  // console.log("About to try creating an invalid item - an error about " +
  //    "duplicate item child1 should show up");
  // chrome.contextMenus.create({"title": "Oops", "id": "child1"}, function() {
  //    if (chrome.extension.lastError) {
  //        console.log("Got expected error: " + chrome.extension.lastError.message);
  //    }
  // });
})

// If I have popup.html, this will not fire!!!
// chrome.browserAction.onClicked.addListener(function(tab) {
//     
//     chrome.tabs.executeScript(tab.id, {
//         file: 'content.js'
//     }, function(){
//         console.log(tab.id)
//     })
// })

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         switch (request.directive) {
//         case "popup-click":
//             // execute the content script
//             chrome.tabs.executeScript(null, { // defaults to the current tab
//                 file: "contentscript.js", // script to inject into page and run in sandbox
//                 allFrames: true // This injects script into iframes in the page and doesn't work before 4.0.266.0.
//             });
//             console.log('haha')
//             sendResponse({}); // sending back empty response to sender
//             break;
//         default:
//             // helps debug when request directive doesn't match
//             alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
//         }
//     }
// );