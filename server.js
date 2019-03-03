var http = require("http")
var qs = require("querystring")
var fs = require("fs")

var server = http.createServer(function(req,res){
    console.log(req.method + ' ' + req.url)
    //let filename = req.url.split('/')
    //filename = filename[filename.length - 1]
    //let decoded = decodeURIComponent(filename)
    switch (req.method) {
        case "GET":
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
                fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "aplication/javascript; charset=utf-8" })
                    res.write(data)
                    res.end()
                })
            } else if (req.url.indexOf(".css") != -1) {
                fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
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
            break;
        case "POST":
            res.writeHead(200,{"content-type":"text/html; charset=utf-8"})
            servResponse(req, res)
            break;

    } 
})

server.listen(5500, function(){
   console.log("serwer startuje na porcie 5500")
})

function servResponse(req, res) {
    var allData = "";

    req.on("data", function (data) {
        //console.log("data: " + data)
        allData += data;
    })

    req.on("end", function () {
        var finish = qs.parse(allData)
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