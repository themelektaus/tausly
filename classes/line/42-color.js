class ColorLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("COLOR", 4)
        if (matches)
        {
            const line = new ColorLine(options)
            line.rgba = [ matches[1], matches[2], matches[3], matches[4] ]
            return line
        }
        
        matches = options.code.matchKeyword("COLOR", 3)
        if (matches)
        {
            const line = new ColorLine(options)
            line.getColor = `"rgb(${matches[1]}, ${matches[2]}, ${matches[3]})"`
            return line
        }
        
        matches = options.code.matchKeyword("COLOR", 1)
        if (matches)
        {
            const line = new ColorLine(options)
            line.getColor = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        if (this.rgba)
        {
            const r = this.rgba[0]
            const g = this.rgba[1]
            const b = this.rgba[2]
            const a = this.parent.evaluate(this.rgba[3]) / 255
            this.getColor = `"rgba(${r}, ${g}, ${b}, ${a})"`
        }
        this.getColor = this.createFunction(this.getColor)
    }
    
    step()
    {
        const ctx = this.root.getContext()
        ctx.fillStyle = this.getColor()
    }
}