Number.isNumber = function(value)
{
    return typeof value === "number"
}

String.isString = function(value)
{
    return typeof value === 'string'
}

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
            pattern += "\\s+(.+?)" + Regex.outsideQuotes
        else
            pattern += "\\s*\\,\\s*(.+?)" + Regex.outsideQuotes
    }
    pattern += "$"
    
    const regex = new RegExp(pattern, "i")
    const matches = this.match(regex)
    
    return matches
}

Array.prototype.getLuminance = function(rgba)
{
    const r = .299 * (this[0] / 255) ** 2
    const g = .587 * (this[1] / 255) ** 2
    const b = .114 * (this[2] / 255) ** 2
    const a = this[3] / 255
    return Math.sqrt(r + g + b) * a
}

CanvasRenderingContext2D.prototype.refresh = function()
{
    this.font = "17.6px dejavu, monospace"
    this.textBaseline = "top"
}

CanvasRenderingContext2D.prototype.fillTextWrapped = function(text, x, y, maxWidth, fullText)
{
    if (!String.isString(text))
        text = "" + text
    
    let lines = this.getTextLines(text.split("\n"), maxWidth)
    
    if (fullText !== undefined)
    {
        const fullLines = this.getTextLines(fullText.split("\n"), maxWidth)
        const i = lines.length - 1
        if (lines[i].length > fullLines[i].length)
        {
            lines.push(lines[i].substring(fullLines[i].length).trim())
            lines[i] = lines[i].substring(0, fullLines[i].length)
        }
    }
    
    this.fillTextLines(lines, x, y)
}

CanvasRenderingContext2D.prototype.getTextLines = function(text, maxWidth)
{
    if (Array.isArray(text))
    {
        const lines = []
        for (const x of text)
            lines.push(...this.getTextLines(x, maxWidth))
        return lines
    }
    
    if (maxWidth === undefined)
        return [ text ]
    
    const words = text.split(" ")
    const lines = []
    
    let line = words[0]
    
    for (let i = 1; i < words.length; i++)
    {
        const word = words[i]
        const size = this.measureText(line + " " + word)
        
        if (size.width < maxWidth)
        {
            line += " " + word
            continue
        }
        
        lines.push(line)
        line = word
    }
    
    lines.push(line)
    return lines;
}

CanvasRenderingContext2D.prototype.fillTextLines = function(lines, x, y)
{
    for (let i = 0; i < lines.length; i++)
        this.fillText(lines[i], x, y + i * 22)
}

Promise.timeout = function(func, ms)
{
    return new Promise(x => setTimeout(() => func(x), ms ?? 0))
}

Promise.delay = function(ms)
{
    return Promise.timeout(x => x(), ms)
}

Promise.waitFor = async function(predicate)
{
    const task = () => new Promise(x => setTimeout(() => x(predicate())))
    while (true)
        if (await task())
            break
}