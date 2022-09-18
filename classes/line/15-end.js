class EndLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("END"))
            return new EndLine(options)
        
        return null
    }
    
    setup(parents)
    {
        this.parent = this.parent.parent
        parents.shift()
    }
    
    * step()
    {
        const index = this.parent.lines.indexOf(this)
        const block = this.parent.lines[index - 1]
        
        if (block.end)
            block.end()
    }
}