class Line
{
    static classes = new Set()
    
    constructor(options)
    {
        this.parent = options.parent
        this.globalIndex = options.globalIndex
        this.localIndex = options.localIndex
    }
    
    preCompile()
    {
        this.root = this
        while (this.root.parent)
            this.root = this.root.parent
    }
    
    createFunction(expression)
    {
        return new Function(`return ${this.parent.evaluate(expression)}`)
    }
    
    beginTransform(x, y, w, h)
    {
        const tx = x + w / 2
        const ty = y + h / 2
        const transforms = this.root.getHistory("TRANSFORMS")[0]
        for (const transform of transforms)
            transform(tx, ty)
    }

    endTransform(ctx)
    {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.restore()
    }
}