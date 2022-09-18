class SongBlock extends Block
{
    static _ = Line.classes.add(this.name)
    static songs = { }
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SONG", 1)
        if (matches)
        {
            const line = new SongBlock(options)
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
        this.root.getHistory("SONG").push(this)
        
        this.song = new Song(this.root.audioCtx)
        
        const title = this.getTitle()
        SongBlock.songs[title] = this.song
    }
    
    end()
    {
        this.root.getHistory("SONG").pop(this)
    }
}