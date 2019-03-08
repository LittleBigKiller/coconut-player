console.log('ui.js loaded')

class Ui {
    constructor() {
        this.albumNames
        this.trackNames
        this.trackSizes
        this.albumId
        this.dispId
        this.rows
        this.playlist = []
        this.playId
        this.customPlaylist = []
        this.customOn = false
        this.customPlaying = false
        this.visOn = false
    }

    clicks() {
        var classRoot = this
        let audioElem = $('#playback-audio')[0]
        let timeCtrl = $('#playback-range')

        $('#sidebar').children().each( function (i) {
            this.addEventListener('click', function () {
                classRoot.dispId = i
                net.getList()
                ui.customOn = false
            })
        })

        $('#playback-button-prev').on('click', function () {
            music.loadPrev(classRoot.data)
        })

        $('#playback-button-flow').on('click', function () {
            ui.playbackFlow()
        })

        $('#playback-button-next').on('click', function () {
            music.loadNext(classRoot.data)
        })

        $('#playback-range').on('input', function () {
            audioElem.currentTime = timeCtrl.val()
        })

        $('#playback-audio').on('timeupdate', function () {
            timeCtrl.val(audioElem.currentTime)
            $('#playback-timestamps').html(ui.readableTime(audioElem.currentTime) + '/' + ui.readableTime(audioElem.duration))
            if (audioElem.currentTime >= audioElem.duration) {
                $('#playback-button-flow').html('PLAY')
                timeCtrl.val(0)
                audioElem.pause()
            }
            ui.updateCtrl()
        })

        $('#playback-volume').on('input', function () {
            audioElem.volume = $('#playback-volume').val()
        })

        $('#custom-load').on('click', function () {
            ui.customLoad(0)
        })

        $('#custom-display').on('click', function () {
            ui.customDisplay()
        })

        $('#playback-disp-switch').on('click', function () {
            console.log('LMAO')
            if (this.visOn) {
                $('#visual-container').css('display', 'none')
                $('#display-container').css('display', 'block')
            } else {
                $('#visual-container').css('display', 'block')
                $('#display-container').css('display', 'none')
            }
            this.visOn = !this.visOn
        })
    }

    firstRun (data) {
        this.albumNames = data.albumNames
        this.trackNames = data.trackNames
        this.trackSizes = data.trackSizes
        this.albumId = 0
        this.dispId = 0
        this.fillSidebar(this.albumNames)
        ui.albumNames.push('Custom Playlist')

        music.albumPlaylist(0)
        this.fillTable()
    }

    fillSidebar() {
        for (var i in this.albumNames) {
            var cover = new Image()
            cover.className = 'album'
            cover.src = '/static/covers/' + this.albumNames[i] + '.jpg'
            $('#sidebar').append(cover)
        }
        this.clicks()

        var cover = new Image()
        cover.className = 'album'
        cover.src = '/static/covers/custom.jpg'
        $('#sidebar').append(cover)
        
        cover.addEventListener('click', ui.customDisplay)
    }

    loadAlbum(data) {
        this.trackNames = data.trackNames
        this.trackSizes = data.trackSizes

        this.fillTable()
    }

