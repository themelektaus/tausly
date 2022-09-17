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
            
            line.name = x[0]
            
            line.getX = "undefined"
            line.getY = "undefined"
            
            if (x.length >= 2)
            {
                line.getX = x[1].split(')')[0]
                
                if (x.length == 3)
                {
                    line.getY = x[2].split(')')[0]
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
        this.getValue = this.createFunction(this.getValue)
    }
    
    * step()
    {
        this.parent.set(this.name, this.getValue(), this.getX(), this.getY(), this.operator)
    }
}