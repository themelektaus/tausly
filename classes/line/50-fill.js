class FillLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("FILL", 4)
        if (matches)
        {
            const line = new FillLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getWidth = matches[3]
            line.getHeight = matches[4]
            return line
        }
        
        matches = options.code.matchKeyword("FILL")
        if (matches)
        {
            const line = new FillLine(options)
            line.getX = "0"
            line.getY = "0"
            line.getWidth = -1
            line.getHeight = -1
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        
        if (this.getWidth == -1)
            this.getWidth = this.createFunction("WIDTH")
        else
            this.getWidth = this.createFunction(this.getWidth)
        
        if (this.getHeight == -1)
            this.getHeight = this.createFunction("HEIGHT")
        else
            this.getHeight = this.createFunction(this.getHeight)
    }
    
    step()
    {
        const ctx = this.root.getContext()
        const x = this.getX()
        const y = this.getY()
        const w = this.getWidth()
        const h = this.getHeight()
        
        this.beginTransform(x, y, w, h)
        ctx.fillRect(x, y, this.getWidth(), this.getHeight())
        this.endTransform(ctx)
        
        if (ctx.isRoot)
            this.root.onRender()
    }
}