class GainLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("GAIN", 1)
        if (matches)
        {
            const line = new GainLine(options)
            line.value = (+matches[1] / 100)
            return line
        }
        
        return null
    }
    
    * step()
    {
        const instrument = this.root.getHistory("INSTRUMENT")
        if (instrument && instrument.length)
        {
            instrument[0].instrument.gain = this.value
            return
        }
        
        const song = this.root.getHistory("SONG")
        song[0].song.gain.value = this.value
    }
}