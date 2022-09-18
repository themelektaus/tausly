class TypeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("TYPE", 1)
        if (matches)
        {
            const line = new TypeLine(options)
            line.getValue = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getValue = this.createFunction(this.getValue)
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        instrument[0].instrument.type = this.getValue()
    }
}