console.log('visual.js loaded')

class Visual {
    constructor() {
        this.barsTopLeft = []
        this.barsBotLeft = []
        this.barsTopRight = []
        this.barsBotRight = []
        this.doRender = false
        this.genElems()
    }

    genElems() {
        let parent = $('#visual-container')
        for (let i = 0; i < music.analyser.frequencyBinCount; i++) {
            let bar = document.createElement('div')
            this.barsTopLeft.push(bar)
            bar.className = 'visBarTop'
            let width = 100 / music.analyser.frequencyBinCount / 2
            bar.style.width = width - 0.1 + '%'
            bar.style.left = width * i - 0.1 + '%'
            parent[0].append(bar)
        }
        for (let i = 0; i < music.analyser.frequencyBinCount; i++) {
            let bar = document.createElement('div')
            this.barsBotLeft.push(bar)
            bar.className = 'visBarBottom'
            //let width = parseInt(parent.css('width').slice(0, -2)) / music.analyser.frequencyBinCount / 2
            let width = 100 / music.analyser.frequencyBinCount / 2
            bar.style.width = width - 0.1 + '%'
            bar.style.left = width * i - 0.1 + '%'
            parent[0].append(bar)
        }
        for (let i = 0; i < music.analyser.frequencyBinCount; i++) {
            let bar = document.createElement('div')
            this.barsTopRight.push(bar)
            bar.className = 'visBarTop'
            let width = 100 / music.analyser.frequencyBinCount / 2
            bar.style.width = width - 0.1 + '%'
            bar.style.right = width * i - 0.1 + '%'
            parent[0].append(bar)
        }
        for (let i = 0; i < music.analyser.frequencyBinCount; i++) {
            let bar = document.createElement('div')
            this.barsBotRight.push(bar)
            bar.className = 'visBarBottom'
            let width = 100 / music.analyser.frequencyBinCount / 2
            bar.style.width = width - 0.1 + '%'
            bar.style.right = width * i - 0.1 + '%'
            parent[0].append(bar)
        }
        this.doRender = true
        this.render()
    }
    
    remElems() {
        let parent = $('#visual-container')
        while (parent[0].firstChild) {
            parent[0].removeChild(parent[0].firstChild);
        }
        this.barsTopLeft = []
        this.barsBotLeft = []
        this.barsTopRight = []
        this.barsBotRight = []
        this.doRender = false
    }

    render() {
        if (this.doRender) {
            requestAnimationFrame(this.render.bind(this))
            for (let i = 0; i < music.analyser.frequencyBinCount; i++) {
                let td = music.getTrackData()[i]
                let r = td
                let g = 255 - td
                let b = 0
                this.barsTopLeft[i].style.height = td / 2 + 'px'
                this.barsTopLeft[i].style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')'
                this.barsBotLeft[i].style.height = td / 2 + 'px'
                this.barsBotLeft[i].style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')'
                this.barsTopRight[i].style.height = td / 2 + 'px'
                this.barsTopRight[i].style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')'
                this.barsBotRight[i].style.height = td / 2 + 'px'
                this.barsBotRight[i].style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')'
            }
        }
    }

}