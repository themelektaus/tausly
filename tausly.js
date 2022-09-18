//------------------------------------------------------------------------------
// * classes/10-regex.js
//------------------------------------------------------------------------------

class Regex
{
    static outsideQuotes = "(?=(?:(?:[^\"]*\"){2})*[^\"]*$)"
}



//------------------------------------------------------------------------------
// * classes/11-extensions.js
//------------------------------------------------------------------------------

String.prototype.toCondition = function()
{
    let x = this
    x = x.replaceAll("==", "=")
    x = x.replaceAll("==", "=")
    x = x.replaceAll("=", "==")
    x = x.replaceAll(">==", ">=")
    x = x.replaceAll("<==", "<=")
    x = x.replaceAll("!==", "!=")
    x = x.replaceAll("<>", "!=")
    
    x = x.replaceAll(new RegExp("\\bAND\\b", "gi"), "&&")
    x = x.replaceAll(new RegExp("\\bOR\\b", "gi"), "||")
    
    return x
}
    
String.prototype.matchKeyword = function(keyword, argumentCount)
{
    argumentCount ??= 0
    
    let pattern = "^" + keyword
    
    for (let i = 0; i < argumentCount; i++)
    {
        if (i == 0)
            pattern += "\\s+(.+?)"
        else
            pattern += "\\s*\\,\\s*(.+?)"
    }
    pattern += "$"
    
    const regex = new RegExp(pattern, "i")
    const matches = this.match(regex)
    
    return matches
}



//------------------------------------------------------------------------------
// * classes/20-step-result.js
//------------------------------------------------------------------------------

class StepResult
{
    static wait(milliseconds)
    {
        const result = new StepResult
        result._wait = milliseconds
        return result
    }
    
    static skip()
    {
        const result = new StepResult
        result._skip = true
        return result
    }
    
    constructor()
    {
        this._wait = 0
        this._skip = false
    }
}



//------------------------------------------------------------------------------
// * classes/30-functions.js
//------------------------------------------------------------------------------

class Functions
{
    static rules =
    [
        [
            /\bTRUE\b/gi,
            "Functions._TRUE_()"
        ],
        [
            /\bFALSE\b/gi,
            "Functions._FALSE_()"
        ],
        [
            /\bNULL\b/gi,
            "Functions._NULL_()"
        ],
        [
            /\bWIDTH\b/gi,
            "Functions._WIDTH_.apply(this)"
        ],
        [
            /\bHEIGHT\b/gi,
            "Functions._HEIGHT_.apply(this)"
        ],
        [
            /\bCEIL\b\s*\(([^\)]+)\)/gi,
            "Functions._CEIL_($1)"
        ],
        [
            /\bCLAMP\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._CLAMP_($1, $2, $3)"
        ],
        [
            /\bFLOOR\b\s*\(([^\)]+)\)/gi,
            "Functions._FLOOR_($1)"
        ],
        [
            /\bINPUT\b\s*\(([^\)]+)\)/gi,
            "Functions._INPUT_.call(this, $1)"
        ],
        [
            /\bINT\b\s*\(([^\)]+)\)/gi,
            "Functions._INT_($1)"
        ],
        [
            /\bMAX\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._MAX_($1, $2)"
        ],
        [
            /\bMIN\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._MIN_($1, $2)"
        ],
        [
            /\bXRANDOM\b\s*\(([^\)]+)\)/gi,
            "Functions._XRANDOM_($1)"
        ],
        [
            /\bRANDOM\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._RANDOM_($1, $2)"
        ],
        [
            /\bROUND\b\s*\(([^\)]+)\)/gi,
            "Functions._ROUND_($1)"
        ],
        [
            /\bFPS\b\s*\(([^\)]+)\)/gi,
            "Functions._FPS_($1)"
        ],
        [
            /\bLEN\b\s*\(([^\)]+)\)/gi,
            "Functions._LEN_($1)"
        ],
        [
            /\bABS\b\s*\(([^\)]+)\)/gi,
            "Functions._ABS_($1)"
        ],
        [
            /\bSUM\b\s*\(([^\)]+)\)/gi,
            "Functions._SUM_($1)"
        ]
    ]
    
    static _TRUE_()
    {
        return true
    }
    
    static _FALSE_()
    {
        return false
    }
    
    static _NULL_()
    {
        return null
    }
    
    static _WIDTH_()
    {
        return this.root.canvas.width
    }
    
    static _HEIGHT_()
    {
        return this.root.canvas.height
    }
    
    static _INT_(x)
    {
        return parseInt(x)
    }
    
    static _ROUND_(x)
    {
        return Math.round(x)
    }
    
    static _FLOOR_(x)
    {
        return Math.floor(x)
    }
    
    static _CEIL_(x)
    {
        return Math.ceil(x)
    }
    
    static _XRANDOM_(minmax)
    {
        let r = Functions._RANDOM_(-minmax + 1, minmax)
        if (r <= 0)
            r--
        return r
    }
    
    static _RANDOM_(min, max)
    {
        return min + Math.floor(Math.random() * (max - min + 1))
    }
    
    static _MIN_(a, b)
    {
        return Math.min(a, b)
    }
    
    static _MAX_(a, b)
    {
        return Math.max(a, b)
    }
    
    static _CLAMP_(x, a, b)
    {
        return Math.min(Math.max(x, a), b)
    }
    
    static _INPUT_(key)
    {
        return this.root.input.has(key)
    }
    
    static _FPS_dt_ = []
    static _FPS_(dt)
    {
        Functions._FPS_dt_.unshift(dt)
        while (Functions._FPS_dt_.length > 200)
            Functions._FPS_dt_.pop()
        
        let avg = 0
        for (const a of Functions._FPS_dt_)
            avg += a
        avg /= Functions._FPS_dt_.length
        
        const fps = (avg ? Math.round(10000 / avg) / 10 : 0).toFixed(1)
        const _dt = (Math.round(avg * 100) / 100).toFixed(2)
        return `${fps} (${_dt})`
    }
    
    static _LEN_(x)
    {
        return x.length ?? 0
    }
    
    static _ABS_(x)
    {
        return Math.abs(x)
    }
    
    static _SUM_(array)
    {
        return array.reduce((a, b) => a + b)
    }
}



