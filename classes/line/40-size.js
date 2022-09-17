class SizeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^SIZE\s(.+)\s*\,\s*(.+)$/i)
        if (!matches)
            return null
        
        const line = new SizeLine(options)
        line.getWidth = matches[1]
        line.getHeight = matches[2]
        return line
    }
    
    compile()
    {
        this.getWidth = this.createFunction(this.getWidth)
        this.getHeight = this.createFunction(this.getHeight)
    }
    
    * step()
    {
        this.root.setSize(this.getWidth(), this.getHeight())
    }
}