class Tausly extends Block
{
    constructor(canvasSelector)
    {
        super({
            parent: null,
            globalIndex: 0,
            localIndex: 0,
            code: null
        })
        
        this.canvas = document.querySelector(canvasSelector ?? "canvas")
        
        this.onResize = (width, height) => { }
        this.onRefresh = () => { }
        this.onEcho = data => console.log(data)
        this.onRender = () => { }
        this.onClear = () => { }
        
        this.ctx = this.canvas.getContext("2d")
        this.ctx.isRoot = true
        this.refresh()
        
        this.input = new Set
        this._press = { }
        this._release = { }
        
        const processKey = key =>
        {
            if (key == " ")
                return "SPACE"
            
            if (key.startsWith("Arrow"))
                key = key.substring(5)
            
            return key.toUpperCase()
        }
        
        window.addEventListener("keydown", e =>
        {
            if (e.repeat)
                return
            
            const key = processKey(e.key)
            this.input.add(key)
            this._press[key] = new Set
            delete this._release[key]
            
            //console.log("[" + key + "]")
        })
        
        window.addEventListener("keyup", e =>
        {
            if (e.repeat)
                return
            
            const key = processKey(e.key)
            this.input.delete(processKey(key))
            delete this._press[key]
            this._release[key] = new Set
        })
        
        window.addEventListener("mousemove", e =>
        {
            if (!this.mouse)
                return
            
            const r = this.canvas.getBoundingClientRect()
            const s = r.width / this.canvas.offsetWidth
            this.mouse.x = (e.clientX - r.left) / s
            this.mouse.y = (e.clientY - r.top) / s
        })
        
        window.addEventListener("mousedown", e =>
        {
            const key = "MOUSE"
            this.input.add(key)
            this._press[key] = new Set
            delete this._release[key]
        })
        
        window.addEventListener("mouseup", e =>
        {
            const key = "MOUSE"
            this.input.delete(key)
            delete this._press[key]
            this._release[key] = new Set
        })
    }
    
    press(line, key)
    {
        if (this._press[key] === undefined)
            return false
        
        if (this._press[key].has(line.globalIndex))
            return false
            
        this._press[key].add(line.globalIndex)
        return true
    }
    
    release(line, key)
    {
        if (this._release[key] === undefined)
            return false
        
        if (this._release[key].has(line.globalIndex))
            return false
            
        this._release[key].add(line.globalIndex)
        return true
    }
    
    refresh()
    {
        this.ctx.imageSmoothingEnabled = false
        this.ctx.refresh()
        this.onRefresh()
    }
    
    load(code)
    {
        this.code = code
        
        const tempCodeLines = []
        const codeLines = code.split('\r').join('\n').split('\n')
        for (let codeLine of codeLines)
        {
            codeLine = codeLine.trim()
            if (codeLine)
            {
                if (codeLine.endsWith(":"))
                {
                    tempCodeLines.push(codeLine)
                    continue
                }
                
                for (let _line of codeLine.split(new RegExp(`(\:)${Regex.outsideQuotes}`)))
                {
                    _line = _line.trim()
                    if (_line && _line != ":")
                        tempCodeLines.push(_line)
                }
            }
        }
        
        this.codeLines = []
        
        let prefix = ""
        for (const codeLine of tempCodeLines)
        {
            if (codeLine.endsWith("_"))
            {
                prefix += codeLine.substr(0, codeLine.length - 1).trim() + " "
                continue
            }
            
            this.codeLines.push(prefix + codeLine)
            prefix = ""
        }
    }
    
    compile()
    {
        const parents = [ this ]
        
        this.lines = []
        
        let totalLines = 0
        
        for (const code of this.codeLines)
        {
            for (const _class of Line.classes)
            {
                const Class = eval(_class)
                
                let parent = parents[0]
                const options = {
                    parent: parent,
                    globalIndex: totalLines,
                    localIndex: parent.lines.length,
                    code: code
                }
                
                const line = Class.parse(options)
                
                if (!line)
                    continue
                
                if (line.setup)
                    line.setup(parents)
                
                totalLines++
                
                line.parent.lines.push(line)
                
                if (line instanceof Block)
                    parents.unshift(line)
                
                break
            }
        }
        
        const lines = this.getAllLines()
        
        for (const line of lines)
            if (line.prepare)
                line.prepare()
        
        for (const line of lines)
            line.preCompile()
        
        for (const line of lines)
            if (line.compile)
                line.compile()
    }
    
