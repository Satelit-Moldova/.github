<!-- Built by scripts/build.mjs from scripts/README.tpl.md. Edit the template, not this file. -->

<a href="https://developer.satelit.md/en/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="{{A}}/banner-dark.svg?v={{V}}">
    <img alt="Satelit: Moldova's data in one API" src="{{A}}/banner-light.svg?v={{V}}" width="100%">
  </picture>
</a>

<p align="center">
  <a href="https://developer.satelit.md/en/docs/"><b>Docs</b></a> &nbsp;·&nbsp;
  <a href="https://developer.satelit.md/en/reference/"><b>API reference</b></a> &nbsp;·&nbsp;
  <a href="https://developer.satelit.md/en/pricing/"><b>Pricing</b></a> &nbsp;·&nbsp;
  <a href="https://developer.satelit.md/en/console/"><b>Get a key</b></a> &nbsp;·&nbsp;
  <a href="https://developer.satelit.md/en/mcp/"><b>MCP for AI assistants</b></a> &nbsp;·&nbsp;
  <a href="https://developer.satelit.md/en/sdks-plugins/"><b>All SDKs and plugins</b></a>
</p>

Moldova publishes its data in a hundred places, in a hundred formats. Satelit reads them every day and gives you one API. Prices from {{SHOPS}} online shops, BNM exchange rates, fuel prices from {{FUEL}} networks, court hearings, the company register, laws back to 1961, news, cinemas and films. One key, clean JSON, four languages.

<a href="https://developer.satelit.md/en/data/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="{{A}}/today-dark.svg?v={{V}}">
    <img alt="Moldova today: BNM rates, fuel price caps, price of the day and new laws" src="{{A}}/today-light.svg?v={{V}}" width="100%">
  </picture>
</a>

<sub>This card refreshes itself every few hours from the live API. So do the numbers below.</sub>

## Try it in ten seconds

<a href="https://github.com/Satelit-Moldova/satelit-go">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="{{A}}/terminal-dark.svg?v={{V}}">
    <img alt="satelit rates in a terminal" src="{{A}}/terminal-light.svg?v={{V}}" width="49%" align="right">
  </picture>
</a>

No key needed for a first look:

```bash
curl https://api.satelit.md/v1/sample
```

With a key from the [console](https://developer.satelit.md/en/console/):

```js
import { Satelit } from '@satelit-moldova/sdk';

const satelit = new Satelit({ apiKey: process.env.SATELIT_API_KEY });
const { data } = await satelit.rates.list();
```

Every answer tells you what it cost and what is left, in the `X-Credits-*` headers.

<br clear="right">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="{{A}}/numbers-dark.svg?v={{V}}">
  <img alt="What the API holds, counted every hour" src="{{A}}/numbers-light.svg?v={{V}}" width="100%">
</picture>

## SDKs

{{CARDS:satelit-js,satelit-python,satelit-go,satelit-php}}

## Plugins for the sites Moldova already runs on

Most Moldovan shops, city halls, schools and newsrooms run on WordPress, OpenCart, PrestaShop, Joomla or Drupal. Each plugin installs from the admin panel, keeps the key on the server and caches every answer.

{{CARDS:satelit-wordpress,satelit-opencart,satelit-prestashop,satelit-joomla,satelit-drupal}}

## Ready to run

{{CARDS:satelit-cinema,satelit-widgets,satelit-examples}}

## Why teams pick it

- Every repository here ran against the live API before it was published. The versions it was tested on are in its README.
- Most calls cost 1 to 5 credits, and the plugins cache answers. A busy site spends little.
- Keys never reach a browser. Every answer names its sources and carries the attribution each source asks for.
- Add `?lang=ro`, `ru`, `en` or `uk` to any call and the labels come back in that language.

## Pe scurt

Satelit adună datele publice ale Moldovei într-un singur API: prețuri din magazine, cursul BNM, carburanți, instanțe, companii, legi, știri, cinematografe. Aici găsiți SDK-uri pentru JavaScript, Python, Go și PHP, pluginuri pentru WordPress, OpenCart, PrestaShop, Joomla și Drupal, un site de cinema gata făcut și exemple. Cheia se face în [consolă](https://developer.satelit.md/ro/consola/). Întrebări: contact@satelit.md.

<sub>MIT licence for all code here. Data terms per source: [licence](https://developer.satelit.md/en/licence/). Security reports: contact@satelit.md.</sub>
