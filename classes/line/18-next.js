class NextLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("NEXT"))
            return new NextLine(options)
        
        return null
    }
    
    step()
    {
        let parent = this
        while (!parent.next)
        {
            parent = parent.parent
            if (!parent)
                break
        }
        if (parent && parent.next)
            parent.next()
    }
}