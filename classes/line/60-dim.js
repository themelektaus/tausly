class DimLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        const matches = options.code.match(/^DIM\(([0-9\,\s]+)\)\s+(.+)$/i)
        if (!matches)
            return null
        
        const line = new DimLine(options)
        
        const size = matches[1].split(',')
        
        line.x = +size[0]
        
        if (size.length == 2)
            line.y = +size[1]
        
        line.name = matches[2]
        
        return line
    }
    
    prepare()
    {
        this.parent.declare(this.name)
    }
    
    compile()
    {
        const value = [];
        
        for (var i = 0; i < this.x; i++)
        {
            if (!this.y)
            {
                value.push(0)
                continue
            }
            
            value.push([]);
            for (var j = 0; j < this.y; j++)
                value[i][j] = 0
        }
        
        let expression
        
        if (this.y)
            expression = `[${value.join("],[")}]`
        else
            expression = value.join(",")
        
        expression = `[${expression}]`
        
        this.getValue = this.createFunction(expression)
    }
    
    step()
    {
        this.parent.init(this.name, this.getValue())
    }
}