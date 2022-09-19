class ReturnLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("RETURN\\sTO", 1)
        if (matches)
        {
            const line = new ReturnLine(options)
            line.label = matches[1]
            return line
        }
        
        matches = options.code.matchKeyword("RETURN")
        if (matches)
        {
            const line = new ReturnLine(options)
            return line
        }
        
        return null
    }
    
    step()
    {
        const line = this.root.getHistory("GOSUB").pop()
        
        if (this.label)
        {
            this.root.goto(this.root.findLine(line =>
            {
                if (line instanceof LabelLine)
                    if (line.name == this.label)
                        return true
                return false
            }))
            return
        }
        
        this.root.goto(line, 1)
    }
}