class LoopBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/^LOOP$/i.test(options.code))
            return null
        
        return new LoopBlock(options)
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