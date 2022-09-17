class IfBlock extends Block
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.match(/^IF\s+NOT\s+(.+)$/i)
        if (matches)
        {
            let statement = matches[1]
            
            if (statement.toUpperCase().endsWith("THEN"))
                statement = statement.substr(0, statement.length - 4).trim()
            
            const line = new IfBlock(options)
            line.not = true
            line.getCondition = Utils.convertToCondition(statement)
            return line
        }
        
        matches = options.code.match(/^IF\s+(.+)$/i)
        if (matches)
        {
            let statement = matches[1]
            
            if (statement.toUpperCase().endsWith("THEN"))
                statement = statement.substr(0, statement.length - 4).trim()
            
            const line = new IfBlock(options)
            line.getCondition = Utils.convertToCondition(statement)
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getCondition = this.createFunction(this.getCondition)
    }
    
    * step()
    {
        this.parent.isTrue = this.getCondition()
        
        if (this.not)
            this.parent.isTrue = !this.parent.isTrue
        
        if (!this.parent.isTrue)
            yield StepResult.skip()
    }
}