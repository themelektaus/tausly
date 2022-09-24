class TranslateLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("TRANSLATE", 2)
        if (matches)
        {
            const line = new TranslateLine(options)
            line.getX = matches[1]
            line.getY = matches[2]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
    }
    
    step()
    {
        const ctx = this.root.getContext()
        const x = this.getX()
        const y = this.getY()
        
        this.root.getHistory("TRANSFORMS")[0].push((tx, ty) =>
        {
            ctx.translate(x, y)
        })
    }
}