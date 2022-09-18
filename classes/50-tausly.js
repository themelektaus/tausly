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
        this.ctx = this.canvas.getContext("2d")
        
        this.onRefresh = () => { }
        
        this.refresh()
        
        this.onEcho = data => console.log(data)
        this.onRender = () => { }
        this.onClear = () => { }
        
        this.input = new Set()
        
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
            
            //console.log("[" + key + "]")
        })
        
        window.addEventListener("keyup", e =>
        {
            if (e.repeat)
                return
            
            this.input.delete(processKey(e.key))
        })
    }
    
    refresh()
    {
        const styleMap = document.body.computedStyleMap()
        this.ctx.font = styleMap.get("font").toString()
        this.ctx.textBaseline = "top"
        
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
            if (line.compile)
                line.compile()
    }
    
    async run(code)
    {
        const task = () => new Promise(resolve => setTimeout(() => resolve(!this.running)))
        while (true)
            if (await task())
                break
        
        this.running = true
        
        if (code)
        {
            this.load(code)
            this.compile()
        }
        
        this.beforeRun()
        
        const lines = this.getAllLines()
        
        for (const line of [ this, ...this.getAllLines() ])
            if (line.reset)
                line.reset()
        
        this.runtimeIndex = 0
        
        this.stopped = false
        
        this.resume()
        
        while (!this.stopped && this.runtimeIndex < lines.length)
        {
            const line = lines[this.runtimeIndex]
            line.resetDeltaTime()
            
            if (line.step)
            {
                const step = line.step()
                
                const task = () => new Promise(resolve =>
                {
                    const next = step.next()
                    const result = next.value
                    const done = next.done
                    
                    if (result)
                    {
                        if (result._wait)
                        {
                            setTimeout(() => resolve(done), result._wait)
                            return
                        }
                        
                        if (result._skip)
                        {
                            const index = line.parent.lines.indexOf(line)
                            this.runtimeIndex = line.parent.lines[index + 1].globalIndex
                            resolve(false)
                            return
                        }
                    }
                    
                    if (!this.paused && done)
                    {
                        resolve(true)
                        return
                    }
                    
                    setTimeout(() => resolve(false))
                })
                
                while (true)
                    if (await task())
                        break
            }
            
            this.runtimeIndex++
        }
        
        this.afterRun()
        
        this.running = false
    }
    
    beforeRun()
    {
        this.history = { }
        this.audioCtx = new AudioContext
    }
    
    afterRun()
    {
        this.audioCtx = undefined
        
        for (const song of PlayLine.songs)
            song.stop()
        PlayLine.songs.splice(0, PlayLine.songs.length - 1)
    }
    
    getHistory(key)
    {
        if (this.history[key] === undefined)
            this.history[key] = []
        return this.history[key]
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
    
    setSize(width, height)
    {
        this.canvas.width = width
        this.canvas.height = height
        
        this.refresh()
    }
    
    pause()
    {
        this.paused = true
    }
    
    resume()
    {
        let line = this.getAllLines()[this.runtimeIndex]
        while (line)
        {
            line.resetDeltaTime()
            line = line.parent
        }
        this.paused = false
    }
    
    stop()
    {
        this.resume()
        this.stopped = true
    }
}