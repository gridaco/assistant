# Figma file checksum

## Why do we need this?

There are two ways to access figma files.

1. via plugin api (assistant)
2. via http rest api (on other backend services)

Grida uses both way to retreive, manage figma design.
Since figma plugin api does not provide [filekey](https://www.figma.com/plugin-docs/api/figma/#filekey)(file id) for public plugins, we have to explicitly get input from user indicating the figma file id (which is both included in share link & node link.). after we do this, we have to save this file id on localstorage (pluginstorage) for later use cases. after user authenticates rather using assistant or other grida service, we'll ask user to authenticate figma oauth (so we can access it via http api), after we do this, we can now use saved file id as checksum and if the id can be trusted.

Id is essential to keep track of design's version and changes.

There is a open issue related to this issue. - [here (figma/plugin-typings#13)](https://github.com/figma/plugin-typings/issues/13)

## References

- https://www.figma.com/plugin-docs/api/figma/#filekey
