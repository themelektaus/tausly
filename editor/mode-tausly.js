define(
    
    "ace/mode/tausly_highlight_rules",
    
    [
        "require",
        "exports",
        "module",
        "ace/lib/oop",
        "ace/mode/text_highlight_rules"
    ],
    
    function(require, exports, module)
    {
        "use strict";
        
        const oop = require("../lib/oop")
        const TextHighlightRules = require("./text_highlight_rules").TextHighlightRules
        
        const TauslyHighlightRules = function()
        {
            this.$rules = {
                start: [
                    {
                        token: 'keyword.method.tausly',
                        regex: '\\b(?:ECHO|LOG|SLEEP|NORMALIZE|SMOOTHDAMP|SIZE|CLEAR|COLOR|FILL|TEXT|ALIGN\\sLEFT|ALIGN\\sCENTER|ALIGN\\sRIGHT|DIM|LABEL|INIT|SET|DIM|GAIN|BPM|TIME\\sSIGNATURE|REPEAT|TYPE|REVERB|SHEET|PLAY|STOP|RESET|DRAW|TRANSLATE|ROTATE|SCALE|ATTACK|RELEASE|CURSOR\\sSHOW|CURSOR\\sHIDE|FUNC|RETURNS|SCOPE|WRITE)\\b',
                        caseInsensitive: true
                    },
                    {
                        token: 'keyword.func.tausly',
                        regex: '\\b(?:CEIL|CLAMP|FLOOR|INPUT|PRESS|RELEASE|INT|MAX|MIN|XRANDOM|RANDOM|ROUND|FPS|LEN|ABS|FRAMETIME|SUM|READ|LERP)\\b'
                    },
                    {
                        token: 'keyword.jump.tausly',
                        regex: '\\b(?:GOTO|GOSUB|RETURN\\sTO|RETURN)\\b',
                        next: "label"
                    },
                    {
                        token: 'keyword.block.tausly',
                        regex: '\\b(?:IF|NOT|THEN|AND|OR|ELSE|END|FOR|TO|WHILE|LOOP|NEXT|BREAK|SONG|INSTRUMENT|SPRITE|FRAME|BEGIN\\sGAMELOOP|BEGIN\\sTRANSFORM|BEGIN\\sCLIP)\\b'
                    },
                    {
                        token: 'keyword.const.tausly',
                        regex: '\\b(?:DELTATIME|TIME|WIDTH|HEIGHT|TRUE|FALSE|NULL|MOUSEX|MOUSEY|VALUE)\\b'
                    },
                    {
                        token: 'punctuation.definition.string.begin.shell',
                        regex: '"',
                        push: [
                            {
                                token: 'punctuation.definition.string.end.shell',
                                regex: '"',
                                next: 'pop'
                            },
                            { defaultToken: 'string.quoted.double.tausly' }
                        ]
                    },
                    {
                        token: 'keyword.number.tausly',
                        regex: '\\b[0-9\.]+\\b'
                    },
                    {
                        token: 'keyword.label.tausly',
                        regex: /.+\:\s*$/
                    },
                    {
                        token: 'keyword.label.tausly',
                        regex: /^\s*\*.*/
                    },
                    {
                        token: 'keyword.key.tausly',
                        regex: '\\b\\_[A-Za-z0-9]+\\b'
                    },
                    {
                        token: 'keyword.operator.tausly',
                        regex: '\\s+(?:\\=|\\+|\\-|\\*|\\/|\\+\\=|\\-\\=|\\*\\=|\\/\\=|\\>\\=|\\<\\=|\\<\\>|\\>|\\<)\\s+'
                    }
                ],
                label: [
                    {
                        token: "keyword.none.tausly",
                        regex: /\s+/
                    },
                    {
                        token: "keyword.jump.label.tausly",
                        regex: /[^\r\n\:]+/
                    },
                    {
                        token: "",
                        regex: "",
                        next: "start"
                    }
                ]
            }
            
            this.normalizeRules()
        }
        
        TauslyHighlightRules.metaData = {
            name: 'Tausly',
            scopeName: 'source.tausly',
            fileTypes: [ 'tausly' ]
        }
        
        oop.inherits(TauslyHighlightRules, TextHighlightRules)
        
        exports.TauslyHighlightRules = TauslyHighlightRules
    }
)

;

