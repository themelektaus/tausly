class ResetLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.matchKeyword("RESET", 1)
        if (matches)
        {
            const line = new ResetLine(options)
            line.dimName = matches[1]
            return line
        }
        
        matches = options.code.matchKeyword("RESET")
        if (matches)
        {
            return new ResetLine(options)
        }
        
        return null
    }
    
    step()
    {
        if (this.dimName)
        {
            let dim = this.parent.get(this.dimName)
            if (dim !== undefined)
            {
                if (Array.isArray(dim))
                {
                    for (const i in dim)
                    {
                        if (Array.isArray(dim[i]))
                        {
                            for (const j in dim[i])
                            {
                                if (Array.isArray(dim[i][j]))
                                {
                                    for (const k in dim)
                                    {
                                        dim[i][j][k] = 0
                                    }
                                }
                                else
                                {
                                    dim[i][j] = 0
                                }
                            }
                        }
                        else
                        {
                            dim[i] = 0
                        }
                    }
                }
                else
                {
                    dim = 0
                }
                this.parent.set(this.dimName, dim)
            }
            return
        }
        
        const ctx = this.root.getContext()
        
        const transforms = this.root.getHistory("TRANSFORMS")[0]
        transforms.splice(0, transforms.length)
    }
}