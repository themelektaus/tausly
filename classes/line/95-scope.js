class ScopeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SCOPE", 1)
        if (matches)
        {
            const line = new ScopeLine(options)
            line.getScope = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getScope = this.createFunction(this.getScope)
    }
    
    step()
    {
        this.root.scope = this.getScope()
    }
}