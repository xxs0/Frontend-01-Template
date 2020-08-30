
## 1. 正则表达式 ： 匹配所有Number Literal

该正则表达式参照tc39最新版ECMAScript spec关于[NumberLiteral](https://tc39.es/ecma262/#sec-literals-numeric-literals)产生式生成。

NumbericLiteral::
  - DecimalLiteral
  - DecimalBigIntegerLiteral
  - NonDecimalIntegerLiteral
  - NonDecimalIntegerLiteral BigIntLiteralSuffix


### DecimalLiteral
> DecimalIntegerLiteral . DecimalDigits<sub>opt</sub> ExponentPart<sub>opt</sub>

```js
let reg = /^(0|([1-9](\d+)?))\.(\d+)?([eE](\+|\-)?\d+)?$/
```

> . DecimalDigits ExponentPart<sub>opt</sub>

```js
let reg = /^\.\d+([eE](\+|\-)?\d+)?$/
```

> DecimalIntegerLiteral ExponentPart<sub>opt</sub>

```js
let reg = /^(0|([1-9](\d+)?))([eE](\+|\-)?\d+)?$/
```


### DecimalBigIntegerLiteral
> 0 BigIntLiteralSuffix

> NonZeroDigit DecimalDigits<sub>opt</sub> BigIntLiteralSuffix

```js
let reg = /^(0|[1-9](\d+)?)n$/
```

### NonDecimalIntegerLiteral
> BinaryIntegerLiteral

> OctalIntegerLiteral

> HexIntegerLiteral

```js
let reg = /^0(([bB][0-1]+)|([oO][0-7]+)|([xX][0-9a-fA-Z]+))$/
```

### 结果
```js
let numberRegexp = /^(0|([1-9](\d+)?))\.(\d+)?([eE](\+|\-)?\d+)?$|^\.\d+([eE](\+|\-)?\d+)?$|^(0|([1-9](\d+)?))([eE](\+|\-)?\d+)?$|^(0|[1-9](\d+)?)n$|^(0(([bB][0-1]+)|([oO][0-7]+)|([xX][0-9a-fA-Z]+)))n?$/
```


## 2. UTF-8 Encoding 函数

```js
function UTF8_Encoding(string) {
  // return new Buffer() 待写
}
```


## 3. 正则表达式，匹配所有字符串直接量，单引号和双引号

StringLiteral::
  - " DoubleStringCharacters<sub>opt</sub> "
  - ' SingleStringCharacters<sub>opt</sub> '

DoubleStringCharacter::
  - **SourceCharacter** but not one of " or \ or LineTerminator
  - <**LS**>
  - <**PS**>
  - \ EscapeSequence
  - LineContinuation

https://tc39.es/ecma262/#table-33
LineTerminator::
<LF>
<CR>
<LS>
<PS>

[^"\\\u000a\u000d\u2028\u2029]
\u2028
\u2029


\\
['"\\bfnrtv]|[^'"\\bfnrtv\dxu\u000a\u000d\u2028\u2029]
0
x[0-9a-fA-F]{2}
u[0-9a-fA-F]{4} | u(10|0)?[0-9a-fA-F]{1, 4}


EscapeSequence::
  - CharacterEscapeSequence
  - 0 [lookahead ∉ DecimalDigit]
  - HexEscapeSequence
  - UnicodeEscapeSequence
'|"|\\|\b|\f|\n|\r|\t|\v

\['"\\bfnrtv]

\\n