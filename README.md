# The Mechanical Toy Archive

A catalogue website for an antique tin and battery-toy collection. Built with Next.js (App Router) + TypeScript + Tailwind.

## Data source

The site is generated from a single source of truth: `data/source/collection.xlsx`, with three sheets:

- `brinquedos` — the toys
- `livros` — the reference book library
- `fabricantes` — the manufacturers

Photos live in `data/source/images/`, named by the Photo ID columns in the spreadsheet (e.g. `PB190383.jpg`).

### Updating the data

1. Replace `data/source/collection.xlsx` with the latest export.
2. Replace/add files in `data/source/images/`.
3. Run `npm run ingest` (also runs automatically before `npm run dev` / `npm run build`).

This regenerates `src/data/generated/*.json`, which the app reads at build/render time.

## Stats section

`/stats` is password-protected via a `STATS_PASSWORD` environment variable, checked in `src/proxy.ts`. Set it in `.env.local` (see `.env.example`) or as a Vercel environment variable. Cost/value figures only ever render inside this section.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy on [Vercel](https://vercel.com/new). Set `STATS_PASSWORD` as an environment variable in the project settings.
