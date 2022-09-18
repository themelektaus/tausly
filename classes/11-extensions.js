String.prototype.toCondition = function()
{
    let x = this
    x = x.replaceAll("==", "=")
    x = x.replaceAll("==", "=")
    x = x.replaceAll("=", "==")
    x = x.replaceAll(">==", ">=")
    x = x.replaceAll("<==", "<=")
    x = x.replaceAll("!==", "!=")
    x = x.replaceAll("<>", "!=")
    
    x = x.replaceAll(new RegExp("\\bAND\\b", "gi"), "&&")
    x = x.replaceAll(new RegExp("\\bOR\\b", "gi"), "||")
    
    return x
}
    
String.prototype.matchKeyword = function(keyword, argumentCount)
{
    argumentCount ??= 0
    
    let pattern = "^" + keyword
    
    for (let i = 0; i < argumentCount; i++)
    {
        if (i == 0)
            pattern += "\\s+(.+?)"
        else
            pattern += "\\s*\\,\\s*(.+?)"
    }
    pattern += "$"
    
    const regex = new RegExp(pattern, "i")
    const matches = this.match(regex)
    
    return matches
}