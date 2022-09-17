class TextLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^TEXT\s+(.+?)\s*\,\s*(.+?)\s*\,\s*(.+?)$/i)
        if (!matches)
            return null
        
        const line = new TextLine(options)
        line.getX = matches[1]
        line.getY = matches[2]
        line.getText = matches[3]
        return line
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        this.getText = this.createFunction(this.getText)
    }
    
    * step()
    {
        this.root.ctx.fillText(this.getText(), this.getX(), this.getY())
        this.root.onRender()
    }
}