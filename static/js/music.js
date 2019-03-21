console.log('music.js loaded')

class Music {
    constructor() {
        this.audioElem = $('#playback-audio')
        this.audioElem.on("ended", function () { music.loadNext() })
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext()
        this.source = this.audioContext.createMediaElementSource(this.audioElem[0])
        this.analyser = this.audioContext.createAnalyser()
        this.source.connect(this.analyser)
        this.analyser.connect(this.audioContext.destination)
        this.analyser.fftSize = 64
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    }

    logAll() {
        console.log(this.audioElem)
        console.log(this.audioContext)
        console.log(this.source)
        console.log(this.analyser)
        console.log(this.dataArray)
    }

    getTestData() {
        this.analyser.getByteFrequencyData(this.dataArray)
        return this.dataArray.toString()
    }

    getTrackData() {
        this.analyser.getByteFrequencyData(this.dataArray)
        return this.dataArray
    }

    loadTrack() {
        this.audioElem.find('source').prop('src', '/static/mp3/' + ui.playlist[ui.playId])
        this.audioElem.trigger('load')
        this.audioElem.currentTime = 0
        this.audioElem[0].volume = $('#playback-volume').val()
        
        this.audioElem.on('loadeddata', function () {
            ui.updateCtrl()
            setTimeout(() => { ui.updateCtrl() }, 1000)
            setTimeout(() => { ui.updateCtrl() }, 2000)
            ui.updateTable()
        })
    }

    loadNext() {
        if (ui.playId != ui.playlist.length - 1) {
            ui.playId++
            this.loadTrack()
            ui.playbackFlow()
        }
    }

    loadPrev() {
        if (ui.playId != 0) {
            ui.playId--
            this.loadTrack()
            ui.playbackFlow()
        }
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