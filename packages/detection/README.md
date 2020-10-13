# Rule based detection TS implementation for figma platform.

## Rule based Icons detection


** size **
- [must] be smaller than 80px
- [score] is 24 + n * 2 ~ 80  px (pixel is in form of multiple of 2)

** structure **
- [must] be frame or group perfect square
- [must] be grouped
- [must] have no text in frame
- [score] has single group in frame
- [score] is instance or component

** spacing **
- [score] has 1 or more px margin on each side
- [score] is vector

** naming **
- [is] has "mdi" or "icon" or "ico" or "icons/" in the name

- [is] marked as icon by designer


## Rule based button detection
- [must] have single text (single label slot)
- [must] have none or one icon in slot
- [is] button's properties are named after slot
- [is] marked as button by designer
- [score] is instance or component
- [score] is clickable by prototyping


## Rule based input detection
- [is] marked as input by designer
- [score] is instance or component