//------------------------------------------------------------------------------
// * classes/40-line.js
//------------------------------------------------------------------------------

class Line
{
    static classes = new Set()
    
    constructor(options)
    {
        this.parent = options.parent
        this.globalIndex = options.globalIndex
        this.localIndex = options.localIndex
        this.startTime = null
    }
    
    
    // TODO: Set this value on compile
    get root()
    {
        if (!this._root)
        {
            this._root = this
            while (this._root.parent)
                this._root = this._root.parent
        }
        return this._root
    }
    
    resetDeltaTime()
    {
        this.startTime = performance.now()
    }
    
    getDeltaTime()
    {
        if (this.startTime)
            return performance.now() - this.startTime
        return 0
    }
    
    createFunction(expression)
    {
        return new Function(`return ${this.parent.evaluate(expression)}`)
    }
}



//------------------------------------------------------------------------------
// * classes/41-block.js
//------------------------------------------------------------------------------

class Block extends Line
{
    constructor(options)
    {
        super(options)
        this.lines = []
        this.variableNames = new Set()
        this.useDeltaTime = false
    }
    
    reset()
    {
        this.variables = { }
    }
    
    getAllLines()
    {
        const lines = []
        for (const line of this.lines)
        {
            lines.push(line)
            if (line instanceof Block)
                for (const _line of line.getAllLines())
                    lines.push(_line)
        }
        return lines
    }
    
    evaluate(expression)
    {
        let value = `${expression}`
        value = this.evaluateFunctions(value)
        value = this.evaluateVariables(value)
        return value
    }
    
    evaluateVariables(value)
    {
        if (this.variableNames)
        {
            const names = Array.from(this.variableNames)
            
            names.sort((a, b) => b.length - a.length)
            
            const replaceAll = function(pattern, replacement)
            {
                pattern = `${pattern}${Regex.outsideQuotes}`
                const regex = new RegExp(pattern, 'g')
                value = value.replaceAll(regex, replacement)
            }
            
            for (const name of names)
            {
                replaceAll(`((?<!_)\\()(\\b${name}\\b)(\\))`, `[$2]`)
                replaceAll(`((?<!_)\\b${name}\\b)`, `this.parent.get(\"$1\")`)
            }
        }
        
        if (this.parent)
            value = this.parent.evaluateVariables(value)
        
        return value
    }
    
    evaluateFunctions(value)
    {
        value = value.replaceAll(
            /\bFRAMETIME\b\s*\(([0-9]+)\)/gi,
            "(1000 - DELTATIME * $1) / ($1 + DELTATIME) - 2.5 * ((1000 / $1) - DELTATIME) / (1000 / $1)"
        )
        
        if (/\bDELTATIME\b/i.test(value))
        {
            const path = [ "parent" ]
            let found = false
            let line = this
            while (line)
            {
                if (line.useDeltaTime === undefined)
                {
                    path.push("parent")
                    line = line.parent
                    continue
                }
                found = true
                break
            }
            
            value = value.replaceAll(/\bDELTATIME\b/gi, found ? `this.${path.join(".")}.getDeltaTime()` : "0")
        }
        
        for (const rule of Functions.rules)
            value = value.replaceAll(rule[0], rule[1])
        
        value = value.replaceAll(/((?<!_)\()([0-9]+)(\))/g, "[$2]")
        
        if (this.parent)
            value = this.parent.evaluateFunctions(value)
        
        return value
    }
    
    declare(name)
    {
        this.variableNames.add(name)
    }
    
    init(name, defaultValue)
    {
        let value = this.get(name, false)
        if (value === undefined)
            this.variables[name] = defaultValue
        return this.variables[name]
    }
    
    get(name, throwErrorException)
    {
        if (this.variables[name] !== undefined)
            return this.variables[name]
        
        if (this.parent)
        {
            const value = this.parent.get(name, throwErrorException)
            if (value !== undefined)
                return value
        }
        
        if (throwErrorException ?? true)
            console.error(`Get Variable '${name}': NOT FOUND`)
        
        return undefined
    }
    
    set(name, value, x, y, operator, sender)
    {
        sender ??= this
        
        if (this.variables[name] !== undefined)
        {
            if (x === undefined)
            {
                switch (operator)
                {
                    case '+': this.variables[name] += value; break
                    case '-': this.variables[name] -= value; break
                    case '*': this.variables[name] *= value; break
                    case '/': this.variables[name] /= value; break
                     default: this.variables[name]  = value; break
                }
            }
            else
            {
                if (y === undefined)
                {
                    switch (operator)
                    {
                        case '+': this.variables[name][x] += value; break
                        case '-': this.variables[name][x] -= value; break
                        case '*': this.variables[name][x] *= value; break
                        case '/': this.variables[name][x] /= value; break
                         default: this.variables[name][x]  = value; break
                    }
                }
                else
                {
                    switch (operator)
                    {
                        case '+': this.variables[name][x][y] += value; break
                        case '-': this.variables[name][x][y] -= value; break
                        case '*': this.variables[name][x][y] *= value; break
                        case '/': this.variables[name][x][y] /= value; break
                         default: this.variables[name][x][y]  = value; break
                    }
                }
            }
            return true
        }
        
        if (this.parent && this.parent.set(name, value, x, y, operator, sender))
            return true
        
        console.error(`Set Variable '${name}': NOT FOUND`)
        return false
    }
}



