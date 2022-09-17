class BreakLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/^BREAK$/i.test(options.code))
            return null
        
        return new BreakLine(options)
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