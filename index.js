const Foxdriver = require('foxdriver');
const app = require("./express-server");

function startServer(){
    return new Promise(resolve => {
        const server = app.listen(() => {
            resolve({server: server, port: server.address().port})
        })
    })
}

async function openTab(tabId, browser, mainTab){
    const result = await mainTab.console.evaluateJSAsync(`return createTab("${tabId}")`);
    if (result){
        // wait until page is loaded
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const tabList = await browser.listTabs()
        for (let t of tabList){
            if (tabId === t.data.url.split("/firefox/")[1]){
                return t
            }
        }
    }
}

(async () => {
    const { server, port } = await startServer()
    const { browser, tab } = await Foxdriver.launch({
        url: `http://localhost:${port}/`,
        customPrefs: {
            "dom.disable_open_during_load": false //to enable popups
        }
    });

    // Attach main tab
    await tab.attach();
    // enable actor
    await tab.console.startListeners();
    // wait until page is loaded
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // evaluate
    let result = await tab.console.evaluateJSAsync(`return document.title`);
    console.log("Main Tab title:", result);

    //Open a new tab
    const newTab = await openTab("test", browser, tab);
    //Attach to it
    await newTab.attach();
    // enable actor
    await newTab.console.startListeners();
    // evaluate
    result = await newTab.console.evaluateJSAsync(`return document.title`);
    console.log("New Tab title:", result);
    
    
    // close browser
    browser.close();
    server.close();
})()