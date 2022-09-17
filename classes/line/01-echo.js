class EchoLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^ECHO\s+(.*)$/i)
        if (!matches)
            return null
        
        const line = new EchoLine(options)
        line.getData = matches[1]
        return line
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