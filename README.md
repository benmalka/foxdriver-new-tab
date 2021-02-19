# foxdriver-new-tab
A solution concept of how to run firefox automation on number of tabs.

Basically this solution uses an `express` server in the background to help us launch a static managment page that exposes several functions in the page global scope (view: [index.html](/express-server/static/index.html))
- createTab: creates a new tab by using the `window.open()` method
- closeTab: closes a tab by using `window.close()` method

Once we have launched our main tab with the managment page, we can evaluate the functions as so:
`const result = await mainTab.console.evaluateJSAsync('return createTab("' + tabId + '")');`
This will result opening a new tab with the url of "http://localhost:<PORT>/firefox/<TAB_ID>".
Now, in order to fetch that tab, we can use the `listTabs` method of the browser object, and look for the newly opened tab:
```
const tabList = await browser.listTabs()
for (let t of tabList){
    if (tabId === t.data.url.split("/firefox/")[1]){
        return t
    }
}
```
