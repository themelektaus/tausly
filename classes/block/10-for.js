class ForBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^FOR\s+([^ ]+)\s*\=\s*([0-9]+)\s+TO\s+(.+)$/i)
        if (matches)
        {
            const block = new ForBlock(options)
            block.name = matches[1]
            block.from = +matches[2]
            block.getTo = matches[3]
            return block
        }
        
        return null
    }
    
    prepare()
    {
        this.parent.declare(this.name)
    }
    
    compile()
    {
        this.getTo = this.createFunction(this.getTo)
    }
    
    * step()
    {
        const from = this.from
        const to = this.getTo()
        
        this.parent.init(this.name, from)
        
        if (this.init === false)
            delete this.init
        else
            this.parent.set(this.name, from)
        
        if (this.skip || this.parent.get(this.name) > to)
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
        const value = this.get(this.name)
        this.set(this.name, value + 1)
        this.init = false
        this.root.goto(this)
    }
}