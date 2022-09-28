class WriteLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("WRITE", 2)
        if (matches)
        {
            const line = new WriteLine(options)
            line.getKey = matches[1]
            line.getValue = matches[2]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getKey = this.createFunction(this.getKey)
        this.getValue = this.createFunction(this.getValue)
    }
    
    step()
    {
        this.root.setData(this.getKey(), this.getValue())
    }
}