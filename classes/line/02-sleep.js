class SleepLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^SLEEP\s+(.+)$/i)
        if (!matches)
            return null
        
        const line = new SleepLine(options)
        line.getMilliseconds = matches[1]
        return line
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