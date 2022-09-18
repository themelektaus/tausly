class ScaleLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("SCALE", 1)
        if (matches)
        {
            const line = new ScaleLine(options)
            line.getScale = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getScale = this.createFunction(this.getScale)
    }
    
    * step()
    {
        const ctx = this.root.getContext()
        const scale = this.getScale()
        
        this.root.getHistory("TRANSFORMS")[0].push((tx, ty) =>
        {
            ctx.translate(tx, ty)
            ctx.scale(scale, scale)
            ctx.translate(-tx, -ty)
        })
    }
}