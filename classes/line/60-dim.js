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
        
        if (size.length >= 2)
            line.y = +size[1]
        
        if (size.length == 3)
            line.z = +size[1]
        
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
        
        for (let i = 0; i < this.x; i++)
        {
            if (!this.y)
            {
                value.push(0)
                continue
            }
            
            value.push([]);
            for (let j = 0; j < this.y; j++)
            {
                if (!this.z)
                {
                    value[i][j] = 0
                    continue
                }
                
                value[i].push([]);
                for (let k = 0; k < this.k; j++)
                    value[i][j][k] = 0
            }
        }
        
        let expression
        
        if (this.y)
        {
            if (this.z)
            {
                let temp = []
                for (let i = 0; i < this.x; i++)
                    temp.push(`[${value[i].join("],[")}]`)
                expression = `[${temp.join("],[")}]`
            }
            else
            {
                expression = `[${value.join("],[")}]`
            }
        }
        else
        {
            expression = value.join(",")
        }
        
        expression = `[${expression}]`
        
        this.getValue = this.createFunction(expression)
    }
    
    step()
    {
        this.parent.init(this.name, this.getValue())
    }
}