class SheetLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SHEET", 1)
        if (matches)
        {
            const line = new SheetLine(options)
            line.getLine = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getLine = this.createFunction(this.getLine)
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        instrument[0].instrument.sheet += this.getLine() + " "
    }
}