class StopLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("STOP", 1)
        if (matches)
        {
            const line = new StopLine(options)
            line.getSongTitle = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getSongTitle = this.createFunction(this.getSongTitle)
    }
    
    step()
    {
        const title = this.getSongTitle()
        for (const song of PlayLine.songs)
            if (song.title == title)
                song.stop()
    }
}