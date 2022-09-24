class VarLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.match(/^([^ ]+)\s*(?:(|\+|\-|\*|\/))\=\s*(.+)$/)
        if (matches)
        {
            const line = new VarLine(options)
            
            const x = matches[1].split('(')
            
            line.varName = x[0]
            
            line.getX = "undefined"
            line.getY = "undefined"
            line.getZ = "undefined"
            
            if (x.length >= 2)
            {
                line.getX = x[1].split(')')[0]
                
                if (x.length >= 3)
                {
                    line.getY = x[2].split(')')[0]
                    
                    if (x.length == 4)
                    {
                        line.getZ = x[3].split(')')[0]
                    }
                }
            }
            
            line.operator = matches[2]
            line.getValue = matches[3]
            
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getX = this.createFunction(this.getX)
        this.getY = this.createFunction(this.getY)
        this.getZ = this.createFunction(this.getZ)
        
        let value = this.getValue
        if (!/^[0-9]+$/.test(value) && /^[0-9\,]+$/.test(value))
            value = `[ ${value} ]`
        
        this.getValue = this.createFunction(value)
    }
    
    step()
    {
        this.parent.set(this.varName, this.getValue(), this.getX(), this.getY(), this.getZ(), this.operator)
    }
}