# Contributing to assistant figma platform

## Setting up Env vars (.env)

> In most case, you won't have to specify contents or create `figma/.env` file.

**Variables**

- `FIGMA_PERSONAL_ACCESS_TOKEN` - (Optional) For using figma developer tools.
- `BRIDGED_FIRST_PARTY_APP_TOTP_SECRET` - (Not Required) Used for communicating with bridged first party cloud services. set this as "s1v1-assistant-development". learn more at [base's security startegy](https://github.com/gridaco/base/blob/main/docs/security.md)

## Good to know - Somethings leart from mistakes

- figma's node does return property until they are referenced

## Clearing the cache

Clearing the cache to work with figma plugin api storage. on MacOS,

```sh
rm -rf "$HOME/Library/Application Support/Figma/"{Desktop,DesktopProfile}
```
