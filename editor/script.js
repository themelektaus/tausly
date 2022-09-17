let wrapper

let playButton
let pauseButton
let stopButton
let clearButton

let side
let view
let log

let tausly
let canvasScaleThread

function loadSrcFile(editor, file, callback)
{
    fetch(file + "?" + Math.random())
        .then(x => x.text())
        .then(x =>
        {
            editor.setValue(x, -1)
            if (callback)
                callback()
        })
}

function updateCanvasScale()
{
    const canvas = tausly.canvas
        
    if (!playButton.getAttribute("disabled"))
    {
        canvas.style.scale = 1
        return
    }
    
    if (canvasScaleThread)
    {
        clearTimeout(canvasScaleThread)
        canvasScaleThread = undefined
    }
    
    canvasScaleThread = setTimeout(() =>
    {
        canvasScaleThread = undefined
        
        if (!playButton.getAttribute("disabled"))
            return
        
        const ratio = canvas.width / canvas.height
        
        const space = {
            width: view.clientWidth,
            height: view.clientHeight,
            ratio: undefined
        }
        
        space.ratio = space.width / space.height
        
        if (ratio < space.ratio)
        {
            canvas.style.scale = space.height / (canvas.height + 100)
            return
        }
        
        canvas.style.scale = space.width / (canvas.width + 100)
        
    }, 210)
}

window.onload = () =>
{
    const editor = ace.edit("code");
    editor.setOptions({
        behavioursEnabled: false,
        fixedWidthGutter: true,
        showFoldWidgets: false,
        displayIndentGuides: false,
        fontSize: "1em",
        fontFamily: "dejavu"
    })
    editor.renderer.setScrollMargin(8, 60)
    editor.renderer.setPadding(8)
    editor.session.setMode("ace/mode/tausly")
    
    side = document.querySelector("#side")
    
    const select = side.querySelector("select")
    
    select.dataset.previousIndex = select.selectedIndex
    
    select.onchange = function(e)
    {
        if (!this.value)
        {
            this.selectedIndex = this.dataset.previousIndex
            return
        }
        
        this.dataset.previousIndex = this.selectedIndex
        
        loadSrcFile(editor, this.value)
    }
    
    view = document.querySelector("#view")
    log = document.querySelector("#log")
    
    wrapper = document.querySelector("#wrapper")
    
    playButton = document.querySelector("#play-button")
    pauseButton = document.querySelector("#pause-button")
    stopButton = document.querySelector("#stop-button")
    clearButton = document.querySelector("#clear-button")
    
    tausly = new Tausly
    
    tausly.onRefresh = () => updateCanvasScale()
    
    tausly.onEcho = output =>
    {
        view.classList.add("with-log")
        
        const div = document.createElement("div")
        div.innerHTML = output
        log.appendChild(div)
        
        log.scrollTo({ top: log.scrollHeight, behavior: "smooth" })
        
        clearButton.removeAttribute("disabled")
        
        updateCanvasScale()
    }
    
    tausly.onRender = () =>
    {
        clearButton.removeAttribute("disabled")
    }
    
    tausly.onClear =() =>
    {
        clearButton.setAttribute("disabled", "disabled")
        view.classList.remove("with-log")
        
        const html = log.innerHTML
        log.innerHTML = ""
        
        if (html)
            updateCanvasScale()
    }
    
    playButton.onclick = async () =>
    {
        playButton.classList.remove("highlight")
        
        if (tausly.paused)
        {
            tausly.resume()
            
            side.classList.remove("visible")
            
            playButton.setAttribute("disabled", "disabled")
            pauseButton.removeAttribute("disabled")
            
            updateCanvasScale()
            
            return
        }
        
        playButton.setAttribute("disabled", "disabled")
        pauseButton.removeAttribute("disabled")
        stopButton.removeAttribute("disabled")
        
        side.classList.remove("visible")
        
        tausly.setSize(640, 480)
        
        tausly.load(editor.getValue())
        tausly.compile()
        
        tausly.run().then(() =>
        {
            side.classList.add("visible")
            
            playButton.removeAttribute("disabled")
            pauseButton.setAttribute("disabled", "disabled")
            stopButton.setAttribute("disabled", "disabled")
            
            updateCanvasScale()
        })
        
        updateCanvasScale()
    }
    
    pauseButton.onclick = () =>
    {
        tausly.pause()
        
        side.classList.add("visible")
        
        playButton.removeAttribute("disabled")
        pauseButton.setAttribute("disabled", "disabled")
        
        updateCanvasScale()
    }
    
    stopButton.onclick = () =>
    {
        tausly.stop()
    }
    
    clearButton.onclick = () =>
    {
        tausly.onClear()
        tausly.ctx.clearRect(0, 0, tausly.canvas.width, tausly.canvas.height)
    }
    
    wrapper.classList.add("visible")
    
    if (location.hash)
    {
        select.value = `${location.hash.substring(1)}.tausly`
        if (!select.value)
        {
            select.value = ""
            return
        }
        
        loadSrcFile(editor, select.value, () =>
        {
            playButton.classList.add("highlight")
            //playButton.setAttribute("disabled", "disabled")
            //setTimeout(() =>
            //{
            //    playButton.removeAttribute("disabled")
            //    playButton.click()
            //}, 1500)
        })
    }
}

window.addEventListener("keydown", e =>
{
    if (e.key == "Escape")
    {
        if (playButton.getAttribute("disabled"))
            return
        
        if (clearButton.getAttribute("disabled"))
            return
        
        clearButton.click()
        return
    }
    
    if (e.key == "Pause")
    {
        if (stopButton.getAttribute("disabled"))
            return
        
        stopButton.click()
        return
    }
    
    if (e.key == "F5")
    {
        e.preventDefault()
        
        if (e.ctrlKey)
        {
            wrapper.classList.remove("visible")
            setTimeout(() => location.reload(), 500)
            return
        }
        
        if (!playButton.getAttribute("disabled"))
        {
            playButton.click()
            return
        }
        
        if (!pauseButton.getAttribute("disabled"))
        {
            pauseButton.click()
            return
        }
        
        return
    }
})