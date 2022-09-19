class ElseBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("ELSE"))
            return new ElseBlock(options)
        
        return null
    }
    
    setup(parents)
    {
        this.parent = this.parent.parent
        parents.shift()
    }
    
    step()
    {
        if (this.parent.isTrue)
            return false
    }
}