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