class ClearLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("CLEAR")
        if (matches)
            return new ClearLine(options)
        
        return null
    }
    
    * step()
    {
        const ctx = this.root.getContext()
        
        if (ctx.isRoot)
            this.root.onClear()
        
        ctx.clearRect(0, 0, this.root.canvas.width, this.root.canvas.height)
    }
}