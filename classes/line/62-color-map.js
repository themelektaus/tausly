class ColorMap extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("COLORMAP", 2)
        if (matches)
        {
            const line = new ColorMap(options)
            line.getChar = matches[1]
            line.getColor = matches[2]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getChar = this.createFunction(this.getChar)
        this.getColor = this.createFunction(this.getColor)
    }
    
    * step()
    {
        const char = this.getChar()
        const color = this.getColor()
        
        const frame = this.root.getHistory("FRAME")[0]
        frame.colorMap ??= { }
        frame.colorMap[char] = color
    }
}