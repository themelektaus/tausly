class RepeatLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("REPEAT", 1)
        if (matches)
        {
            const line = new RepeatLine(options)
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
        const song = this.root.getHistory("SONG")
        song[0].song.repeat = this.getValue()
    }
}