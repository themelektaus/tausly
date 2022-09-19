class NormalizeLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("NORMALIZE", 1)
        if (matches)
        {
            const line = new NormalizeLine(options)
            line.dimName = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getDimValue = this.createFunction(this.dimName)
    }
    
    step()
    {
        const dimValue = this.getDimValue()
        
        const magnitude = Math.sqrt(dimValue[0] ** 2 + dimValue[1] ** 2)
        if (magnitude > 0)
        {
            dimValue[0] /= magnitude
            dimValue[1] /= magnitude
        }
        
        this.parent.set(this.dimName, dimValue)
    }
}