    async run(code)
    {
        await Promise.waitFor(() => !this.running)
        
        this.running = true
        
        if (code)
        {
            this.load(code)
            this.compile()
        }
        
        await this.beforeRun()
        
        const lines = this.getAllLines()
        
        for (const line of [ this, ...this.getAllLines() ])
            if (line.reset)
                line.reset()
        
        this.runtimeIndex = 0
        
        this.stopped = false
        
        this.resume()
        
        while (!this.stopped && this.runtimeIndex < lines.length)
        {
            if (this.paused)
                await Promise.waitFor(() => !this.paused)
            
            const line = lines[this.runtimeIndex]
            
            if (line.step)
            {
                const step = line.step()
                
                if (step === false)
                {
                    const index = line.parent.lines.indexOf(line)
                    this.runtimeIndex = line.parent.lines[index + 1].globalIndex
                }
                else if (step !== undefined)
                {
                    await Promise.delay(step === true ? 0 : step)
                }
            }
            
            this.runtimeIndex++
        }
        
        this.afterRun()
        
        this.running = false
    }
    
    async beforeRun()
    {
        this.scope = null
        this.mouse = { x: this.canvas.width / 2, y: this.canvas.height / 2 }
        this.history = { }
        
        this.time = 0
        this.lastDeltaTime = 0
        
        this.getHistory("TRANSFORMS").unshift([])
        
        if (!this.audioCtx)
        {
            this.audioCtx = new AudioContext
            this.audioCtx.reverbNode = await this.audioCtx.getReverbNode()
        }
        
        if (this.audioCtx.reverbNode)
            this.audioCtx.reverbNode.connect(this.audioCtx.destination)
    }
    
    afterRun()
    {
        this.ctx.restore()
        
        const parent = this.canvas.parentNode
        if (parent)
            parent.style.cursor = "unset"
        
        delete this.mouse
        
        if (this.audioCtx.reverbNode)
            this.audioCtx.reverbNode.disconnect()
        
        for (const song of PlayLine.songs)
            song.stop()
        
        PlayLine.songs.splice(0, PlayLine.songs.length)
    }
    
    getHistory(key)
    {
        if (this.history[key] === undefined)
            this.history[key] = []
        return this.history[key]
    }
    
    getCanvas()
    {
        if (this.history)
        {
            const frame = this.getHistory("FRAME")
            if (frame && frame.length)
                return frame[0].frame.canvas
        }
        return this.canvas
    }
    
    getContext()
    {
        if (this.history)
        {
            const frame = this.getHistory("FRAME")
            if (frame && frame.length)
                return frame[0].frame.ctx
        }
        return this.ctx
    }
    
    setSize(width, height)
    {
        const canvas = this.getCanvas()
        if (canvas.width === width && canvas.height === height)
            return
        
        canvas.width = width
        canvas.height = height
        
        if (canvas === this.canvas)
        {
            this.onResize(width, height)
            this.refresh()
        }
    }
    
    goto(line, offset)
    {
        this.runtimeIndex = line.globalIndex
        this.runtimeIndex += (offset ?? 0) - 1
    }
    
    findLine(predicate)
    {
        for (const line of this.getAllLines())
            if (predicate(line))
                return line
        return null
    }
    
    pause()
    {
        this.paused = true
    }
    
    resume()
    {
        this.time = performance.now()
        this.lastTime = this.time
        this.lastDeltaTime = 0
        this.paused = false
    }
    
    stop()
    {
        this.resume()
        this.stopped = true
    }
    
    beginDeltaTime()
    {
        this.time = performance.now()
    }
    
    endDeltaTime()
    {
        this.lastTime = this.time
        this.lastDeltaTime = this.getDeltaTime()
    }
    
    getDeltaTime()
    {
        return performance.now() - this.time
    }
    
    getFrameTime(fps)
    {
        const dt = this.getDeltaTime()
        return (1000 - dt * fps) / (fps + dt) - 2.5 * ((1000 / fps) - dt) / (1000 / fps)
    }
    
    getData(key, defaultValue)
    {
        key = `${(this.scope ?? "")}.${key}`
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : (defaultValue ?? 0)
    }
    
    setData(key, value)
    {
        key = `${(this.scope ?? "")}.${key}`
        
        if (value)
        {
            value = JSON.stringify(value)
            localStorage.setItem(key, value)
            return
        }
        
        localStorage.removeItem(key)
    }
}