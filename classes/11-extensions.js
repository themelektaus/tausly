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
            pattern += "\\s+(.+?)"
        else
            pattern += "\\s*\\,\\s*(.+?)"
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
    this.font = '17.6px dejavu, monospace'
    this.textBaseline = "top"
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