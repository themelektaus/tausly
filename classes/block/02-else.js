class ElseBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/^ELSE$/i.test(options.code))
            return null
        
        return new ElseBlock(options)
    }
    
    setup(parents)
    {
        this.parent = this.parent.parent
        parents.shift()
    }
    
    * step()
    {
        if (this.parent.isTrue)
            yield StepResult.skip()
    }
}