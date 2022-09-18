class CursorLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("CURSOR\\s+SHOW"))
        {
            const line = new CursorLine(options)
            line.hide = false
            return line
        }
        
        if (options.code.matchKeyword("CURSOR\\s+HIDE"))
        {
            const line = new CursorLine(options)
            line.hide = true
            return line
        }
        
        return null
    }
    
    * step()
    {
        const parent = this.root.canvas.parentNode
        if (parent)
            parent.style.cursor = this.hide ? "none" : "unset"
    }
}