//------------------------------------------------------------------------------
// * classes/50-tausly.js
//------------------------------------------------------------------------------

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



//------------------------------------------------------------------------------
// * classes/audio/01-audio-context.js
//------------------------------------------------------------------------------

AudioContext.prototype.createReverb = async function(url)
{
    const reverbNode = this.createConvolver()
    
    if (!AudioContext.reverbNodeBuffer)
        AudioContext.reverbNodeBuffer = { }
    
    if (!AudioContext.reverbNodeBuffer[url])
    {
        await new Promise(resolve =>
        {
            fetch(url).then(x => x.arrayBuffer()).then(data =>
            {
                this.decodeAudioData(data, buffer =>
                {
                    AudioContext.reverbNodeBuffer[url] = buffer
                    resolve()
                })
            })
        })
    }
    reverbNode.buffer = AudioContext.reverbNodeBuffer[url]
    return reverbNode
}



//------------------------------------------------------------------------------
// * classes/audio/05-blend.js
//------------------------------------------------------------------------------

class Blend
{
    constructor(blendNode)
    {
        this.blendNode = blendNode
        this.value = 0
    }
    
    get value()
    {
        return this.blendNode.node2.gain.value
    }
    
    set value(val)
    {
        this.blendNode.node1.gain.value = 1 - val
        this.blendNode.node2.gain.value = val
    }
}



//------------------------------------------------------------------------------
// * classes/audio/06-blend-node.js
//------------------------------------------------------------------------------

class BlendNode
{
    constructor(ctx)
    {
        this.node1 = ctx.createGain()
        this.node2 = ctx.createGain()
        this.blend = new Blend(this)
    }
    
    connect(node)
    {
        this.node1.connect(node)
        this.node2.connect(node)
    }
    
    disconnect(node)
    {
        this.node1.disconnect(node)
        this.node2.disconnect(node)
    }
}



//------------------------------------------------------------------------------
// * classes/audio/10-note.js
//------------------------------------------------------------------------------

class Note
{
    static Map = {
        "C": 1,
        "C#": 2, "Db": 2,
        "D": 3,
        "D#": 4, "Eb": 4,
        "E": 5,
        "F": 6,
        "F#": 7, "Gb": 7,
        "G": 8,
        "G#": 9, "Ab": 9,
        "A": 10,
        "A#": 11, "Bb": 11,
        "B": 12
    }
    
    constructor(note)
    {
        this.note = note
        this.length = 1
    }
    
    getFrequency()
    {
        const x = Note.Map[this.note.slice(0, -1)]
        const y = this.note.charAt(this.note.length - 1)
        const distance = x - 1 + (y * 12)
        return 440 * Math.pow(2, (distance - 57) / 12)
    }
    
    async play()
    {
        const instrument = this.instrument
        const song = instrument.song
        
        const length = this.length / song.timeSignature * (120 / song.bpm)
        
        let oscillator
        let gainNode
        
        if (this.note)
        {
            const ctx = song.ctx
            const time = ctx.currentTime
            const gain = instrument.gain
            const attack = instrument.attack / 1000
            const release = instrument.release / 1000
        
            gainNode = ctx.createGain()
            
            gainNode.gain.setValueAtTime(0, time)
            gainNode.gain.linearRampToValueAtTime(gain, time + attack)
            
            gainNode.gain.setValueAtTime(gain, time + length - release)
            gainNode.gain.linearRampToValueAtTime(0, time + length)
            
            gainNode.connect(instrument.node1)
            gainNode.connect(instrument.reverbNode)
        
            oscillator = ctx.createOscillator()
            oscillator.type = instrument.type;
            oscillator.frequency.value = this.getFrequency()
            oscillator.connect(gainNode)
            oscillator.start()
        }
        
        await new Promise(resolve =>
        {
            setTimeout(() =>
            {
                if (oscillator)
                {
                    oscillator.stop()
                    oscillator.disconnect(gainNode)
                    oscillator = undefined
                }
                if (gainNode)
                {
                    gainNode.disconnect(instrument.node1)
                    gainNode.disconnect(instrument.reverbNode)
                    gainNode = undefined
                }
                resolve()
            }, length * 1000)
        })
    }
}



//------------------------------------------------------------------------------
// * classes/audio/11-instrument.js
//------------------------------------------------------------------------------

class Instrument extends BlendNode
{
    constructor(song)
    {
        super(song.ctx)
        this.song = song
        this.sheet = ""
        this.index = -1
        this.notes = []
        this.gain = 1
        this.type = "sine"
        this.attack = 1
        this.release = 20
    }
    
    clone(song)
    {
        const clone = new Instrument(song)
        clone.blend.value = this.blend.value
        clone.sheet = this.sheet
        clone.index = this.index
        clone.notes = this.notes
        clone.gain = this.gain
        clone.type = this.type
        clone.attack = this.attack
        clone.release = this.release
        return clone
    }
    
    build()
    {
        this.notes.splice(0, this.notes.length - 1)
        
        const sheetNotes = this.sheet.trim()
            .replaceAll("\r", " ")
            .replaceAll("\n", " ")
            .replaceAll("\t", " ")
            .split(" ")
        
        for (const sheetNote of sheetNotes)
        {
            if (!sheetNote)
                continue
            
            if (sheetNote == "--")
            {
                const previousNote = this.notes[this.notes.length - 1]
                if (previousNote.note == "--")
                {
                    previousNote.length++
                    continue
                }
                
                const note = new Note
                note.instrument = this
                this.notes.push(note)
                continue
            }
            
            if (sheetNote == "..")
            {
                const previousNote = this.notes[this.notes.length - 1]
                previousNote.length++
                continue
            }
            
            const note = new Note(sheetNote)
            note.instrument = this
            this.notes.push(note)
        }
    }
    
