class StepResult
{
    static wait(milliseconds)
    {
        const result = new StepResult
        result._wait = milliseconds
        return result
    }
    
    static skip()
    {
        const result = new StepResult
        result._skip = true
        return result
    }
    
    constructor()
    {
        this._wait = 0
        this._skip = false
    }
}