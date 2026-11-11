# Leonna's Travel Blog

A map-first editorial travel journal that begins with Auckland stories and is designed to grow into a moderated creator platform.

## Requirements

- Node.js `22.12.0` through the latest Node 22 release
- npm 10 or later

## Local commands

```sh
npm install
npm run dev
```

The public preview opens at `http://127.0.0.1:4321`.

Run the complete foundation verification with:

```sh
npm run verify
```

Individual checks are available through `npm run format`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, and `npm run test:e2e`.

## Public and owner-only boundaries

- `src/` and `public/` produce the static, read-only public site.
- `tools/studio/` is reserved for the localhost-only owner authoring studio. It must not be imported by public application code or copied into `dist/`.
- `blog_assets/` contains original source media. It is ignored by Git; optimized derivatives will be added to the public site in Task 07.
- There are no public write endpoints, login pages, or signup pages in the first release.

See [`.agent/instructions/START_HERE.md`](.agent/instructions/START_HERE.md) before continuing implementation.
