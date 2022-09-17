class SmoothDampLine extends Line
{
    static _ = Line.classes.add(this.name)
    
    static parse(options)
    {
        let matches
        
        matches = options.code.match(/^SMOOTHDAMP\s+(.+)\s*\,\s*(.+)\s*\,\s*(.+)\s*\,\s*(.+)\s*\,\s*(.+)\s*\,\s*(.+)$/i)
        if (matches)
        {
            const line = new SmoothDampLine(options)
            line.current = matches[1]
            line.target = matches[2]
            line.currentVelocity = matches[3]
            line.getSmoothTime = matches[4]
            line.getDeltaTime = matches[5]
            line.getMaxSpeed = matches[6]
            return line
        }
        
        matches = options.code.match(/^SMOOTHDAMP\s+(.+)\s*\,\s*(.+)\s*\,\s*(.+)\s*\,\s*(.+)\s*\,\s*(.+)$/i)
        if (matches)
        {
            const line = new SmoothDampLine(options)
            line.current = matches[1]
            line.target = matches[2]
            line.currentVelocity = matches[3]
            line.getSmoothTime = matches[4]
            line.getDeltaTime = matches[5]
            line.getMaxSpeed = "undefined"
            return line
        }
        
        return null
    }
    
    compile()
    {
        this.getCurrent = this.createFunction(this.current)
        this.getTarget = this.createFunction(this.target)
        this.getCurrentVelocity = this.createFunction(this.currentVelocity)
        this.getSmoothTime = this.createFunction(this.getSmoothTime)
        this.getDeltaTime = this.createFunction(this.getDeltaTime)
        this.getMaxSpeed = this.createFunction(this.getMaxSpeed)
    }
    
    * step()
    {
        const current = this.getCurrent()
        const target = this.getTarget()
        const currentVelocity = this.getCurrentVelocity()
        
        if (target instanceof Array)
        {
            SmoothDampLine.smoothDamp2D(current, target, currentVelocity, this.getSmoothTime(), this.getDeltaTime(), this.getMaxSpeed())
            this.parent.set(this.current, current)
            this.parent.set(this.currentVelocity, currentVelocity)
            return
        }
        
        const result = SmoothDampLine.smoothDamp1D(current, target, currentVelocity, this.getSmoothTime(), this.getDeltaTime(), this.getMaxSpeed())
        this.parent.set(this.current, result[0])
        this.parent.set(this.currentVelocity, result[1])
    }
    
    static smoothDamp1D(current, target, currentVelocity, smoothTime, deltaTime, maxSpeed)
    {
        smoothTime = Math.max(0.0001, smoothTime)
        deltaTime /= 1000
        maxSpeed ??= 1e+30
        
        const omega = 2 / smoothTime
        const x = omega * deltaTime
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
        
        let change = current - target
        
        const originalTarget = target
        
        const maxChange = maxSpeed * smoothTime
        
        change = Math.min(Math.max(-maxChange, change), maxChange)
        target = current - change
        
        const temp = (currentVelocity + omega * change) * deltaTime
        
        currentVelocity = (currentVelocity - omega * temp) * exp
        
        let output = target + (change + temp) * exp
        
        return [ output, currentVelocity ]
    }
    
    static smoothDamp2D(current, target, currentVelocity, smoothTime, deltaTime, maxSpeed)
    {
        smoothTime = Math.max(0.0001, smoothTime)
        deltaTime /= 1000
        maxSpeed ??= 1e+30
        
        const omega = 2 / smoothTime
        const x = omega * deltaTime
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
        
        let changeX = current[0] - target[0]
        let changeY = current[1] - target[1]
        
        const originalTargetX = target[0]
        const originalTargetY = target[1]
        
        const maxChange = maxSpeed * smoothTime
        const maxChangeSq = maxChange * maxChange
        const sqDist = changeX * changeX + changeY * changeY
        
        if (sqDist > maxChangeSq)
        {
            const mag = Math.sqrt(sqDist);
            changeX = changeX / mag * maxChange
            changeY = changeY / mag * maxChange
        }
        
        const targetX = current[0] - changeX
        const targetY = current[1] - changeY
        
        const tempX = (currentVelocity[0] + omega * changeX) * deltaTime
        const tempY = (currentVelocity[1] + omega * changeY) * deltaTime
        
        currentVelocity[0] = (currentVelocity[0] - omega * tempX) * exp
        currentVelocity[1] = (currentVelocity[1] - omega * tempY) * exp
        
        let outputX = targetX + (changeX + tempX) * exp
        let outputY = targetY + (changeY + tempY) * exp
        
        const origMinusCurrentX = originalTargetX - current[0]
        const origMinusCurrentY = originalTargetY - current[1]
        const outMinusOrigX = outputX - originalTargetX
        const outMinusOrigY = outputY - originalTargetY
        
        if (origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY > 0)
        {
            outputX = originalTargetX
            outputY = originalTargetY
            
            currentVelocity[0] = (outputX - originalTargetX) / deltaTime
            currentVelocity[1] = (outputY - originalTargetY) / deltaTime
        }
        
        current[0] = outputX
        current[1] = outputY
    }
}