class GosubLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.matchKeyword("GOSUB", 1)
        if (matches)
        {
            const line = new GosubLine(options)
            line.label = matches[1]
            return line
        }
        
        return null
    }
    
    * step()
    {
        this.root.getHistory("GOSUB").push(this)
        
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