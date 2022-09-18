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