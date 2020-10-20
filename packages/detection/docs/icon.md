# Icon detection

**size**
- [must] be smaller than 80px
- [score] is 24 + n * 2 ~ 80  px (pixel is in form of multiple of 2)

**structure**
- [must] be frame or group perfect square
- [must] be grouped
- [must] have no text in frame
- [score] has single group in frame
- [score] vector complexity score
  - [score] vector count more than 5
  - [score] vector complexity (?) -- cannot calculate
- [score] is instance or component

**spacing**
- [score] has 1 or more px margin on each side
- [score] is vector

**naming**
- [is] following reflect icon [naming convention](https://www.notion.so/bridgedxyz/icon-naming-convention-7852e9590b064d509dc097f7580dc4c5)
- [is] marked as icon by designer


## Responsive
TBD - currently based on mobile device