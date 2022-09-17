class ClearLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/^CLEAR$/i.test(options.code))
            return null
        
        return new ClearLine(options)
    }
    
    * step()
    {
        this.root.onClear()
        this.root.ctx.clearRect(0, 0, this.root.canvas.width, this.root.canvas.height)
    }
}