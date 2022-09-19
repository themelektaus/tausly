class RotateLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("ROTATE", 1)
        if (matches)
        {
            const line = new RotateLine(options)
            line.getAngle = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getAngle = this.createFunction(this.getAngle)
    }
    
    step()
    {
        const ctx = this.root.getContext()
        const angle = this.getAngle()
        
        this.root.getHistory("TRANSFORMS")[0].push((tx, ty) =>
        {
            ctx.translate(tx, ty)
            ctx.rotate(angle * Math.PI / 180)
            ctx.translate(-tx, -ty)
        })
    }
}