    fillTable() {
        let classRoot = this
        if (ui.customOn) {
            $('#dispHead').html('Custom Playlist')
            $('#display-container').css('background-image', 'url(\'/static/covers/custom.jpg\')')
        } else {
            $('#dispHead').html(this.albumNames[this.dispId])
            $('#display-container').css('background-image', 'url(\'/static/covers/' + this.albumNames[this.dispId] + '.jpg\')')
        }
        $('#contTable').html('')
        var contTable = document.getElementById('contTable')
        let row = document.createElement('tr')
        row.className = 'headRow'

        let cell = document.createElement('td')
        cell.innerHTML = '#'
        cell.className = 'headCell'
        row.appendChild(cell)

        cell = document.createElement('td')
        cell.innerHTML = 'Track Name'
        cell.className = 'headCell'
        row.appendChild(cell)

        cell = document.createElement('td')
        cell.innerHTML = 'Size'
        cell.className = 'headCell'
        row.appendChild(cell)
        contTable.appendChild(row)

        if (this.trackNames.length == 0) {
            let row = document.createElement('tr')
            row.className = 'contRow'

            let cell = document.createElement('td')
            cell.innerHTML = 'no files found'
            cell.colSpan = 3
            cell.className = 'emptyCell'
            row.appendChild(cell)

            contTable.appendChild(row)
        } else {
            classRoot.rows = []
            let rows = classRoot.rows
            for (let i in classRoot.trackNames) {
                let row = document.createElement('tr')
                row.className = 'contRow'
                rows.push(row)

                let cell = document.createElement('td')
                cell.savedId = i
                cell.className = 'contCell'
                cell.id = 'contCtrl'
                row.appendChild(cell)

                let contPlay = document.createElement('div')
                contPlay.innerHTML = 'LOAD'
                contPlay.className = 'contButton'
                contPlay.id = 'contPlay'
                cell.append(contPlay)
                contPlay.addEventListener('click', ui.playHandler)

                let contAdd = document.createElement('div')
                contAdd.innerHTML = 'ADD'
                contAdd.className = 'contButton'
                contAdd.id = 'contAdd'
                cell.append(contAdd)
                contAdd.addEventListener('click', ui.addHandler)

                cell = document.createElement('td')
                cell.innerHTML = classRoot.trackNames[i]
                    //.substring(3)   // Odcięcie numeracji pomocniczej
                    //.slice(0, -4)   // Odcięcie typu pliku
                cell.className = 'contCell'
                row.appendChild(cell)

                cell = document.createElement('td')
                cell.innerHTML = (classRoot.trackSizes[i] / 1024 / 1024).toFixed(2) + ' MB'
                cell.className = 'contCell'
                row.appendChild(cell)

                contTable.appendChild(row)
            }
        }
        this.updateTable()
    }

    updateTable () {
        for (let i in this.rows) {
            let cells = Array.from(this.rows[i].children)

            for (let j in cells) {
                cells[j].className = 'contCell'

                if (this.dispId == this.albumId) {
                    cells[0].children[0].innerHTML = 'LOAD'
                    cells[0].children[0].className = 'contButton'
                }

                cells[0].children[1].innerHTML = 'ADD'
                cells[0].children[1].className = 'contButton'
                cells[0].children[1].addEventListener('click', ui.addHandler)
                
                for (let k in this.customPlaylist) {
                    if (cells[1].innerHTML === this.customPlaylist[k].split('/')[1]) {
                        cells[0].children[1].innerHTML = 'ADDED'
                            cells[0].children[1].className = 'playlistActive'
                        cells[0].children[1].removeEventListener('click', ui.addHandler)
                        cells[0].children[1].addEventListener('click', ui.removeHandler)
                        break
                    }
                }
                if ((!ui.customOn && !ui.customPlaying) || (ui.customOn && ui.customPlaying)) {
                    if (cells[1].innerHTML === this.playlist[this.playId].split('/')[1]) {
                        cells[0].children[0].innerHTML = 'LOADED'
                        cells[0].children[0].className = 'contButtonActive'
                        cells[0].children[0].removeEventListener('click', ui.playHandler)

                        let cellz = Array.from(cells[0].parentElement.children)
                        for (let i in cellz) {
                            cellz[i].className = 'activeCell'
                        }
                        break
                    } else {
                        cells[0].children[0].innerHTML = 'LOAD'
                        cells[0].children[0].className = 'contButton'
                        cells[0].children[0].addEventListener('click', ui.playHandler)
                    }
                }
            }
        }
            
        if (this.dispId == this.albumId) {
            
        }
    }

