class NextLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/^NEXT$/i.test(options.code))
            return null
        
        return new NextLine(options)
    }
    
    * step()
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