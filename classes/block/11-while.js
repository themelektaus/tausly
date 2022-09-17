class WhileBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^WHILE\s+(.+)$/i)
        if (!matches)
            return null
        
        const line = new WhileBlock(options)
        line.getCondition = Utils.convertToCondition(matches[1])
        return line
    }
    
    constructor(options)
    {
        super(options)
        this.useDeltaTime = true
    }
    
    compile()
    {
        this.getCondition = this.createFunction(this.getCondition)
    }
    
    * step()
    {
        if (!this.skip && this.getCondition())
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