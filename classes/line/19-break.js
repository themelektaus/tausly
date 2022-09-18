class BreakLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("BREAK"))
            return new BreakLine(options)
        
        return null
    }
    
    * step()
    {
        let parent = this
        while (!parent.break)
        {
            parent = parent.parent
            if (!parent)
                break
        }
        if (parent && parent.break)
            parent.break()
    }
}