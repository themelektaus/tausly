class PlayLine extends Line
{
    static _ = Line.classes.add(this.name)
    static songs = []
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("PLAY", 1)
        if (matches)
        {
            const line = new PlayLine(options)
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
        this.play()
    }
    
    async play()
    {
        const title = this.getSongTitle()
        const song = SongBlock.songs[title].clone()
        
        song.title = title
        PlayLine.songs.push(song)
        
        const ctx = this.root.audioCtx
        
        const master = ctx.createGain()
        master.connect(ctx.destination)
        
        song.connect(master)
        await song.play()
        song.disconnect(master)
        
        master.disconnect(ctx.destination)
        
        while (true)
        {
            const index = PlayLine.songs.indexOf(song)
            if (index == -1)
                break
            
            PlayLine.songs.splice(index, 1)
        }
    }
}