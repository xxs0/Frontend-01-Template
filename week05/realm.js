// source: https://tc39.es/ecma262/#sec-global-object
let gloablProperties = [
  // 'globalThis',
  // 'Infinity',
  // 'NaN',
  // 'undefined',
  'eval',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Array',
  'ArrayBuffer',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Map',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'URIError',
  'WeakMap',
  'WeakSet',
  'Atomics',
  'JSON',
  'Math',
  'Reflect',
];
let set = new Set(), queue = [];

for (let e of gloablProperties) {
  queue.push({
    path: [e],
    object: this[e]
  })
}

console.log(queue);


let current, arr = []

while(queue.length) {
  current = queue.shift();
  if (set.has(current.object)) {
    continue;
  }
  set.add(current.object);
  arr.push(current)

  for (let p of Object.getOwnPropertyNames(current.object)) {
    let property = Object.getOwnPropertyDescriptor(current.object, p);

    if (property.hasOwnProperty('value') &&
    (property.value !== null && (typeof property.value === 'object' || typeof property.value === 'function')
    && property.value instanceof Object)) {
      queue.push({
        path: current.path.concat([p]),
        object: property.value
      })
    }

    if (property.hasOwnProperty('get') && typeof property.get === 'function') {
      queue.push({
        path: current.path.concat([p]),
        object: property.get
      })
    }

    if (property.hasOwnProperty('set') && typeof property.set === 'function') {
      queue.push({
        path: current.path.concat([p]),
        object: property.set
      })
    }
  }
}