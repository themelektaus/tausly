class TimeSignatureLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("TIME SIGNATURE", 1)
        if (matches)
        {
            const line = new TimeSignatureLine(options)
            line.value = +matches[1]
            return line
        }
        
        return null
    }
    
    * step()
    {
        const song = this.root.getHistory("SONG")
        song[0].song.timeSignature = this.value
    }
}