class SizeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("SIZE", 2)
        if (matches)
        {
            const line = new SizeLine(options)
            line.getWidth = matches[1]
            line.getHeight = matches[2]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getWidth = this.createFunction(this.getWidth)
        this.getHeight = this.createFunction(this.getHeight)
    }
    
    step()
    {
        const sprite = this.root.getHistory("SPRITE")
        if (sprite && sprite.length)
        {
            sprite[0].sprite.setSize(this.getWidth(), this.getHeight())
            return
        }
        this.root.setSize(this.getWidth(), this.getHeight())
    }
}