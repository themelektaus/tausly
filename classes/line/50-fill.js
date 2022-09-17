class FillLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (/^FILL$/i.test(options.code))
        {
            const line = new FillLine(options)
            line.getX = "0"
            line.getY = "0"
            line.getWidth = -1
            line.getHeight = -1
            return line
        }
        
        const matches = options.code.match(/^FILL\s(.+)\s*\,\s*(.+)\s*\,\s*(.+)\s*\,\s*(.+)$/i)
        if (matches)
        {
            const line = new FillLine(options)
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
        
        if (this.getWidth == -1)
            this.getWidth = this.createFunction("WIDTH")
        else
            this.getWidth = this.createFunction(this.getWidth)
        
        if (this.getHeight == -1)
            this.getHeight = this.createFunction("HEIGHT")
        else
            this.getHeight = this.createFunction(this.getHeight)
    }
    
    * step()
    {
        const x = this.getX()
        const y = this.getY()
        const w = this.getWidth()
        const h = this.getHeight()
        const tx = x + w / 2
        const ty = y + h / 2
        //this.root.ctx.translate(tx, ty)
        //this.root.ctx.rotate(45 * Math.PI / 180);
        //this.root.ctx.translate(-tx, -ty)
        this.root.ctx.fillRect(x, y, this.getWidth(), this.getHeight())
        //this.root.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.root.onRender()
    }
}