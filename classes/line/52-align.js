class AlignLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("ALIGN\\s+LEFT"))
        {
            const line = new AlignLine(options)
            line.align = "start"
            return line
        }
        
        if (options.code.matchKeyword("ALIGN\\s+CENTER"))
        {
            const line = new AlignLine(options)
            line.align = "center"
            return line
        }
        
        if (options.code.matchKeyword("ALIGN\\s+RIGHT"))
        {
            const line = new AlignLine(options)
            line.align = "right"
            return line
        }
        
        return null
    }
    
    * step()
    {
        const ctx = this.root.getContext()
        ctx.textAlign = this.align
    }
}