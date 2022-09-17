class LabelLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        if (!/\:$/.test(options.code) && !/^\*/.test(options.code))
            return null
        
        const line = new LabelLine(options)
        line.name = options.code.replace(/^(\*?)\s*([^\:]+)\s*(\:?)$/, "$2")
        return line
    }
}