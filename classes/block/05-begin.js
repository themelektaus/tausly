class BeginBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("BEGIN"))
            return new BeginBlock(options)
        
        return null
    }
    
    * step()
    {
        this.transforms = []
        this.root.getHistory("TRANSFORMS").unshift(this.transforms)
    }
    
    end()
    {
        this.root.getHistory("TRANSFORMS").shift(this.transforms)
    }
}