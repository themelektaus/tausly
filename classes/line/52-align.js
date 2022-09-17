class AlignLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (/^ALIGN\s+LEFT$/i.test(options.code))
        {
            const line = new AlignLine(options)
            line.align = "start"
            return line
        }
        
        if (/^ALIGN\s+CENTER$/i.test(options.code))
        {
            const line = new AlignLine(options)
            line.align = "center"
            return line
        }
        
        if (/^ALIGN\s+RIGHT$/i.test(options.code))
        {
            const line = new AlignLine(options)
            line.align = "right"
            return line
        }
        
        return null
    }
    
    * step()
    {
        this.root.ctx.textAlign = this.align
    }
}