var http = require("http")
var qs = require("querystring")
var fs = require("fs")
var PORT = 5500

var albumPaths = []
var trackPaths = []

var server = http.createServer(function(req,res){
    console.log(req.method + ' ' + req.url)
    switch (req.method) {
        case "GET":
            getResponse(req, res)
            break
        case "POST":
            res.writeHead(200,{"content-type":"text/html; charset=utf-8"})
            postResponse(req, res)
            break
    } 
})

server.listen(PORT, function(){
   console.log("serwer startuje na porcie " + PORT)
   init()
})

function init() {
    console.log("init")
    fs.readdir(__dirname + '/static/mp3', function (err, dirs) {
        albumPaths = dirs
    })
}

function getResponse(req, res) {
    if (req.url.indexOf(".mp3") != -1) {
        fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { "Content-type": "audio/mpeg; charset=utf-8" })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf(".wav") != -1) {
        fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { "Content-type": "audio/wav; charset=utf-8" })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf(".js") != -1) {
        fs.readFile(__dirname + "/static/" + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { "Content-type": "aplication/javascript; charset=utf-8" })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf(".css") != -1) {
        fs.readFile(__dirname + "/static/" + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { "Content-type": "text/css; charset=utf-8" })
            res.write(data)
            res.end()
        })
    } else if (req.url.indexOf(".jpg") != -1) {
        fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
            if (error) {
                fs.readFile(__dirname + '/static/covers/default.jpg', function (error, dataDef) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg; charset=utf-8' });
                    res.write(dataDef);
                    res.end();
                })
            } else {
                res.writeHead(200, { "Content-type": "image/jpeg; charset=utf-8" })
                res.write(data)
                res.end()
            }
        })
    } else if (req.url.indexOf(".png") != -1) {
        fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
            res.writeHead(200, { "Content-type": "image/png; charset=utf-8" })
            res.write(data)
            res.end()
        })
    } else {
        fs.readFile(__dirname + "/static/index.html", function (error, data) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write(data)
            res.end()
        })
    }
}

function postResponse(req, res) {
    var reqData = "";

    req.on("data", function (data) {
        reqData += data;
    })

    req.on("end", function () {
        var finish = qs.parse(reqData)
        var resData = {}
        if (finish.type == 'FIRST') {
            fs.readdir(__dirname + '/static/mp3', function (err, files) {
                if (err) {
                    return console.error(err)
                }
                finish.albums = files
                finish.album = files[0]
                fs.readdir(__dirname + '/static/mp3/' + files[0], function (err, files) {
                    if (err) {
                        return console.error(err)
                    }
                    finish.files = files
                    finish.sizes = []
                    for (var i in files) {
                        console.log(fs.statSync(__dirname + '/static/mp3/' + finish.album + '/' + files[i]))
                        finish.sizes.push(fs.statSync(__dirname + '/static/mp3/' + finish.album + '/' + files[i]).size)
                    }
                    res.end(JSON.stringify(finish))
                })
            })
        } else if (finish.type == 'NEXT') {
            fs.readdir(__dirname + '/static/mp3', function (err, files) {
                if (err) {
                    return console.error(err)
                }
                finish.albums = files
                fs.readdir(__dirname + '/static/mp3/' + finish.album, function (err, files) {
                    if (err) {
                        return console.error(err)
                    }
                    finish.files = files
                    finish.sizes = []
                    for (var i in files) {
                        finish.sizes.push(fs.statSync(__dirname + '/static/mp3/' + finish.album + '/' + files[i]).size)
                    }
                    res.end(JSON.stringify(finish))
                })
            })
        } else if (finish.type == 'TRACK') {
            fs.readFile(__dirname + '/static/mp3/' + finish.album + '/' + finish.track, function (error, file) {
                finish.file = file
                res.end(JSON.stringify(finish))
            })
        }
    })
}