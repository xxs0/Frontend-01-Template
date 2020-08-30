```js
function convertNumberToString() {

}

function convertNumberToString(number, radix = 10) {
  let integer = Math.floor(number);
  let decimal = String(number).match(/\.\d+$/);
  decimal ? (decimal = decimal[0].replace('.', '')) : '';
  let string = '';
  while (integer > 0) {
    string = String(integer % radix) + string;
    integer = Math.floor(integer / radix);
  }
  return decimal ? `${string}.${decimal}` : string;
}
```