    async play()
    {
        this.build()
        
        const song = this.song
        const ctx = song.ctx
        
        if (!this.reverbNode)
        {
            this.reverbNode = await ctx.createReverb("reverb-impulse-response.m4a")
            this.reverbNode.connect(this.node2)
        }
        
        this.connect(song)
        
        let index = 0
        this.stopped = false
        
        while (!this.stopped)
        {
            await this.notes[index++].play()
            if (index == this.notes.length)
            {
                if (song.repeat)
                {
                    index = 0
                    continue
                }
                this.stopped = true
            }
        }
        
        this.disconnect(song)
    }
    
    stop()
    {
        this.stopped = true
    }
}



//------------------------------------------------------------------------------
// * classes/audio/12-song.js
//------------------------------------------------------------------------------

class Song extends GainNode
{
    constructor(ctx)
    {
        super(ctx)
        this.ctx = ctx
        this.bpm = 120
        this.timeSignature = 4
        this.repeat = false
        this.instruments = []
    }
    
    clone()
    {
        const clone = new Song(this.ctx)
        clone.gain.value = this.gain.value
        clone.bpm = this.bpm
        clone.timeSignature = this.timeSignature
        clone.repeat = this.repeat
        for (const instrument of this.instruments)
            clone.instruments.push(instrument.clone(clone))
        return clone
    }
    
    add(value)
    {
        if (value instanceof Instrument)
        {
            value.index = this.instruments.length
            this.instruments.push(value)
        }
    }
    
    async play()
    {
        const promises = []
        
        for (const instrument of this.instruments)
            promises.push(instrument.play())
        
        await Promise.all(promises)
    }
    
    stop()
    {
        for (const instrument of this.instruments)
            instrument.stop()
    }
}



//------------------------------------------------------------------------------
// * classes/block/01-if.js
//------------------------------------------------------------------------------

class IfBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("IF\\s+NOT", 1)
        if (matches)
        {
            let statement = matches[1]
            
            if (statement.toUpperCase().endsWith("THEN"))
                statement = statement.substr(0, statement.length - 4).trim()
            
            const line = new IfBlock(options)
            line.not = true
            line.getCondition = statement.toCondition()
            return line
        }
        
        matches = options.code.matchKeyword("IF", 1)
        if (matches)
        {
            let statement = matches[1]
            
            if (statement.toUpperCase().endsWith("THEN"))
                statement = statement.substr(0, statement.length - 4).trim()
            
            const line = new IfBlock(options)
            line.getCondition = statement.toCondition()
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getCondition = this.createFunction(this.getCondition)
    }
    
    * step()
    {
        this.parent.isTrue = this.getCondition()
        
        if (this.not)
            this.parent.isTrue = !this.parent.isTrue
        
        if (!this.parent.isTrue)
            yield StepResult.skip()
    }
}



//------------------------------------------------------------------------------
// * classes/block/02-else.js
//------------------------------------------------------------------------------

class ElseBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("ELSE"))
            return new ElseBlock(options)
        
        return null
    }
    
    setup(parents)
    {
        this.parent = this.parent.parent
        parents.shift()
    }
    
    * step()
    {
        if (this.parent.isTrue)
            yield StepResult.skip()
    }
}



//------------------------------------------------------------------------------
// * classes/block/10-for.js
//------------------------------------------------------------------------------

class ForBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^FOR\s+([^ ]+)\s*\=\s*([0-9]+)\s+TO\s+(.+)$/i)
        if (matches)
        {
            const block = new ForBlock(options)
            block.name = matches[1]
            block.from = +matches[2]
            block.getTo = matches[3]
            return block
        }
        
        return null
    }
    
    constructor(options)
    {
        super(options)
        this.useDeltaTime = true
    }
    
    prepare()
    {
        this.parent.declare(this.name)
    }
    
    compile()
    {
        this.getTo = this.createFunction(this.getTo)
    }
    
    * step()
    {
        const from = this.from
        const to = this.getTo()
        
        this.parent.init(this.name, from)
        
        if (this.init === false)
            delete this.init
        else
            this.parent.set(this.name, from)
        
        if (this.skip || this.parent.get(this.name) > to)
            yield StepResult.skip()
    }
    
    next()
    {
        this.end()
    }
    
    break()
    {
        this.skip = true
        this.next()
    }
    
    end()
    {
        const value = this.get(this.name)
        this.set(this.name, value + 1)
        this.init = false
        this.root.goto(this)
    }
}



//------------------------------------------------------------------------------
// * classes/block/11-while.js
//------------------------------------------------------------------------------

class WhileBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("WHILE\\s+NOT", 1)
        if (matches)
        {
            const line = new WhileBlock(options)
            line.not = true
            line.getCondition = matches[1].toCondition()
            return line
        }
        
        matches = options.code.matchKeyword("WHILE", 1)
        if (matches)
        {
            const line = new WhileBlock(options)
            line.not = false
            line.getCondition = matches[1].toCondition()
            return line
        }
        
        return null
    }
    
    constructor(options)
    {
        super(options)
        this.useDeltaTime = true
    }
    
    compile()
    {
        this.getCondition = this.createFunction(this.getCondition)
    }
    
    * step()
    {
        if (!this.skip && this.getCondition() == !this.not)
            return
        
        delete this.skip
        yield StepResult.skip()
    }
    
    next()
    {
        this.end()
    }
    
    break()
    {
        this.skip = true
        this.next()
    }
    
    end()
    {
        this.root.goto(this)
    }
}



//------------------------------------------------------------------------------
// * classes/block/12-loop.js
//------------------------------------------------------------------------------

class LoopBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("LOOP"))
            return new LoopBlock(options)
        
        return null
    }
    
    constructor(options)
    {
        super(options)
        this.useDeltaTime = true
    }
    
    * step()
    {
        if (!this.skip)
            return
        
        delete this.skip
        yield StepResult.skip()
    }
    
    next()
    {
        this.end()
    }
    
    break()
    {
        this.skip = true
        this.next()
    }
    
    end()
    {
        this.root.goto(this)
    }
}



//------------------------------------------------------------------------------
// * classes/block/20-song.js
//------------------------------------------------------------------------------

class SongBlock extends Block
{
    static _ = Line.classes.add(this.name)
    static songs = { }
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SONG", 1)
        if (matches)
        {
            const line = new SongBlock(options)
            line.getTitle = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getTitle = this.createFunction(this.getTitle)
    }
    
    * step()
    {
        this.root.getHistory("SONG").unshift(this)
        
        this.song = new Song(this.root.audioCtx)
        
        const title = this.getTitle()
        SongBlock.songs[title] = this.song
    }
    
    end()
    {
        this.root.getHistory("SONG").shift(this)
    }
}



//------------------------------------------------------------------------------
// * classes/block/21-instrument.js
//------------------------------------------------------------------------------

class InstrumentBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("INSTRUMENT", 1)
        if (matches)
        {
            const line = new InstrumentBlock(options)
            line.getTitle = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getTitle = this.createFunction(this.getTitle)
    }
    
    * step()
    {
        this.root.getHistory("INSTRUMENT").unshift(this)
        
        const song = this.root.getHistory("SONG")
        this.instrument = new Instrument(song[0].song)
    }
    
    end()
    {
        const song = this.root.getHistory("SONG")
        song[0].song.add(this.instrument)
        
        this.root.getHistory("INSTRUMENT").shift(this)
    }
}



//------------------------------------------------------------------------------
// * classes/line/01-echo.js
//------------------------------------------------------------------------------

class EchoLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("ECHO", 1)
        if (matches)
        {
            const line = new EchoLine(options)
            line.getData = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getData = this.createFunction(this.getData)
    }
    
    * step()
    {
        this.root.onEcho(this.getData())
    }
}



//------------------------------------------------------------------------------
// * classes/line/02-sleep.js
//------------------------------------------------------------------------------

class SleepLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SLEEP", 1)
        if (matches)
        {
            const line = new SleepLine(options)
            line.getMilliseconds = matches[1]
            return line
        }
        
        matches = options.code.matchKeyword("SLEEP")
        if (matches)
        {
            const line = new SleepLine(options)
            line.getMilliseconds = 1
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getMilliseconds = this.createFunction(this.getMilliseconds)
    }
    
    * step()
    {
        const milliseconds = this.getMilliseconds()
        if (milliseconds <= 0)
        {
            yield
            return
        }
        
        const startTime = performance.now()
        do yield
        while (performance.now() - startTime < milliseconds)
    }
}



//------------------------------------------------------------------------------
// * classes/line/10-goto.js
//------------------------------------------------------------------------------

class GotoLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("GOTO", 1)
        if (matches)
        {
            const line = new GotoLine(options)
            line.label = matches[1]
            return line
        }
        
        return null
    }
    
    * step()
    {
        const line = this.root.findLine(line =>
        {
            if (line instanceof LabelLine)
                if (line.name == this.label)
                    return true
            return false
        })
        
        this.root.goto(line)
    }
}



//------------------------------------------------------------------------------
// * classes/line/11-gosub.js
//------------------------------------------------------------------------------

class GosubLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("GOSUB", 1)
        if (matches)
        {
            const line = new GosubLine(options)
            line.label = matches[1]
            return line
        }
        
        return null
    }
    
    * step()
    {
        this.root.getHistory("GOSUB").push(this)
        
        const line = this.root.findLine(line =>
        {
            if (line instanceof LabelLine)
                if (line.name == this.label)
                    return true
            return false
        })
        
        this.root.goto(line)
    }
}



//------------------------------------------------------------------------------
// * classes/line/12-return.js
//------------------------------------------------------------------------------

class ReturnLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("RETURN"))
            return new ReturnLine(options)
        
        return null
    }
    
    * step()
    {
        const line = this.root.getHistory("GOSUB").pop()
        
        if (!line)
            return
        
        this.root.goto(line, 1)
    }
}



//------------------------------------------------------------------------------
// * classes/line/15-end.js
//------------------------------------------------------------------------------

class EndLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("END"))
            return new EndLine(options)
        
        return null
    }
    
    setup(parents)
    {
        this.parent = this.parent.parent
        parents.shift()
    }
    
    * step()
    {
        const index = this.parent.lines.indexOf(this)
        const block = this.parent.lines[index - 1]
        
        if (block.end)
            block.end()
    }
}



//------------------------------------------------------------------------------
// * classes/line/18-next.js
//------------------------------------------------------------------------------

class NextLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("NEXT"))
            return new NextLine(options)
        
        return null
    }
    
    * step()
    {
        let parent = this
        while (!parent.next)
        {
            parent = parent.parent
            if (!parent)
                break
        }
        if (parent && parent.next)
            parent.next()
    }
}



//------------------------------------------------------------------------------
// * classes/line/19-break.js
//------------------------------------------------------------------------------

class BreakLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("BREAK"))
            return new BreakLine(options)
        
        return null
    }
    
    * step()
    {
        let parent = this
        while (!parent.break)
        {
            parent = parent.parent
            if (!parent)
                break
        }
        if (parent && parent.break)
            parent.break()
    }
}



//------------------------------------------------------------------------------
// * classes/line/30-normalize.js
//------------------------------------------------------------------------------

class NormalizeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("NORMALIZE", 1)
        if (matches)
        {
            const line = new NormalizeLine(options)
            line.dimName = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getDimValue = this.createFunction(this.dimName)
    }
    
    * step()
    {
        const dimValue = this.getDimValue()
        
        const magnitude = Math.sqrt(dimValue[0] ** 2 + dimValue[1] ** 2)
        if (magnitude > 0)
        {
            dimValue[0] /= magnitude
            dimValue[1] /= magnitude
        }
        
        this.parent.set(this.dimName, dimValue)
    }
}



//------------------------------------------------------------------------------
// * classes/line/31-smooth-damp.js
//------------------------------------------------------------------------------

class SmoothDampLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches = options.code.matchKeyword("SMOOTHDAMP", 6)
        
        if (!matches)
        {
            matches = options.code.matchKeyword("SMOOTHDAMP", 5)
            if (matches)
                matches[6] = "undefined"
        }
        
        if (!matches)
            return null
        
        const line = new SmoothDampLine(options)
        line.current = matches[1]
        line.target = matches[2]
        line.currentVelocity = matches[3]
        line.getSmoothTime = matches[4]
        line.getDeltaTime = matches[5]
        line.getMaxSpeed = matches[6]
        return line
    }
    
    compile()
    {
        this.getCurrent = this.createFunction(this.current)
        this.getTarget = this.createFunction(this.target)
        this.getCurrentVelocity = this.createFunction(this.currentVelocity)
        this.getSmoothTime = this.createFunction(this.getSmoothTime)
        this.getDeltaTime = this.createFunction(this.getDeltaTime)
        this.getMaxSpeed = this.createFunction(this.getMaxSpeed)
    }
    
    * step()
    {
        const current = this.getCurrent()
        const target = this.getTarget()
        const currentVelocity = this.getCurrentVelocity()
        
        if (target instanceof Array)
        {
            SmoothDampLine.smoothDamp2D(current, target, currentVelocity, this.getSmoothTime(), this.getDeltaTime(), this.getMaxSpeed())
            this.parent.set(this.current, current)
            this.parent.set(this.currentVelocity, currentVelocity)
            return
        }
        
        const result = SmoothDampLine.smoothDamp1D(current, target, currentVelocity, this.getSmoothTime(), this.getDeltaTime(), this.getMaxSpeed())
        this.parent.set(this.current, result[0])
        this.parent.set(this.currentVelocity, result[1])
    }
    
    static smoothDamp1D(current, target, currentVelocity, smoothTime, deltaTime, maxSpeed)
    {
        smoothTime = Math.max(0.0001, smoothTime)
        deltaTime /= 1000
        maxSpeed ??= 1e+30
        
        const omega = 2 / smoothTime
        const x = omega * deltaTime
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
        
        let change = current - target
        
        const originalTarget = target
        
        const maxChange = maxSpeed * smoothTime
        
        change = Math.min(Math.max(-maxChange, change), maxChange)
        target = current - change
        
        const temp = (currentVelocity + omega * change) * deltaTime
        
        currentVelocity = (currentVelocity - omega * temp) * exp
        
        let output = target + (change + temp) * exp
        
        return [ output, currentVelocity ]
    }
    
    static smoothDamp2D(current, target, currentVelocity, smoothTime, deltaTime, maxSpeed)
    {
        smoothTime = Math.max(0.0001, smoothTime)
        deltaTime /= 1000
        maxSpeed ??= 1e+30
        
        const omega = 2 / smoothTime
        const x = omega * deltaTime
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
        
        let changeX = current[0] - target[0]
        let changeY = current[1] - target[1]
        
        const originalTargetX = target[0]
        const originalTargetY = target[1]
        
        const maxChange = maxSpeed * smoothTime
        const maxChangeSq = maxChange * maxChange
        const sqDist = changeX * changeX + changeY * changeY
        
        if (sqDist > maxChangeSq)
        {
            const mag = Math.sqrt(sqDist);
            changeX = changeX / mag * maxChange
            changeY = changeY / mag * maxChange
        }
        
        const targetX = current[0] - changeX
        const targetY = current[1] - changeY
        
        const tempX = (currentVelocity[0] + omega * changeX) * deltaTime
        const tempY = (currentVelocity[1] + omega * changeY) * deltaTime
        
        currentVelocity[0] = (currentVelocity[0] - omega * tempX) * exp
        currentVelocity[1] = (currentVelocity[1] - omega * tempY) * exp
        
        let outputX = targetX + (changeX + tempX) * exp
        let outputY = targetY + (changeY + tempY) * exp
        
        const origMinusCurrentX = originalTargetX - current[0]
        const origMinusCurrentY = originalTargetY - current[1]
        const outMinusOrigX = outputX - originalTargetX
        const outMinusOrigY = outputY - originalTargetY
        
        if (origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY > 0)
        {
            outputX = originalTargetX
            outputY = originalTargetY
            
            currentVelocity[0] = (outputX - originalTargetX) / deltaTime
            currentVelocity[1] = (outputY - originalTargetY) / deltaTime
        }
        
        current[0] = outputX
        current[1] = outputY
    }
}



//------------------------------------------------------------------------------
// * classes/line/40-size.js
//------------------------------------------------------------------------------

class SizeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("SIZE", 2)
        if (matches)
        {
            const line = new SizeLine(options)
            line.getWidth = matches[1]
            line.getHeight = matches[2]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getWidth = this.createFunction(this.getWidth)
        this.getHeight = this.createFunction(this.getHeight)
    }
    
    * step()
    {
        this.root.setSize(this.getWidth(), this.getHeight())
    }
}



//------------------------------------------------------------------------------
// * classes/line/41-clear.js
//------------------------------------------------------------------------------

class ClearLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("CLEAR")
        if (matches)
            return new ClearLine(options)
        
        return null
    }
    
    * step()
    {
        this.root.onClear()
        this.root.ctx.clearRect(0, 0, this.root.canvas.width, this.root.canvas.height)
    }
}



