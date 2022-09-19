class DrawLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("DRAW", 4)
        if (matches)
        {
            const line = new DrawLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getSpriteTitle = matches[3]
            line.getFrameTitle = matches[4]
            return line
        }
        
        matches = options.code.matchKeyword("DRAW", 3)
        if (matches)
        {
            const line = new DrawLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getSpriteTitle = matches[3]
            line.getFrameTitle = "undefined"
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        this.getSpriteTitle = this.createFunction(this.getSpriteTitle)
        this.getFrameTitle = this.createFunction(this.getFrameTitle)
    }
    
    step()
    {
        const spriteTitle = this.getSpriteTitle()
        const frameTitle = this.getFrameTitle()
        
        const ctx = this.root.getContext()
        
        const sprite = SpriteBlock.sprites[spriteTitle]
        
        let frame
        
        if (typeof frameTitle == "number")
        {
            frame = sprite.frames[frameTitle]
        }
        else if (frameTitle)
        {
            for (const spriteFrame of sprite.frames)
            {
                if (spriteFrame.title == frameTitle)
                {
                    frame = spriteFrame
                    break
                }
            }
        }
        else
        {
            frame = sprite.frames[0]
        }
        
        const x = this.getX()
        const y = this.getY()
        const w = frame.image.width
        const h = frame.image.height
        
        this.beginTransform(x, y, w, h)
        ctx.drawImage(frame.image, x, y)
        this.endTransform(ctx)
        
        if (ctx.isRoot)
            this.root.onRender()
    }
}