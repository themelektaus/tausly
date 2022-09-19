class FuncLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.match(/^FUNC\s+(.+?)\s+RETURNS\s(.*?)$/)
        if (matches)
        {
            const line = new FuncLine(options)
            line.funcName = matches[1]
            line.f = matches[2]
            return line
        }
        
        return null
    }
    
    prepare()
    {
        this.parent.declareFunc(this.funcName)
    }
    
    compile()
    {
        this.f = this.createFunction(this.f)
    }
    
    * step()
    {
        this.parent.initFunc(this.funcName, this.f)
    }
}