//------------------------------------------------------------------------------
// * classes/line/42-color.js
//------------------------------------------------------------------------------

class ColorLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("COLOR", 4)
        if (matches)
        {
            const line = new ColorLine(options)
            line.rgba = [ matches[1], matches[2], matches[3], matches[4] ]
            return line
        }
        
        matches = options.code.matchKeyword("COLOR", 3)
        if (matches)
        {
            const line = new ColorLine(options)
            line.getColor = `"rgb(${matches[1]}, ${matches[2]}, ${matches[3]})"`
            return line
        }
        
        matches = options.code.matchKeyword("COLOR", 1)
        if (matches)
        {
            const line = new ColorLine(options)
            line.getColor = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        if (this.rgba)
        {
            const r = this.rgba[0]
            const g = this.rgba[1]
            const b = this.rgba[2]
            const a = this.parent.evaluate(this.rgba[3]) / 255
            this.getColor = `"rgba(${r}, ${g}, ${b}, ${a})"`
        }
        this.getColor = this.createFunction(this.getColor)
    }
    
    * step()
    {
        this.root.ctx.fillStyle = this.getColor()
    }
}



//------------------------------------------------------------------------------
// * classes/line/50-fill.js
//------------------------------------------------------------------------------

class FillLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("FILL", 4)
        if (matches)
        {
            const line = new FillLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getWidth = matches[3]
            line.getHeight = matches[4]
            return line
        }
        
        matches = options.code.matchKeyword("FILL")
        if (matches)
        {
            const line = new FillLine(options)
            line.getX = "0"
            line.getY = "0"
            line.getWidth = -1
            line.getHeight = -1
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        
        if (this.getWidth == -1)
            this.getWidth = this.createFunction("WIDTH")
        else
            this.getWidth = this.createFunction(this.getWidth)
        
        if (this.getHeight == -1)
            this.getHeight = this.createFunction("HEIGHT")
        else
            this.getHeight = this.createFunction(this.getHeight)
    }
    
    * step()
    {
        const x = this.getX()
        const y = this.getY()
        const w = this.getWidth()
        const h = this.getHeight()
        const tx = x + w / 2
        const ty = y + h / 2
        //this.root.ctx.translate(tx, ty)
        //this.root.ctx.rotate(45 * Math.PI / 180);
        //this.root.ctx.translate(-tx, -ty)
        this.root.ctx.fillRect(x, y, this.getWidth(), this.getHeight())
        //this.root.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.root.onRender()
    }
}



//------------------------------------------------------------------------------
// * classes/line/51-text.js
//------------------------------------------------------------------------------

class TextLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("TEXT", 3)
        if (matches)
        {
            const line = new TextLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getText = matches[3]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        this.getText = this.createFunction(this.getText)
    }
    
    * step()
    {
        this.root.ctx.fillText(this.getText(), this.getX(), this.getY())
        this.root.onRender()
    }
}



//------------------------------------------------------------------------------
// * classes/line/52-align.js
//------------------------------------------------------------------------------

class AlignLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("ALIGN\\s+LEFT"))
        {
            const line = new AlignLine(options)
            line.align = "start"
            return line
        }
        
        if (options.code.matchKeyword("ALIGN\\s+CENTER"))
        {
            const line = new AlignLine(options)
            line.align = "center"
            return line
        }
        
        if (options.code.matchKeyword("ALIGN\\s+RIGHT"))
        {
            const line = new AlignLine(options)
            line.align = "right"
            return line
        }
        
        return null
    }
    
    * step()
    {
        this.root.ctx.textAlign = this.align
    }
}



//------------------------------------------------------------------------------
// * classes/line/60-dim.js
//------------------------------------------------------------------------------

class DimLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^DIM\(([0-9\,\s]+)\)\s+(.+)$/i)
        if (!matches)
            return null
        
        const line = new DimLine(options)
        
        const size = matches[1].split(',')
        
        line.x = +size[0]
        
        if (size.length == 2)
            line.y = +size[1]
        
        line.name = matches[2]
        
        return line
    }
    
    prepare()
    {
        this.parent.declare(this.name)
    }
    
    compile()
    {
        const value = [];
        
        for (var i = 0; i < this.x; i++)
        {
            if (!this.y)
            {
                value.push(0)
                continue
            }
            
            value.push([]);
            for (var j = 0; j < this.y; j++)
                value[i][j] = 0
        }
        
        let expression
        
        if (this.y)
            expression = `[${value.join("],[")}]`
        else
            expression = value.join(",")
        
        expression = `[${expression}]`
        
        this.getValue = this.createFunction(expression)
    }
    
    * step()
    {
        this.parent.init(this.name, this.getValue())
    }
}



//------------------------------------------------------------------------------
// * classes/line/70-label.js
//------------------------------------------------------------------------------

class LabelLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/\:$/.test(options.code) && !/^\*/.test(options.code))
            return null
        
        const line = new LabelLine(options)
        line.name = options.code.replace(/^(\*?)\s*([^\:]+)\s*(\:?)$/, "$2")
        return line
    }
}



//------------------------------------------------------------------------------
// * classes/line/71-init.js
//------------------------------------------------------------------------------

class InitLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.match(/^INIT\s+([^ ]+)\s*\=\s*(.+)$/i)
        if (matches)
        {
            const line = new InitLine(options)
            line.name = matches[1]
            line.getValue = matches[2]
            return line
        }
        
        matches = options.code.match(/^INIT\s+(.+)$/i)
        if (matches)
        {
            const line = new InitLine(options)
            line.name = matches[1]
            line.getValue = "0"
            return line
        }
        
        return null
    }
    
    prepare()
    {
        this.parent.declare(this.name)
    }
    
    compile()
    {
        this.getValue = this.createFunction(this.getValue)
    }
    
    * step()
    {
        this.parent.init(this.name, this.getValue())
    }
}



