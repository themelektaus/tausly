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
let useLocalStorage

function loadSrcFile(editor, file, callback)
{
    useLocalStorage = false
    fetch(`code/${file}?${Math.random()}`)
        .then(x => x.text())
        .then(x =>
        {
            editor.setValue(x, -1)
            if (callback)
                callback()
        })
}

function loadFromLocalStorage(editor)
{
    const temp = localStorage.getItem("code") ?? ""
    editor.setValue(temp, -1)
    useLocalStorage = true
}

function saveToLocalStorage(editor)
{
    const code = editor.getValue()
    if (code)
        localStorage.setItem("code", code)
    else
        localStorage.removeItem("code")
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
        tabSize: 2,
        useSoftTabs: false,
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
    editor.getSession().on("change", () =>
    {
        if (useLocalStorage)
            saveToLocalStorage(editor)
    });
    
    side = document.querySelector("#side")
    
    const select = side.querySelector("select")
    
    select.dataset.previousIndex = select.selectedIndex
    
    select.onchange = function(e)
    {
        if (this.value == "_")
        {
            this.selectedIndex = this.dataset.previousIndex
            return
        }
        
        this.dataset.previousIndex = this.selectedIndex
        
        if (this.value == "")
        {
            location.hash = ""
            loadFromLocalStorage(editor)
            return
        }
        
        location.hash = this.value.split(".")[0]
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
        const timestamp = (new Date).toLocaleTimeString()
        div.innerHTML = `<span>${timestamp}</span><span>${output}</span>`
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
        
        const timeout = setTimeout(() =>
        {
            playButton.setAttribute("disabled", "disabled")
            pauseButton.removeAttribute("disabled")
            stopButton.removeAttribute("disabled")
            
            side.classList.remove("visible")
            
            updateCanvasScale()
        }, 100)
        
        tausly.setSize(640, 480)
        
        tausly.load(editor.getValue())
        tausly.compile()
        
        tausly.run().then(() =>
        {
            clearTimeout(timeout)
            
            side.classList.add("visible")
            
            playButton.removeAttribute("disabled")
            pauseButton.setAttribute("disabled", "disabled")
            stopButton.setAttribute("disabled", "disabled")
            
            updateCanvasScale()
        })
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
        tausly.ctx.reset()
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
    else
    {
        loadFromLocalStorage(editor)
    }
    
    
    
    for (const listener of [ "drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop" ])
    {
        document.body.addEventListener(listener, e =>
        {
            e.preventDefault();
            e.stopPropagation();
        })
    }
    
    const fileUploadLabels = document.querySelectorAll("label.file-upload")
    
    for (const fileUploadLabel of fileUploadLabels)
    {
        const input = fileUploadLabel.querySelector("input")
        
        fileUploadLabel.addEventListener("click", e =>
        {
            if (!input.files || !input.files.length)
                return
            
            e.preventDefault()
            
            input.value = null
            input.dispatchEvent(new Event("change"))
        })
        
        fileUploadLabel.addEventListener("dragenter", () =>
        {
            fileUploadLabel.classList.add("drag")
        })
        
        fileUploadLabel.addEventListener("dragleave", () =>
        {
            fileUploadLabel.classList.remove("drag")
        })
        
        fileUploadLabel.addEventListener("drop", e =>
        {
            input.files = e.dataTransfer.files
            input.dispatchEvent(new Event("change"))
        })
        
        input.addEventListener("change", e =>
        {
            fileUploadLabel.classList.remove("drag")
            
            if (input.files && input.files.length)
            {
                fileUploadLabel.dataset.filename = input.files[0].name
                fileUploadLabel.classList.add("drop")
                return
            }
            
            fileUploadLabel.classList.remove("drop")
        })
    }
    
    
    
    const toolsBackground = document.querySelector("#tools-background")
    const toolImageToTausly = document.querySelector("#tool-image-to-tausly")
    
    document.querySelector("#tools-button").onclick = () =>
    {
        toolsBackground.classList.add("visible")
    }
    
    document.querySelector("#tools-background").onclick = () =>
    {
        toolsBackground.classList.remove("visible")
    }
    
    toolImageToTausly.querySelector("input").addEventListener("change", async function()
    {
        const blob = this.files ? this.files[0] : null
        if (!blob)
            return
        
        const converter = new ImageToTausly
        const code = await converter.generateCode(blob)
        toolImageToTausly.querySelector("textarea").value = code
    })
    
    toolImageToTausly.querySelector("textarea").addEventListener("click", e =>
    {
        e.target.focus()
        e.target.select()
    })
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