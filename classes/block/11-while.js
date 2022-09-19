class WhileBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("WHILE\\s+NOT", 1)
        if (matches)
        {
            const line = new WhileBlock(options)
            line.not = true
            line.getCondition = matches[1].toCondition()
            return line
        }
        
        matches = options.code.matchKeyword("WHILE", 1)
        if (matches)
        {
            const line = new WhileBlock(options)
            line.not = false
            line.getCondition = matches[1].toCondition()
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getCondition = this.createFunction(this.getCondition)
    }
    
    * step()
    {
        if (!this.skip && this.getCondition() == !this.not)
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