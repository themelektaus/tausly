class InstrumentBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("INSTRUMENT", 1)
        if (matches)
        {
            const line = new InstrumentBlock(options)
            line.getTitle = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getTitle = this.createFunction(this.getTitle)
    }
    
    * step()
    {
        this.root.getHistory("INSTRUMENT").unshift(this)
        
        const song = this.root.getHistory("SONG")
        this.instrument = new Instrument(song[0].song)
    }
    
    end()
    {
        const song = this.root.getHistory("SONG")
        song[0].song.add(this.instrument)
        
        this.root.getHistory("INSTRUMENT").shift(this)
    }
}