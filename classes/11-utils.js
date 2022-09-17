class Utils
{
    static convertToCondition(x)
    {
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
}