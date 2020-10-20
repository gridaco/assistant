# Screen Detection

## concepts
- by dedicated screen frame size
- by naming conventions
- by size ratio per screen types (mobile, tablet, desktop, and more..)

## logic
**rules**
- [must] be frame
- [is] name convention following `LSC002` "Screen name following correct naming convention" (screen size available at [screen-sizes](https://github.com/bridgedxyz/screen-sizes))
- [score] one of screen layout is detected (detect with external [context machine](https://github.com/bridgedxyz/context))


## Devices & Minimum Ratio (2020-2021)
**App**
1:1 ~ 1:10

**Web**
1:1 ~ 1:30


## Rule Spec (not fully implemented yet)
``` ts
<DetectionRule>{
    minHeight: 500,
    minWidth: 300,
    maxWidth: 3000,
    mustBeRoot: true
}
```