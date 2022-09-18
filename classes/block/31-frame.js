class FrameBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("FRAME")
        if (matches)
        {
            const line = new FrameBlock(options)
            line.getTitle = "undefined"
            return line
        }
        
        matches = options.code.matchKeyword("FRAME", 1)
        if (matches)
        {
            const line = new FrameBlock(options)
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
        this.root.getHistory("FRAME").unshift(this)
        
        const sprite = this.root.getHistory("SPRITE")[0].sprite
        this.frame = new Frame(sprite)
        sprite.add(this.frame)
        
        const title = this.getTitle()
        this.frame.title = title ?? this.frame.index.toString()
    }
    
    end()
    {
        const sprite = this.root.getHistory("SPRITE")
        
        this.frame.burn()
        
        this.root.getHistory("FRAME").shift(this)
    }
}