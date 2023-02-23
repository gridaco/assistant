# Component view

> A code preview widget that displays extra component's information such as storybook url, documentation url, and local code directory path, etc..

this is not customizable yet. but will engineered with extensibility.

## How it works

1. get selected layer
2. check if selected layer is a component or an instance.
3. find if data to display exists on a master component.
4. display data if exists. else, display input.

## Types of supported Component-like layers

> Components types may vary by design tools (the abstraction is based on figma platform. (since it is most advanced at the this point))

- **master-component** (component that is as master)
- **instance-component** (instance component that is from master-component (not from variant-set) )
- **base-master-component** (temporarily exceptional) (master component that is used for making a managed variant-set - this is because at the time of the development, figma does not support a smart way to manage a base component like it can be represneted via code.)
- **variant-set**
- **variant-instance-component**
- **variant-master-component**
