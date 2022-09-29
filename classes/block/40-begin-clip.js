class ClipBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("BEGIN\\sCLIP", 4)
        if (matches)
        {
            const line = new ClipBlock(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getWidth = matches[3]
            line.getHeight = matches[4]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        this.getWidth = this.createFunction(this.getWidth)
        this.getHeight = this.createFunction(this.getHeight)
    }
    
    step()
    {
        const ctx = this.root.getContext()
        const x = this.getX()
        const y = this.getY()
        const w = this.getWidth()
        const h = this.getHeight()
        
        this.transforms = [
            (tx, ty) =>
            {
                ctx.save()
                ctx.beginPath()
                ctx.rect(x, y, w, h)
                ctx.clip()
            }
        ]
        this.root.getHistory("TRANSFORMS").unshift(this.transforms)
    }
    
    end()
    {
        this.root.getHistory("TRANSFORMS").shift()
    }
}