//------------------------------------------------------------------------------
// * classes/line/72-set.js
//------------------------------------------------------------------------------

class SetLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^SET\s+([^ ]+)\s*\=\s*(.+)$/i)
        if (matches)
        {
            const line = new SetLine(options)
            line.name = matches[1]
            line.getValue = matches[2]
            return line
        }
        
        return null
    }
    
    prepare()
    {
        this.parent.declare(this.name)
    }
    
    compile()
    {
        this.getValue = this.createFunction(this.getValue)
    }
    
    * step()
    {
        const value = this.getValue()
        this.parent.init(this.name, value)
        this.parent.set(this.name, value)
    }
}



//------------------------------------------------------------------------------
// * classes/line/73-.js
//------------------------------------------------------------------------------

class VarLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.match(/^([^ ]+)\s*(?:(|\+|\-|\*|\/))\=\s*(.+)$/)
        if (matches)
        {
            const line = new VarLine(options)
            
            const x = matches[1].split('(')
            
            line.name = x[0]
            
            line.getX = "undefined"
            line.getY = "undefined"
            
            if (x.length >= 2)
            {
                line.getX = x[1].split(')')[0]
                
                if (x.length == 3)
                {
                    line.getY = x[2].split(')')[0]
                }
            }
            
            line.operator = matches[2]
            line.getValue = matches[3]
            
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        this.getValue = this.createFunction(this.getValue)
    }
    
    * step()
    {
        this.parent.set(this.name, this.getValue(), this.getX(), this.getY(), this.operator)
    }
}



//------------------------------------------------------------------------------
// * classes/line/80-gain.js
//------------------------------------------------------------------------------

class GainLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("GAIN", 1)
        if (matches)
        {
            const line = new GainLine(options)
            line.value = (+matches[1] / 100)
            return line
        }
        
        return null
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        if (instrument && instrument.length)
        {
            instrument[0].instrument.gain = this.value
            return
        }
        
        const song = this.root.getHistory("SONG")
        song[0].song.gain.value = this.value
    }
}



//------------------------------------------------------------------------------
// * classes/line/81-bpm.js
//------------------------------------------------------------------------------

class BpmLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("BPM", 1)
        if (matches)
        {
            const line = new BpmLine(options)
            line.value = +matches[1]
            return line
        }
        
        return null
    }
    
    * step()
    {
        const song = this.root.getHistory("SONG")
        song[0].song.bpm = this.value
    }
}



//------------------------------------------------------------------------------
// * classes/line/82-time-signature.js
//------------------------------------------------------------------------------

class TimeSignatureLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("TIME SIGNATURE", 1)
        if (matches)
        {
            const line = new TimeSignatureLine(options)
            line.value = +matches[1]
            return line
        }
        
        return null
    }
    
    * step()
    {
        const song = this.root.getHistory("SONG")
        song[0].song.timeSignature = this.value
    }
}



//------------------------------------------------------------------------------
// * classes/line/83-repeat.js
//------------------------------------------------------------------------------

class RepeatLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("REPEAT", 1)
        if (matches)
        {
            const line = new RepeatLine(options)
            line.getValue = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getValue = this.createFunction(this.getValue)
    }
    
    * step()
    {
        const song = this.root.getHistory("SONG")
        song[0].song.repeat = this.getValue()
    }
}



//------------------------------------------------------------------------------
// * classes/line/84-type.js
//------------------------------------------------------------------------------

class TypeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("TYPE", 1)
        if (matches)
        {
            const line = new TypeLine(options)
            line.getValue = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getValue = this.createFunction(this.getValue)
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        instrument[0].instrument.type = this.getValue()
    }
}



//------------------------------------------------------------------------------
// * classes/line/85-reverb.js
//------------------------------------------------------------------------------

class ReverbLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("REVERB", 1)
        if (matches)
        {
            const line = new ReverbLine(options)
            line.value = (+matches[1] / 100)
            return line
        }
        
        return null
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        instrument[0].instrument.blend.value = this.value
    }
}



//------------------------------------------------------------------------------
// * classes/line/86-sheet.js
//------------------------------------------------------------------------------

class SheetLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SHEET", 1)
        if (matches)
        {
            const line = new SheetLine(options)
            line.getLine = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getLine = this.createFunction(this.getLine)
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        instrument[0].instrument.sheet += this.getLine() + " "
    }
}



//------------------------------------------------------------------------------
// * classes/line/87-play.js
//------------------------------------------------------------------------------

class PlayLine extends Line
{
    static _ = Line.classes.add(this.name)
    static songs = []
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("PLAY", 1)
        if (matches)
        {
            const line = new PlayLine(options)
            line.getSongTitle = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getSongTitle = this.createFunction(this.getSongTitle)
    }
    
    * step()
    {
        new Promise(x => this.play().then(x))
    }
    
    async play()
    {
        const title = this.getSongTitle()
        const song = SongBlock.songs[title].clone()
        song.title = title
        PlayLine.songs.push(song)
        
        const ctx = this.root.audioCtx
        
        const master = ctx.createGain()
        master.connect(ctx.destination)
        
        song.connect(master)
        await song.play()
        song.disconnect(master)
        
        master.disconnect(ctx.destination)
        
        const index = PlayLine.songs.indexOf(song)
        PlayLine.songs.splice(index, 1)
    }
}



//------------------------------------------------------------------------------
// * classes/line/88-stop.js
//------------------------------------------------------------------------------

class StopLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("STOP", 1)
        if (matches)
        {
            const line = new StopLine(options)
            line.getSongTitle = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getSongTitle = this.createFunction(this.getSongTitle)
    }
    
    * step()
    {
        const title = this.getSongTitle()
        for (const song of PlayLine.songs)
            if (song.title == title)
                song.stop()
    }
}