define(
    
    "ace/mode/folding/cstyle",
    
    [
        "require",
        "exports",
        "module",
        "ace/lib/oop",
        "ace/range",
        "ace/mode/folding/fold_mode"
    ],
    
    function(require, exports, module)
    {
        "use strict"
        
        var oop = require("../../lib/oop");
        var Range = require("../../range").Range;
        var BaseFoldMode = require("./fold_mode").FoldMode;
        
        var FoldMode = exports.FoldMode = function(commentRegex) {
            if (commentRegex) {
                this.foldingStartMarker = new RegExp(
                    this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
                );
                this.foldingStopMarker = new RegExp(
                    this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
                );
            }
        };
        oop.inherits(FoldMode, BaseFoldMode);
        
        (function()
        {
            this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
            this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
            this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
            this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
            this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
            this._getFoldWidgetBase = this.getFoldWidget;
            this.getFoldWidget = function(session, foldStyle, row) {
                var line = session.getLine(row);
            
                if (this.singleLineBlockCommentRe.test(line)) {
                    if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                        return "";
                }
            
                var fw = this._getFoldWidgetBase(session, foldStyle, row);
            
                if (!fw && this.startRegionRe.test(line))
                    return "start"; // lineCommentRegionStart
            
                return fw;
            };
        
            this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
                var line = session.getLine(row);
                
                if (this.startRegionRe.test(line))
                    return this.getCommentRegionBlock(session, line, row);
                
                var match = line.match(this.foldingStartMarker);
                if (match) {
                    var i = match.index;
        
                    if (match[1])
                        return this.openingBracketBlock(session, match[1], row, i);
                        
                    var range = session.getCommentFoldRange(row, i + match[0].length, 1);
                    
                    if (range && !range.isMultiLine())
                    {
                        if (forceMultiline) {
                            range = this.getSectionRange(session, row);
                        } else if (foldStyle != "all")
                            range = null;
                    }
                    
                    return range;
                }
        
                if (foldStyle === "markbegin")
                    return;
        
                var match = line.match(this.foldingStopMarker);
                if (match)
                {
                    var i = match.index + match[0].length;
        
                    if (match[1])
                        return this.closingBracketBlock(session, match[1], row, i);
        
                    return session.getCommentFoldRange(row, i, -1);
                }
            };
            
            this.getSectionRange = function(session, row) {
                var line = session.getLine(row);
                var startIndent = line.search(/\S/);
                var startRow = row;
                var startColumn = line.length;
                row = row + 1;
                var endRow = row;
                var maxRow = session.getLength();
                while (++row < maxRow) {
                    line = session.getLine(row);
                    var indent = line.search(/\S/);
                    if (indent === -1)
                        continue;
                    if  (startIndent > indent)
                        break;
                    var subRange = this.getFoldWidgetRange(session, "all", row);
                    
                    if (subRange) {
                        if (subRange.start.row <= startRow) {
                            break;
                        } else if (subRange.isMultiLine()) {
                            row = subRange.end.row;
                        } else if (startIndent == indent) {
                            break;
                        }
                    }
                    endRow = row;
                }
                
                return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
            };
            
            this.getCommentRegionBlock = function(session, line, row) {
                var startColumn = line.search(/\s*$/);
                var maxRow = session.getLength();
                var startRow = row;
                
                var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
                var depth = 1;
                while (++row < maxRow) {
                    line = session.getLine(row);
                    var m = re.exec(line);
                    if (!m) continue;
                    if (m[1]) depth--;
                    else depth++;
        
                    if (!depth) break;
                }
        
                var endRow = row;
                if (endRow > startRow) {
                    return new Range(startRow, startColumn, endRow, line.length);
                }
            };
            
        }).call(FoldMode.prototype);
    }
)

;

define(
    
    "ace/mode/tausly",
    
    [
        "require",
        "exports",
        "module",
        "ace/lib/oop",
        "ace/mode/text",
        "ace/mode/tausly_highlight_rules",
        "ace/mode/folding/cstyle"
    ],
    
    function(require, exports, module)
    {
        "use strict";
        
        var oop = require("../lib/oop");
        var TextMode = require("./text").Mode;
        var TauslyHighlightRules = require("./tausly_highlight_rules").TauslyHighlightRules;
        var FoldMode = require("./folding/cstyle").FoldMode;
        
        var Mode = function() {
            this.HighlightRules = TauslyHighlightRules;
            this.foldingRules = new FoldMode();
            this.$behaviour = this.$defaultBehaviour;
        };
        oop.inherits(Mode, TextMode);
        
        (function() {
            this.lineCommentStart = "::";
            this.blockComment = "";
            this.$id = "ace/mode/tausly";
        }).call(Mode.prototype);
        
        exports.Mode = Mode;
    }
)

;

(function()
{
    window.require(
        
        [ "ace/mode/tausly" ],
        
        function (m)
        {
            if (typeof module == "object" && typeof exports == "object" && module)
                module.exports = m;
        }
    )
})()