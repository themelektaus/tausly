class PixelMap extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("PIXELMAP", 1)
        if (matches)
        {
            const line = new PixelMap(options)
            line.getLine = matches[1]
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getLine = this.createFunction(this.getLine)
    }
    
    * step()
    {
        const frame = this.root.getHistory("FRAME")[0]
        frame.pixelMapIndex ??= 0
        
        const ctx = this.root.getContext()
        
        const line = this.getLine()
        
        const fillStyle = ctx.fillStyle
        
        for (let x = 0; x < line.length; x++)
        {
            const c = line.charAt(x)
            const color = frame.colorMap[c]
            if (!color)
                continue
            
            ctx.fillStyle = color
            ctx.fillRect(x, frame.pixelMapIndex, 1, 1)
        }
        
        ctx.fillStyle = fillStyle
        
        frame.pixelMapIndex++
        
        if (ctx.isRoot)
            this.root.onRender()
    }
}