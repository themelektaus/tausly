class LoopBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("LOOP"))
            return new LoopBlock(options)
        
        return null
    }
    
    constructor(options)
    {
        super(options)
        this.useDeltaTime = true
    }
    
    * step()
    {
        if (!this.skip)
            return
        
        delete this.skip
        yield StepResult.skip()
    }
    
    next()
    {
        this.end()
    }
    
    break()
    {
        this.skip = true
        this.next()
    }
    
    end()
    {
        this.root.goto(this)
    }
}