    updateCtrl() {
        let audioElem = $('#playback-audio')[0]
        $('#playback-info').html(ui.playlist[ui.playId].split('/').join(' / '))
        $('#playback-range').val(audioElem.currentTime)
        if (audioElem.paused) {
            $('#playback-button-flow').html('PLAY')
        } else {
            $('#playback-button-flow').html('PAUSE')
        }
        $('#playback-range').attr('max', parseInt(audioElem.duration))
        $('#playback-timestamps').html(this.readableTime(audioElem.currentTime) + '/' + this.readableTime(audioElem.duration))
    }

    playHandler () {
        if (ui.customOn) {
            ui.customLoad(this.parentElement.savedId)
            ui.customPlaying = true
        } else {
            ui.albumId = ui.dispId
            music.albumPlaylist(this.parentElement.savedId)
            ui.customPlaying = false
        }
        this.removeEventListener('click', ui.playHandler)
        ui.playbackFlow();
    }

    addHandler () {
        ui.customPlaylist.push(ui.albumNames[ui.dispId] + '/' + ui.trackNames[this.parentElement.savedId])
        ui.updateTable()        
        this.removeEventListener('click', ui.addHandler)

        if (ui.customPlaying)
            ui.customLoad(ui.playId)
            setTimeout(ui.playbackFlow, 10)
    }

    removeHandler () {
        if (ui.customPlaylist.length != 0) {
            let text = this.parentElement.parentElement.children[1].innerHTML
            let index = -1
            for (let k in ui.customPlaylist)
                if (text == ui.customPlaylist[k].split('/')[1])
                    index = k
            if (index != -1)
                ui.customPlaylist.splice(index, 1)

            if (index == ui.playId)
                music.loadTrack()

            if (ui.customPlaying) {
                if (index < ui.playId)
                    ui.playId -= 1

                if (ui.playId == ui.customPlaylist.length) {
                    ui.playId -= 1
                    music.loadTrack()
                }
                ui.customLoad(ui.playId)
            }
            
            ui.updateTable()
            if (ui.customOn) {
                ui.customDisplay()
                setTimeout(ui.playbackFlow, 10)
            }

            this.removeEventListener('click', ui.removeHandler)
        }
    }

    playbackFlow() {
        music.audioContext.resume()
        let audioElem = $('#playback-audio')[0]
        let timeCtrl = $('#playback-range')
        ui.updateCtrl()
        if (audioElem.paused) {
            if (audioElem.currentTime == audioElem.duration) {
                timeCtrl.val(0)
            }
            audioElem.currentTime = timeCtrl.val()
            audioElem.play()
            this.innerHTML = 'PAUSE'
        } else {
            audioElem.pause()
            this.innerHTML = 'PLAY'
        }
    }

    customDisplay() {
        ui.customOn = true
        ui.trackNames = []
        ui.albumId = ui.albumNames.length - 1
        console.log(ui.customPlaylist)
        for (let i in ui.customPlaylist) {
            console.log(ui.customPlaylist[i].split('/')[1])
            ui.trackNames.push(ui.customPlaylist[i].split('/')[1])
        }
        ui.fillTable()
        ui.updateTable()
    }

    customLoad(id) {
        if (ui.customPlaylist.length == 0) {
            console.error('custom jest pusty')
        } else {
            ui.playlist = []
            ui.playId = id
            for (let i in ui.customPlaylist) {
                ui.playlist.push(ui.customPlaylist[i])
            }
            music.loadTrack()
        }
    }

    readableTime (tempTime) {
        let tempSeconds = parseInt(tempTime % 60)
        let tempMinutes = parseInt((tempTime / 60) % 60)
        //let tempHours = parseInt((tempTime / (60 * 60)) % 24)

        //tempHours = (tempHours < 10) ? "0" + tempHours : tempHours
        tempMinutes = (tempMinutes < 10) ? "0" + tempMinutes : tempMinutes
        tempSeconds = (tempSeconds < 10) ? "0" + tempSeconds : tempSeconds
        //tempHours + ":" + 
        return (tempMinutes + ":" + tempSeconds)
    }
}