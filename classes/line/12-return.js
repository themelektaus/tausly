class ReturnLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/^RETURN$/i.test(options.code))
            return null
        
        return new ReturnLine(options)
    }
    
    * step()
    {
        const line = this.root.gosubHistory.pop()
        
        if (!line)
            return
        
        this.root.goto(line, 1)
    }
}