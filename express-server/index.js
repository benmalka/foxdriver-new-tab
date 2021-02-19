const express = require("express");
const app = express();
const path = require("path")

app.get("/firefox/:tabId", (req, res) => {
    const tabId = req.params.tabId
    res.send(`<html><head><title>${tabId}</title></head><body><h1>TabId: ${tabId}</h1></body></html>`)
})

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/static/index.html"))
})

module.exports = app