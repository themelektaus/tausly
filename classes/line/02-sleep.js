class SleepLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("SLEEP", 1)
        if (matches)
        {
            const line = new SleepLine(options)
            line.getMilliseconds = matches[1]
            return line
        }
        
        matches = options.code.matchKeyword("SLEEP")
        if (matches)
        {
            const line = new SleepLine(options)
            line.getMilliseconds = 1
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getMilliseconds = this.createFunction(this.getMilliseconds)
    }
    
    * step()
    {
        const milliseconds = this.getMilliseconds()
        if (milliseconds <= 0)
        {
            yield
            return
        }
        
        const startTime = performance.now()
        do yield
        while (performance.now() - startTime < milliseconds)
    }
}