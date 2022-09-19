class LoopBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("LOOP"))
        {
            const line = new LoopBlock(options)
            return line
        }
        
        return null
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