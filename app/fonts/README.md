# Fonts

`GoogleSansFlex-latin.woff2` is the latin subset of the Google Sans Flex
variable font, fetched from Google Fonts:

- Family: https://fonts.google.com/specimen/Google+Sans+Flex
- Source CSS: `https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght,wdth@6..144,1..1000,25..151`

It is loaded with `next/font/local` rather than `next/font/google` on purpose:
Google Sans Flex is missing from Next's `capsize-font-metrics.json`, so
`next/font/google` cannot compute a `size-adjust` fallback and logs

```
Failed to find font override values for font `Google Sans Flex` — Skipping generating a fallback font.
```

`next/font/local` derives the fallback metrics from the font file itself, which
removes the warning and keeps the layout-shift optimisation.

The file is a variable font — `wght` (100–1000), `wdth` (25–151) and `opsz`
(6–144) are all settable via `font-variation-settings`.
