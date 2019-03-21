console.log('net.js loaded')

class Net {
    constructor() {
        this.firstReq()
    }

    firstReq() {
        console.log('net.firstReq')
        $.ajax({
            data: {
                type: 'FIRST'
            },
            type: 'POST',
            success: function (data) {
                ui.firstRun(JSON.parse(data))
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
        })
    }

    getList() {
        console.log('net.getList')
        $.ajax({
            data: {
                type: 'ALBUM',
                albumId: ui.dispId,
            },
            type: 'POST',
            success: function (data) {
                ui.loadAlbum(JSON.parse(data))
            },
            error: function (xhr, status, error) {
                console.error(error)
            },
        })
    }

    /*async loadCustom() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                data: {
                    type: 'GET-CUSTOM',
                },
                type: 'POST',
                success: function (data) {
                    resolve(JSON.parse(data))
                },
                error: function (xhr, status, error) {
                    console.log(error)
                    console.log(xhr)
                },
            })
        })
    }

    sendCustom() {
        let list = []
        for (let i in ui.customPlaylist)
            list.push(ui.customPlaylist[i])
        $.ajax({
            data: {
                type: 'SEND-CUSTOM',
                custom: list,
            },
            type: 'POST',
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.error(data)
            },
            error: function (xhr, status, error) {
                console.error(error)
            },
        })
    }*/
}