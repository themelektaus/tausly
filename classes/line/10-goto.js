class GotoLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^GOTO\s+(.+)$/i)
        if (!matches)
            return null
        
        const line = new GotoLine(options)
        line.label = matches[1]
        return line
    }
    
    * step()
    {
        const line = this.root.findLine(line =>
        {
            if (line instanceof LabelLine)
                if (line.name == this.label)
                    return true
            return false
        })
        
        this.root.goto(line)
    }
}