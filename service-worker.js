// When you specify "type": "module" in the manifest background,
// you can include the service worker as an ES Module,as
//importScripts('./options/jobby'); //not supported
import { jobUrls } from './js/jobby.js';


// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  for (const [name, url] of Object.entries(jobUrls)) {
    chrome.contextMenus.create({
      id: url, //should switch this out**TODO
      title: name,
      type: 'normal',
      contexts: ['selection']
    });
  }
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const tld = item.menuItemId;
  if(tld == 'All'){
    console.log("Chose All: ", tld)
    let s = 0;
    for (const u of Object.values(jobUrls)) {
      if(u == tld){
        console.log("Skipping All: ", u)
        continue
      }
      const url = new URL(`${u}${item.selectionText.toLowerCase()}/`);
      s++;
      chrome.tabs.create({ url: url.href, index: tab.index + s });
    }
    return;
  }

  const url = new URL(`${tld}${item.selectionText.toLowerCase()}/`);
  //url.searchParams.set('q', item.selectionText);
  //console.log("da URL be:", url)
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

//browser.runtime.onMessage.addListener(bgLoop); //oldie 

//chrome.runtime.onMessage.addListener(bgLoop);
//chrome.notifications.onClicked.addListener(notifClicked);