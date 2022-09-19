class ReverbLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("REVERB", 1)
        if (matches)
        {
            const line = new ReverbLine(options)
            line.value = (+matches[1] / 100)
            return line
        }
        
        return null
    }
    
    step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        instrument[0].instrument.reverb = this.value
    }
}