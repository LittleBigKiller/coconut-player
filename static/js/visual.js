console.log('visual.js loaded')

class Visual {
    constructor() {
        this.genElems()
        this.bars = []
    }

    genElems() {
        let parent = $('#visual-container')
        console.log(music.analyser.frequencyBinCount)
        for (let i = 0; i < music.analyser.frequencyBinCount; i++) {
            let bar = document.createElement('div')
            bar.className = 'visBar'
            //bar.style.width = parent.css('width')
            console.log(parseInt(parent.css('width').slice(0, -2)))
        }
    }

    render() {
        requestAnimationFrame(this.render.bind(this)); // bind(this) przekazuje this do metody render
        $("#visual-temp").html(music.getTrackData()) // wyświetlenie danych audio w div-ie
    }

}