class SetLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^SET\s+([^ ]+)\s*\=\s*(.+)$/i)
        if (matches)
        {
            const line = new SetLine(options)
            line.varName = matches[1]
            line.getValue = matches[2]
            return line
        }
        
        return null
    }
    
    prepare()
    {
        this.parent.declare(this.varName)
    }
    
    compile()
    {
        this.getValue = this.createFunction(this.getValue)
    }
    
    step()
    {
        const value = this.getValue()
        this.parent.init(this.varName, value)
        this.parent.set(this.varName, value)
    }
}