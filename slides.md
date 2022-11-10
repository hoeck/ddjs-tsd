---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## TSD
  Short intro into [TSD](https://github.com/SamVerschueren/tsd)
# persist drawings in exports and build
drawings:
  persist: false
# use UnoCSS
css: unocss

canvasWidth: 800
---

# **TSD**
# **T**est your type**S**, stupi**D**

<!--
- type testing - what is this?
- agenda
  - testing types manually
-->

---

# Types? Tests?

> We have tests and we have types

But do you have tests for your types?

<!--
- is there any problems with types?
- no, types are great let's use them everywhere
-->

---

# Tests

totally not made up example

```ts{0|1-3|all}
function addOne(a: number): number {
    return a + 1
}

test('adds one', () => {
    expect(addOne(1)).toEqual(2)
})
```

<!--
- please engage your fantasy
- plain and simple: function + test
- what can go still wrong?
  - (focus on the types)
-->

---

# Tests - Without Type

```ts{0|1-3|all}
function addOne(a: number | null): number {
    return a ?? 0 + 1
}

test('adds one', () => {
    expect(addOne(1)).toEqual(2)
})
```

<!--
- we change the functions type signature
- test is still green
- of course, the type signature is not part of the test
  - any idea to fix this?
  - does this even need fixing?
-->

---

# Tests - Including the Type

```ts{all|6|all}
function addOne(a: number | null): number {
    return a ?? 0 + 1
}

test('adds one', () => {
    const expectType: (a: number) => number = add

    expect(addOne(1)).toEqual(2)
})
```

<!--
- does detect our breaking change? **ask** => nooo
- why? **wait** => subtyping!
-->

---

# Excourse: Subtyping

```ts{0|1-2|1-5|1-7|all}
const addOneV0 = (a: number) =>  number
const addOneV1 = (a: number | null): number

type A = number | null
type SubTypeOfA = number

let a: A
let subTypeOfA: SubTypeOfA

a = subTypeOfA // works: number | null = number

subTypeOfA = a // noooo: number = number | null
```

<!--
- tsc only cares about assignability (remember: structural typing)
- subtyping means we can assign in one direction but not the other
-->

---

# Tests - Including the Type

```ts{0|6|all}
function addOne(a: number | null): number {
    return a ?? 0 + 1
}

test('adds one', () => {
    const expectType: (a: number) => number = add

    expect(addOne(1)).toEqual(2)
})
```

<!--
- now back to the made up test
- what to change? **wait**
-->

---

# Tests - Including the **exact** Type

```ts{0|6-7|all}
function addOne(a: number | null): number {
    return a ?? 0 + 1
}

test('adds one', () => {
    const expectType0: (a: number) => number = add
    const expectType1: typeof add = (a: number) => number

    expect(addOne(1)).toEqual(2)
})
```

<!--
- make sure the reverse assignment is also true
- that's it?
-->

---

# Tests - Recap

* we write *code* with **types**
* we test the *code*
* we test the **types**

<!--
- make sure the reverse assignment is also true
- that's it?
- now we need tooling
-->

---

# That Same Test with TSD

`npm install tsd` <small>a couple of gigabytes and some package.json configuration later</small>

```ts
import { expectAssignable, expectError, expectType } from "tsd"
import { addOne } from '../src'

expectType<(a:number) => number>(addOne)
expectError(addOne(null))
expectError(addOne(undefined))
```

```
$> node_modules/.bin/tsd

  test-d/addOne.test-d.ts:5:0
  ✖  5:0  Parameter type (a: number) => number is declared too wide for
argument type (a: number | null) => number.
  ✖  6:0  Expected an error, but found none.

  2 errors
```

<!--
- separate test command
- specific expects to work with types
  - check that expresssions generate errors
  - check for hard equalness or just assignability
- nice console reports
-->

---

# Thanks for listening

<!--
- thats it
-->

---

# Haha not yet

<div v-click>

- that example above was wa*aaa*aay to simple

</div>
<div v-click>

- real world types look more like:

```ts
// ts builtin utility
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```
</div>


<!--
- ts builtin
- ts can create new types
- aka type level programming
-->

---

# Real world type test

```
interface Todo {
    title: string
    description :string
}

declare const partial: Partial<Todo>

expectType<{title?: string, description?: string}>(partial)
```

<!--
- easy to write
- keep complex types managable
-->

---

# Real world type test 2 - modifying the Partial type

```ts
type PartialPrefix<T, P extends string> = {
  [K in keyof T as (K extends string ? `${P}${K}` : never)]?: T[K];
};
```

<!--
- hardly readable any more
-->

---

# Real world type test 2 - modifying the Partial type

```
interface Todo {
    title: string
    description :string
}

declare const partialPrefix: PartialPrefix<Todo, 'initial | final'>

expectType<{
  initial_title?: string
  final_title?: string
  initial_description?: string
  final_description?: string
}>(partialPrefix)
```

<!--
- but the test is still readable
-->

---
# Cheers

TypeFest uses TSD (much code):

https://github.com/sindresorhus/type-fest/tree/main/test-d

<!--
- typescript is an awesome ecosystem
- this support for type-level programming is huge
- maintain support for types across tsc releases
-->
