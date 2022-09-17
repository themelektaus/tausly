class SetLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^SET\s+([^ ]+)\s*\=\s*(.+)$/i)
        if (!matches)
            return null
        
        const line = new SetLine(options)
        line.name = matches[1]
        line.getValue = matches[2]
        return line
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