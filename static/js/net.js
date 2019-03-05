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
}