class GameloopBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("BEGIN\\sGAMELOOP", 1)
        if (matches)
        {
            const line = new GameloopBlock(options)
            line.fps = +matches[1]
            return line
        }
        
        matches = options.code.matchKeyword("BEGIN\\sGAMELOOP")
        if (matches)
        {
            const line = new GameloopBlock(options)
            line.fps = 60
            return line
        }
        
        return null
    }
    
    step()
    {
        if (this.skip)
        {
            delete this.skip
            return false
        }
        
        this.root.beginDeltaTime()
        
        const milliseconds = this.root.getFrameTime(this.fps)
        if (milliseconds <= 0)
            return 0
        return milliseconds
    }
    
    next()
    {
        this.end()
    }
    
    break()
    {
        this.skip = true
        this.next()
    }
    
    end()
    {
        this.root.endDeltaTime()
        
        this.root.goto(this)
    }
}