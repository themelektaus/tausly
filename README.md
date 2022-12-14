# Tausly

**Tausly** is a sequential programming language and interpreter written in `JavaScript`.



## Features

- **Simplicity** | You just need some basic knowledge of writing code - That's it!
- **Game Loop** | The main reason for the existence of this project is
                  [LD 51](https://ldjam.com/events/ludum-dare/51)
                  where I made the game
                  [Time Invaders](https://ldjam.com/events/ludum-dare/51/time-invaders).
- **No dependencies** | Everything is written in Vanilla Javascript.
- **Like BASIC** | Yes, it is a feature.



## Demo
- Visit the
  [Editor](https://steinalt.online/tausly/editor#tetris)
  to see the current version in action.
- There is also a minimalistic
  [index.html](https://steinalt.online/tausly)



## Quick Start

Just intergrate
[tausly.js](https://raw.githubusercontent.com/themelektaus/tausly/master/tausly.js)
in your `head` section of your page:
```html
<script src="tausly.js"></script>
```
After that you can run Tausly by just running following script:
```html
<script>
  const tausly = new Tausly
  tausly.run(`ECHO "Hello, World!"`)
</script>
```
Then you should see the output of `ECHO` in the browser's developer console.

If you want to use a `canvas` try following snippet:
```html
<canvas width="400" height="300"></canvas>
<script>
  const tausly = new Tausly
  tausly.run(`COLOR "green" : FILL`)
</script>
```
You also can specify the destination canvas by using a selector:
```html
<canvas id="my-canvas" width="400" height="300"></canvas>
<script>
  const tausly = new Tausly("#my-canvas")
  tausly.run(`COLOR "purple" : FILL`)
</script>
```



## Development

### Quick Edit
Tausly is a single file called
[tausly.js](https://raw.githubusercontent.com/themelektaus/tausly/master/tausly.js).
Just edit it for your needs. The complete interpreter is mainly divided into classes.
It includes only one section called
[11-extensions.js](https://github.com/themelektaus/tausly/blob/master/classes/11-extensions.js)
which extends some base objects of JavaScript.

### Build
To build your own *tausly.js* just merge all the *.js-files inside of
[/classes](https://github.com/themelektaus/tausly/tree/master/classes)
alphabetically into one file. I my case I am using
[build.php](https://github.com/themelektaus/tausly/blob/master/scripts/build.php)
to generate
[tausly.js](https://raw.githubusercontent.com/themelektaus/tausly/master/tausly.js).



## Windows

You can execute Tausly code via a windows application called **Tausly Player**.
It is a ~7MB executable which registers as a default application for `.tausly`-files.
So you can run Tausly Code without needing your web browser.<br>Give it a try ????
- Windows (x64) | https://github.com/themelektaus/tausly-player/releases
- GitHub | https://github.com/themelektaus/tausly-player



## Visual Studio Code Extension

There is also a VS Code Extension released for syntax highlighting:
- Marketplace | https://marketplace.visualstudio.com/items?itemName=tausi.tausly-lang
- GitHub | https://github.com/themelektaus/tausly-lang



## Examples

You can find some examples at
[/editor/code](https://github.com/themelektaus/tausly/tree/master/editor/code).
It's a temporary replacement for the documentation at the moment.

![](https://raw.githubusercontent.com/themelektaus/tausly/master/screenshots/screenshot-001.png)



## Limitations

There are of course a few limitations, some of which are intentional:
- `DIM` only can have a maximum of 3 dimensions
- Importing external resources like *Graphics* or *Sounds* are not possible.
  You have to code everything by yourself by using
  `SPRITE`, `SONG`, `INSTRUMENT`, and so on...
  But there are some tools like **Image to Tausly**
- `GOSUB` is not able to `RETURN` if `GOTO`
  is called in the meantime.
- No WebGL



# Reference



## Interpreter

```javascript
const code = ""
const tausly = new Tausly
this.onResize = (width, height) => { }
this.onRefresh = () => { }
this.onEcho = data => console.log(data)
this.onRender = () => { }
this.onClear = () => { }
tausly.setSize(640, 480)
tausly.load(code)
tausly.compile()
tausly.run().then(() => { })
```



## Instructions

### ECHO *value*

Prints a value to the console output.
By default the method calls `console.log(...)`.<br>
It can be overwritten by `onEcho`.

#### Parameters
- `value` Value of any type

#### Example
```
ECHO "Hello, World!"
```

<details><summary>Output</summary>
<p>

```
> Hello, World!
```

</p>
</details>

---

### LOG *value*
Like `ECHO` but is ignores the `onEcho` override.
Typically used for debugging.

#### Parameters
- `value` Value of any type

#### Example
```
LOG "Hello, Developer!"
```

<details><summary>Output</summary>
<p>

```
> Hello, Developer!
```

</p>
</details>

---

### SLEEP *ms*
Freezes the entier runtime for a specified amount of time

#### Parameters
- `ms` Time in milliseconds

#### Example
```
SLEEP 3000
```

---

### INIT *variableName* [ = *defaultValue* ]
Initializes a new variable.

#### Parameters
- `variableName` Name of the variable
- `defaultValue` (Optional) Sets a default value. If the variable already this has no effect.

#### Example
```
INIT x = 42
ECHO x

INIT x = 69
ECHO x
```

---

### *variableName* = *value*
Sets a value of a variable. It **throws an exception** if the variable is **not initalized**.

#### Parameters
- `variableName` Name of the variable
- `value` Value of any type

#### Example
```
INIT x
x = 1337
ECHO x
```

<details><summary>Output</summary>
<p>

```
> 1337
```

</p>
</details>

---

### SET *variableName* = *value*
Sets a value of a variable. If the variable not exists it will be automatically initialized.<br>
In a nutshell, it's a shorthand for `INIT x : x = 420`

#### Parameters
- `variableName` Name of the variable
- `value` Value of any type

#### Example
```
SET x = 420
ECHO x
```

<details><summary>Output</summary>
<p>

```
> 420
```

</p>
</details>

---

### GOTO *label*
Jumps to the row with the specified label.

#### Parameters
- `label` Name of a label without surrounding quotes

#### Examples
**Labels** can be written by a leading `*` or trailing `:`
```
MyLabel:
 Do some stuff...
```
They also can have whitespaces or special characters.
```
GOTO Where am I?
ECHO "I am not gonna be printed."

* Where am I?
ECHO "I am here."
```

<details><summary>Output</summary>
<p>

```
> I am here.
```

</p>
</details>

---

### GOSUB *label*
Jumps to the row with the specified label and
jumps back to row where it is coming from if `RETURN` was called.

#### Parameters
- `label` Name of a label without surrounding quotes

#### Examples
```
SET x = 2
GOSUB MySubroutine

SET x = 3
GOSUB MySubroutine

GOTO Exit

MySubroutine:
ECHO "x * x = " + (x * x)
RETURN

Exit:
ECHO "Done"
```

<details><summary>Output</summary>
<p>

```
> x * x = 4
> x * x = 9
> Done
```

</p>
</details>

It is also possible to break out of a subroutine by using `RETURN TO`.
```
GOSUB MySubroutine
GOSUB MySubroutine

BeforeExit:
ECHO "Almost done"
GOTO Exit

MySubroutine:
ECHO "Only prints once"
RETURN TO BeforeExit

Exit:
ECHO "Done"
```

<details><summary>Output</summary>
<p>

```
> Only prints once
> Almost done
> Done
```

</p>
</details>

---

### DIM(*x*) *dimName* [ = *numbers* ... ]
Initializes an 1-dimensional array with a fixed size filled with zeros.

#### Parameters
- `x` Size of the array
- `dimName` Name of the array
- `numbers` (Optional) Comma separated numbers

#### Examples
```
DIM(3) numbers
numbers(1) = 42
ECHO numbers
```

<details><summary>Output</summary>
<p>

```
> 0,42,0
```

</p>
</details>

To setup initial values, write those numbers comma separated.
```
DIM(4) numbers = 1,3,3,7
```

---

### DIM(*x*, *y*) *dimName*
Initializes an 2-dimensional array with a fixed size filled with zeros.

#### Parameters
- `x` Size of the first dimension
- `y` Size of the second dimension
- `dimName` Name of the array

#### Examples
```
DIM(3,3) tictactoe

tictactoe(2)(1) = 1

ECHO tictactoe(2)(0)
ECHO tictactoe(2)(1)
```

<details><summary>Output</summary>
<p>

```
> 0
> 1
```

</p>
</details>

---

### DIM(*x*, *y*, *z*) *dimName*
Initializes an 3-dimensional array with a fixed size filled with zeros.

#### Parameters
- `x` Size of the first dimension
- `y` Size of the second dimension
- `z` Size of the third dimension
- `dimName` Name of the array

---

### RESET *dimName*
Sets all values of an array back to `0`.

#### Parameters
- `dimName` Name of the array

#### Examples
```
DIM(3) numbers

numbers(1) = 42
ECHO numbers

RESET numbers
ECHO numbers
```

<details><summary>Output</summary>
<p>

```
> 0,42,0
> 0,0,0
```

</p>
</details>

---

### IF [NOT] *condition* [THEN] : [ELSE] : END
Checks if a condition is met.

#### Parameters
- `condition`

#### Examples
```
INIT x = RANDOM(0, 9)
ECHO x

IF x < 4
  ECHO "x is less than 4"
END

IF x = 4
  ECHO "x is equals 4"
ELSE
  ECHO "x is greater than 4"
END

ECHO "Done"
```

<details><summary>Output</summary>
<p>

```
> 7
> x is greater than 4
> Done
```

</p>
</details>

There are also some keywords to combine multiple conditions.
```
INIT x = TRUE
INIT y = FALSE

IF x AND y
  ECHO "This text won't appear"
END

IF x OR y
  ECHO "There we go!"
END
```

<details><summary>Output</summary>
<p>

```
> There we go!
```

</p>
</details>

---

### LOOP
Starts an infinite loop. It can be broken by calling `BREAK`
or by stepping out with `GOTO`.

#### Examples
```
LOOP
  IF PRESS("SPACE")
    BREAK
  END
  IF PRESS("ESCAPE")
    GOTO Exit
  END
END

Exit:
ECHO "Done"
```

There is also another keyword called `NEXT`.
You can use this to start the next run ahead of time.
```
INIT i
LOOP
  IF i < 3
    NEXT
  END
  IF i < 7
    ECHO i
  END
  IF i = 10
    BREAK
  END
  i += 1
END
```

<details><summary>Output</summary>
<p>

```
> 3
> 4
> 5
> 6
```

</p>
</details>

---

### FOR *variable* = *from* TO *to*
Starts a loop. It repeats only for a fixed amount of time.

#### Parameters
- `variable` Variable to create that has the current iteration as value
- `from` Initial value of the variable
- `to` Last value of the iteration variable

#### Example
```
FOR i = 1 TO 10
  ECHO i
END
```

<details><summary>Output</summary>
<p>

```
> 1
> 2
> 3
> 4
> 5
> 6
> 7
> 8
> 9
> 10
```

</p>
</details>

---

### WHILE [NOT] *condition*
Starts a conditional loop. It repeats as long the condition is met.

#### Parameters
- `condition`

#### Example
```
INIT i
WHILE i < 5
  ECHO i
  i += 1
END
```

<details><summary>Output</summary>
<p>

```
> 0
> 1
> 2
> 3
> 4
```

</p>
</details>

---

### BEGIN GAMELOOP [ *fps* ]
Another infinite loop but which some automatic `SLEEP` after each iteration.

#### Parameters
- `fps` (Optional) Target framerate - default value is **60**

#### Example
```
BEGIN GAMELOOP
  GOSUB Update
  GOSUB Render
END
```

---

### SMOOTHDAMP *current*, *target*, *vel*, *smoothTime*, *dt*, *maxSp*
The arguments *dt* and *maxSp* are optional.<br>
It works exactly like Unity's SmoothDamp Method<br>
- https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Mathf.cs
- https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector2.cs

---

### SIZE *x*, *y*
Change the size of the canvas.

---

### CLEAR
Clear the entier canvas. It also calls the `onClear` callback.

---

### CURSOR SHOW

---

### CURSOR HIDE

---

### COLOR *value*
Set the active color. It is used by `FILL` and `TEXT`.
```
COLOR "green"
```
```
COLOR "#00FF00"
```
```
COLOR "rgba(0, 255, 0, 1.0)"
```

---

### FILL
Fill the entier canvas by the active color.
### FILL *x*, *y*, *width*, *height*
Fill the given area by the active color.

---

### BEGIN CLIP *x*, *y*, *width*, *height*
Limit all drawcalls to an area until the `END` keyword.
```
BEGIN CLIP 10, 20, 320, 240
    COLOR "orange"
    FILL
END
```

---

### ALIGN LEFT
Align text to the left (default setting).

---

### ALIGN CENTER
Align text to the center.

---

### ALIGN RIGHT
Align text to the right.

---

### TEXT *x*, *y*, *text*
Write *text* on the canvas at the position *x* and *y*.

---

### TEXT *x*, *y*, *text*, *maxWidth*
Write *text* on the canvas at the position *x* and *y* and
take usage of word wrapping by *maxWidth*.

---

### TEXT *x*, *y*, *text*, *maxWidth*, *fullText*
It behaves the same way like above, but the word wrapping is forced to the *fullText*.

---

## Sprites
Before Sprites can be drawn they have to be defined.
A sprite is a **Block** instruction and must have a name and a nested `SIZE`.
Every `SPRITE` can have multiple frames but it needs to have at least one `FRAME`.
The `FRAME` itself is a **Block** too.
The name of it is optional.
Inside `FRAME` are finally the color and pixel informations.
```
SPRITE "Hero"
  SIZE 12, 12
  FRAME "Front"
    COLORMAP "#", "black"
    COLORMAP ".", "#FC9"
    COLORMAP "-", "#9999CC"
    PIXELMAP "    ####    "
    PIXELMAP "  ##....##  "
    PIXELMAP " #........# "
    PIXELMAP " #........# "
    PIXELMAP " #.##..##.# "
    PIXELMAP " #........# "
    PIXELMAP " #...##...# "
    PIXELMAP "  #......#  "
    PIXELMAP " #-######-# "
    PIXELMAP "#.#------#.#"
    PIXELMAP " ##--##--## "
    PIXELMAP "   ##  ##   "
  END
END
```

---

### DRAW *x*, *y*, *spriteName*
Draw the first `FRAME` of a `SPRITE`.
```
DRAW 10, 20, "Hero"
```

---

### DRAW *x*, *y*, *spriteName*, *frameIndex*
Draw a `FRAME` by index of a `SPRITE`.
```
DRAW 10, 20, "Hero", 0
```

---

### DRAW *x*, *y*, *spriteName*, *frameName*
Draw a `FRAME` by name of a `SPRITE`.
```
DRAW 10, 20, "Hero", "Front"
```

---

### BEGIN TRANSFORM
NORMALIZE *vector*
Normalize a `DIM(2)`.
```
DIM(2) vector
move(0) = 1
move(1) = 1
NORMALIZE vector
```

---

### TRANSLATE *x*, *y*

---

### ROTATE *deg*

---

### SCALE *value*

---

### RESET
Resets all active transformations.

---

### FUNC *name* RETURNS *expression*

---

### SONG *name*

---

### GAIN *volume*

---

### BPM *bpm*

---

### TIME SIGNATURE *n*

---

### REPEAT *bool*

---

### INSTRUMENT *name*

---

### TYPE *name*

---

### REVERB *bool*

---

### ATTACK *ms*

---

### RELEASE *ms*

---

### SHEET *notes*

---

### PLAY *song*

---

### STOP *song*

---

### SCOPE *name*

---

### WRITE *key*, *value*

---

## Constants
```
VALUE
FRAMETIME
DELTATIME
TIME
TRUE
FALSE
NULL
WIDTH
HEIGHT
FPS
MOUSEX
MOUSEY
```

## Functions
```
ROUND(x)
CEIL(x)
FLOOR(x)
CLAMP(x, min, max)
INPUT(key)
PRESS(key)
RELEASE(key)
INT(x)
MIN(a, b)
MAX(a, b)
RANDOM(min, max)
XRANDOM(minmax)
FPS(deltaTime)
LEN(x)
ABS(x)
SUM(dim)
READ(key)
READ(key, defaultValue)
LERP(a, b, t)
```

<!--
### KEYWORD *parameter* [ , *optional* ]
Description.

#### Parameters
- `parameter` Description
- `optional` (Optional) Description

#### Example
```
ECHO "Hello, World!"
```

<details><summary>Output</summary>
<p>

```
> Hello, World!
```

</p>
</details>

---
-->
