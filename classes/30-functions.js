class Functions
{
    static rules =
    [
        [
            /\bTRUE\b/gi,
            "Functions._TRUE_()"
        ],
        [
            /\bFALSE\b/gi,
            "Functions._FALSE_()"
        ],
        [
            /\bNULL\b/gi,
            "Functions._NULL_()"
        ],
        [
            /\bWIDTH\b/gi,
            "Functions._WIDTH_.apply(this)"
        ],
        [
            /\bHEIGHT\b/gi,
            "Functions._HEIGHT_.apply(this)"
        ],
        [
            /\bCEIL\b\s*\(([^\)]+)\)/gi,
            "Functions._CEIL_($1)"
        ],
        [
            /\bCLAMP\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._CLAMP_($1, $2, $3)"
        ],
        [
            /\bFLOOR\b\s*\(([^\)]+)\)/gi,
            "Functions._FLOOR_($1)"
        ],
        [
            /\bINPUT\b\s*\(([^\)]+)\)/gi,
            "Functions._INPUT_.call(this, $1)"
        ],
        [
            /\bINT\b\s*\(([^\)]+)\)/gi,
            "Functions._INT_($1)"
        ],
        [
            /\bMAX\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._MAX_($1, $2)"
        ],
        [
            /\bMIN\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._MIN_($1, $2)"
        ],
        [
            /\bXRANDOM\b\s*\(([^\)]+)\)/gi,
            "Functions._XRANDOM_($1)"
        ],
        [
            /\bRANDOM\b\s*\(\s*(.+?)\s*\,\s*(.+?)\s*\)/gi,
            "Functions._RANDOM_($1, $2)"
        ],
        [
            /\bROUND\b\s*\(([^\)]+)\)/gi,
            "Functions._ROUND_($1)"
        ],
        [
            /\bFPS\b\s*\(([^\)]+)\)/gi,
            "Functions._FPS_($1)"
        ],
        [
            /\bLEN\b\s*\(([^\)]+)\)/gi,
            "Functions._LEN_($1)"
        ],
        [
            /\bABS\b\s*\(([^\)]+)\)/gi,
            "Functions._ABS_($1)"
        ],
        [
            /\bSUM\b\s*\(([^\)]+)\)/gi,
            "Functions._SUM_($1)"
        ]
    ]
    
    static _TRUE_()
    {
        return true
    }
    
    static _FALSE_()
    {
        return false
    }
    
    static _NULL_()
    {
        return null
    }
    
    static _WIDTH_()
    {
        return this.root.canvas.width
    }
    
    static _HEIGHT_()
    {
        return this.root.canvas.height
    }
    
    static _INT_(x)
    {
        return parseInt(x)
    }
    
    static _ROUND_(x)
    {
        return Math.round(x)
    }
    
    static _FLOOR_(x)
    {
        return Math.floor(x)
    }
    
    static _CEIL_(x)
    {
        return Math.ceil(x)
    }
    
    static _XRANDOM_(minmax)
    {
        let r = Functions._RANDOM_(-minmax + 1, minmax)
        if (r <= 0)
            r--
        return r
    }
    
    static _RANDOM_(min, max)
    {
        return min + Math.floor(Math.random() * (max - min + 1))
    }
    
    static _MIN_(a, b)
    {
        return Math.min(a, b)
    }
    
    static _MAX_(a, b)
    {
        return Math.max(a, b)
    }
    
    static _CLAMP_(x, a, b)
    {
        return Math.min(Math.max(x, a), b)
    }
    
    static _INPUT_(key)
    {
        return this.root.input.has(key)
    }
    
    static _FPS_dt_ = []
    static _FPS_(dt)
    {
        Functions._FPS_dt_.unshift(dt)
        while (Functions._FPS_dt_.length > 200)
            Functions._FPS_dt_.pop()
        
        let avg = 0
        for (const a of Functions._FPS_dt_)
            avg += a
        avg /= Functions._FPS_dt_.length
        
        const fps = (avg ? Math.round(10000 / avg) / 10 : 0).toFixed(1)
        const _dt = (Math.round(avg * 100) / 100).toFixed(2)
        return `${fps} (${_dt})`
    }
    
    static _LEN_(x)
    {
        return x.length ?? 0
    }
    
    static _ABS_(x)
    {
        return Math.abs(x)
    }
    
    static _SUM_(array)
    {
        return array.reduce((a, b) => a + b)
    }
}