class TextLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("TEXT", 5)
        if (matches)
        {
            const line = new TextLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getText = matches[3]
            line.getMaxWidth = matches[4]
            line.getFullText = matches[5]
            return line
        }
        
        matches = options.code.matchKeyword("TEXT", 4)
        if (matches)
        {
            const line = new TextLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getText = matches[3]
            line.getMaxWidth = matches[4]
            line.getFullText = "undefined"
            return line
        }
        
        matches = options.code.matchKeyword("TEXT", 3)
        if (matches)
        {
            const line = new TextLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            line.getText = matches[3]
            line.getMaxWidth = "undefined"
            line.getFullText = "undefined"
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        this.getText = this.createFunction(this.getText)
        this.getMaxWidth = this.createFunction(this.getMaxWidth)
        this.getFullText = this.createFunction(this.getFullText)
    }
    
    step()
    {
        const ctx = this.root.getContext()
        const x = this.getX()
        const y = this.getY()
        
        this.beginTransform(x, y, 0, 0)
        ctx.fillTextWrapped(this.getText(), this.getX(), this.getY(), this.getMaxWidth(), this.getFullText())
        this.endTransform(ctx)
        
        if (ctx.isRoot)
            this.root.onRender()
    }
}