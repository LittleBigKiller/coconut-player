console.log('music.js loaded')

class Music {
    constructor() {
        this.audioElem = $('#playback-audio')
    }

    loadTrack(data, id) {
        let classRoot = this
        console.log('music.loadTrack')
        ui.trackId = id
        this.audioElem.find('source').prop("src", '/static/mp3/' + data.album + '/' + data.files[id])
        this.audioElem.trigger('load')
        data.id = id
        
        this.audioElem.bind('loadeddata', function () {
            console.log('track loaded')
            ui.updateCtrl(data, id)
            ui.updateTable(data, id)
        })
    }

    loadNext(data) {
        console.log(data.files)
        if (ui.trackId != data.files.length - 1) {
            ui.trackId++;
        }

        this.loadTrack(data, ui.trackId)
    }

    loadPrev(data) {
        console.log('music.loadPrev')
        if (ui.trackId != 0) {
            ui.trackId--;
        }

        this.loadTrack(data, ui.trackId)
    }

    flowCtrl() {
        console.log('music.flowCtrl')
    }
}