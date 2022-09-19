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
    
    step()
    {
        this.root.onEcho(this.getData())
    }
}