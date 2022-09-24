class LogLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("LOG", 1)
        if (matches)
        {
            const line = new LogLine(options)
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
        console.log(this.getData())
    }
}