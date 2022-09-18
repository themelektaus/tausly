class ResetLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (options.code.matchKeyword("RESET"))
            return new ResetLine(options)
        
        return null
    }
    
    * step()
    {
        const ctx = this.root.getContext()
        
        const transforms = this.root.getHistory("TRANSFORMS")[0]
        transforms.splice(0, transforms.length)
    }
}