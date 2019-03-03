console.log('net.js loaded')

class Net {
    constructor() {
        this.firstReq()
    }

    firstReq() {
        $.ajax({
            data: {
                type: 'FIRST'
            },
            type: "POST",
            success: function (data) {
                ui.firstRun(JSON.parse(data))
            },
            error: function (xhr, status, error) {
                console.log(xhr)
            },
        })
    }

    getList(album) {
        $.ajax({
            data: {
                type: 'NEXT',
                album: album,
            },
            type: "POST",
            success: function (data) {
                //console.log(JSON.parse(data))
                ui.fillTable(JSON.parse(data))
            },
            error: function (xhr, status, error) {
                console.error(error)
            },
        })
    }

    
}