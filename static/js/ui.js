console.log("ui.js loaded")

class Ui {
    constructor() {
        this.data
        this.rows
        this.trackId = 0
        this.albumId = 0
    }

    clicks() {
        var classRoot = this
        let audioElem = $('#playback-audio')[0]
        let timeCtrl = $('#playback-range')
        $('#sidebar').children().each( function (i) {
            this.addEventListener("click", function () {
                net.getList(classRoot.data.albums[i])
            })
        })
        $('#playback-button-prev').on('click', function () {
            music.loadPrev(classRoot.data)
        })
        $('#playback-button-flow').on('click', function () {
            ui.updateCtrl(ui.data, ui.trackId)
            if (audioElem.paused) {
                if (audioElem.currentTime == audioElem.duration) {
                    timeCtrl.val(0)
                }
                audioElem.currentTime = timeCtrl.val()
                audioElem.play()
                this.innerHTML = "PAUSE"
            } else {
                audioElem.pause()
                this.innerHTML = "PLAY"
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
        this.data = data
        this.fillSidebar(data.albums)

        this.fillTable(data)
        music.loadTrack(data, 0)
    }

    fillSidebar(names) {
        for (var i in names) {
            var cover = new Image()
            cover.className = 'album'
            cover.src = '/static/covers/' + names[i] + '.jpg'
            $('#sidebar').append(cover)
        }
        this.clicks()
    }

    fillTable(data) {
        let classRoot = this
        this.data = data
        $('#dispHead').html(data.album)
        $('#display-container').css('background-image', 'url("/static/covers/' + data.album + '.jpg")')
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

        if (data.files.length == 0) {
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
            for (var i in data.files) {
                let row = document.createElement('tr')
                row.className = 'contRow'
                row.isActive = false
                rows.push(row)
                row.addEventListener('mouseenter', function () {
                    //if (!this.isActive) {
                    //    let cells = Array.from(this.children)
                    //    cells[0].innerHTML = ''
                    //}
                })
                row.addEventListener('mouseleave', function () {
                    //if (!this.isActive) {
                    //    let cells = Array.from(this.children)
                    //    cells[0].innerHTML = parseInt(cells[0].savedId) + 1
                    //}
                })

                let cell = document.createElement('td')
                cell.savedId = i
                cell.innerHTML = (parseInt(i) + 1)
                cell.className = 'contCell'
                cell.id = 'contPlay'
                cell.isClicked = false
                row.appendChild(cell)
                cell.addEventListener('click', function () {
                    classRoot.albumId = data.albums.indexOf(data.album)
                    classRoot.trackId = this.savedId
                    music.loadTrack(data, classRoot.trackId)
                })

                cell = document.createElement('td')
                cell.innerHTML = data.files[i]
                    .substring(3)   // Odcięcie numeracji pomocniczej
                    .slice(0, -4)   // Odcięcie typu pliku
                cell.className = 'contCell'
                row.appendChild(cell)

                cell = document.createElement('td')
                cell.innerHTML = (data.sizes[i] / 1024 / 1024).toFixed(2) + ' MB'
                cell.className = 'contCell'
                row.appendChild(cell)

                contTable.appendChild(row)
            }
        }
        this.updateTable(data, this.trackId)
    }

    updateTable (data, elemId) {
        if (data.album == data.albums[ui.albumId]) {
            for (let i in ui.rows) {
                ui.rows[i].isActive = false
                let cells = Array.from(ui.rows[i].children)
                for (let j in cells) {
                    cells[j].className = 'contCell'
                }
                cells[0].innerHTML = (parseInt(cells[0].savedId) + 1)
            }
            ui.rows[elemId].parentElement.isActive = !ui.rows[elemId].parentElement.isActive

            let cells = Array.from(ui.rows[elemId].children)
            for (let i in cells) {
                cells[i].className = 'activeCell'
            }
            cells[0].innerHTML = 'LOADED'
        } else {
            console.log('ignored')
        }
    }

    updateCtrl(data, id) {
        let audioElem = $('#playback-audio')[0]
        $('#playback-info').html(this.data.album + ' / ' + this.data.files[id])
        if (audioElem.paused) {
            $('#playback-button-flow').html('PLAY')
        } else {
            $('#playback-button-flow').html('PAUSE')
        }
        $('#playback-range').attr('max', parseInt(audioElem.duration))
    }
}