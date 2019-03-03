console.log('music.js loaded')

class Music {
    constructor() {
        this.audioElem = $('#playback-audio')
    }

    loadTrack() {
        this.audioElem.find('source').prop("src", '/static/mp3/' + ui.playlist[ui.playId])
        this.audioElem.trigger('load')
        
        this.audioElem.bind('loadeddata', function () {
            console.log('track loaded')
            setTimeout(() => {
                console.error('table')
                ui.updateCtrl()
            }, 100)
            ui.updateTable()
        })
    }

    loadNext() {
        if (ui.playId != ui.playlist.length - 1) ui.playId++;

        this.loadTrack()
    }

    loadPrev() {
        if (ui.playId != 0) ui.playId--;

        this.loadTrack()
    }

    albumPlaylist(id) {
        ui.playlist = []
        ui.playId = id
        for (let i in ui.trackNames) {
            ui.playlist.push(ui.albumNames[ui.albumId] + '/' + ui.trackNames[i])
        }
        this.loadTrack()
    }
}