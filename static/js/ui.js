console.log('ui.js loaded')

class Ui {
    constructor() {
        this.albumNames
        this.trackNames
        this.trackSizes
        this.albumId
        this.trackId // do wywalenia
        this.dispId
        this.rows
        this.playlist = []
        this.playId
    }

    clicks() {
        var classRoot = this
        let audioElem = $('#playback-audio')[0]
        let timeCtrl = $('#playback-range')

        $('#sidebar').children().each( function (i) {
            this.addEventListener('click', function () {
                classRoot.dispId = i
                net.getList()
            })
        })

        $('#playback-button-prev').on('click', function () {
            music.loadPrev(classRoot.data)
        })

        $('#playback-button-flow').on('click', function () {
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
        })

        $('#playback-button-next').on('click', function () {
            music.loadNext(classRoot.data)
        })

        $('#playback-range').on('input', function () {
            audioElem.currentTime = timeCtrl.val()
        })

        $('#playback-audio').on('timeupdate', function () {
            timeCtrl.val(audioElem.currentTime)
            if (audioElem.currentTime >= audioElem.duration) {
                $('#playback-button-flow').html('PLAY')
                timeCtrl.val(0)
                audioElem.pause()
            }
        })

    }

    firstRun (data) {
        this.albumNames = data.albumNames
        this.trackNames = data.trackNames
        this.trackSizes = data.trackSizes
        this.albumId = 0
        this.trackId = 0
        this.dispId = 0
        this.fillSidebar(this.albumNames)

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
    }

    loadAlbum(data) {
        this.trackNames = data.trackNames
        this.trackSizes = data.trackSizes

        this.fillTable()
    }

    fillTable() {
        let classRoot = this
        $('#dispHead').html(this.albumNames[this.dispId])
        $('#display-container').css('background-image', 'url(\'/static/covers/' + this.albumNames[this.dispId] + '.jpg\')')
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
                contPlay.innerHTML = 'PLAY'
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
                    cells[0].children[0].innerHTML = 'PLAY'
                    cells[0].children[0].className = 'contButton'
                }
                    
                for (let k in this.playlist) {
                    if (cells[1].innerHTML === this.playlist[k].split('/')[1]) {
                        console.warn('pass')
                        cells[0].children[1].innerHTML = 'ADDED'
                        cells[0].children[1].className = 'playlistActive'
                        cells[0].children[1].removeEventListener('click', ui.addHandler)
                        cells[0].children[1].addEventListener('click', ui.removeHandler)
                        break
                    } else {
                        cells[0].children[1].innerHTML = 'ADD'
                        cells[0].children[1].className = 'contButton'
                        cells[0].children[1].addEventListener('click', ui.addHandler)
                    }
                }
                if (cells[1].innerHTML === this.playlist[this.playId].split('/')[1]) {
                    console.warn('pass')
                    cells[0].children[0].innerHTML = 'PLAYING'
                    cells[0].children[0].className = 'contButtonActive'
                    cells[0].children[0].removeEventListener('click', ui.playHandler)

                    let cellz = Array.from(cells[0].parentElement.children)
                    for (let i in cellz) {
                        cellz[i].className = 'activeCell'
                    }
                    break
                } else {
                    cells[0].children[0].innerHTML = 'PLAY'
                    cells[0].children[0].className = 'contButton'
                    cells[0].children[0].addEventListener('click', ui.playHandler)
                }
            }
        }
            
        if (this.dispId == this.albumId) {
            
        }
    }

    updateCtrl() {
        let audioElem = $('#playback-audio')[0]
        $('#playback-info').html(ui.playlist[ui.playId].split('/').join(' / '))
        if (audioElem.paused) {
            $('#playback-button-flow').html('PLAY')
        } else {
            $('#playback-button-flow').html('PAUSE')
        }
        $('#playback-range').attr('max', parseInt(audioElem.duration))
    }

    playHandler () {
        ui.albumId = ui.dispId
        ui.trackId = this.parentElement.savedId
        music.albumPlaylist(this.parentElement.savedId)
        this.removeEventListener('click', ui.playHandler)
    }

    addHandler () {
        ui.playlist.push(ui.albumNames[ui.dispId] + '/' + ui.trackNames[this.parentElement.savedId])
        ui.updateTable()
        this.removeEventListener('click', ui.addHandler)
    }

    removeHandler () {
        if (ui.playlist.length != 1) {
            let text = this.parentElement.parentElement.children[1].innerHTML
            let index = -1
            for (let k in ui.playlist)
                if (text == ui.playlist[k].split('/')[1])
                    index = k
            console.log(index)
            if (index != -1)
                ui.playlist.splice(index, 1)

            if (index == ui.playId)
                music.loadTrack()

            if (index < ui.playId || ui.playId == ui.playlist.length) {
                ui.playId -= 1
                music.loadTrack()
            }
            
            ui.updateTable()

            this.removeEventListener('click', ui.removeHandler)
        }
    }
}