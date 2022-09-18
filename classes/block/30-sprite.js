class SpriteBlock extends Block
{
    static _ = Line.classes.add(this.name)
    static sprites = { }
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SPRITE", 1)
        if (matches)
        {
            const line = new SpriteBlock(options)
            line.getTitle = matches[1]
            line.width = 0
            line.height = 0
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
        this.root.getHistory("SPRITE").unshift(this)
        
        this.sprite = new Sprite()
        
        const title = this.getTitle()
        SpriteBlock.sprites[title] = this.sprite
    }
    
    end()
    {
        this.root.getHistory("SPRITE").shift(this)
    }
}