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