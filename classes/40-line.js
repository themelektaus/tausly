class Line
{
    static classes = new Set()
    
    constructor(options)
    {
        this.parent = options.parent
        this.globalIndex = options.globalIndex
        this.localIndex = options.localIndex
        this.startTime = null
    }
    
    
    // TODO: Set this value on compile
    get root()
    {
        if (!this._root)
        {
            this._root = this
            while (this._root.parent)
                this._root = this._root.parent
        }
        return this._root
    }
    
    resetDeltaTime()
    {
        this.startTime = performance.now()
    }
    
    getDeltaTime()
    {
        if (this.startTime)
            return performance.now() - this.startTime
        return 0
    }
    
    createFunction(expression)
    {
        return new Function(`return ${this.parent.evaluate(expression)}`)
    }
}