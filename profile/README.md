# Satelit — Moldova's data in one API

Exchange rates, fuel, shop prices, news, laws, courts, companies, cinemas and films, tours, flights and more, read once and served as clean JSON from `https://api.satelit.md/v1`.

**[Docs](https://developer.satelit.md/en/docs/)** · **[API reference](https://developer.satelit.md/en/reference/)** · **[Pricing](https://developer.satelit.md/en/pricing/)** · **[Console and keys](https://developer.satelit.md/en/console/)** · **[MCP for AI assistants](https://developer.satelit.md/en/mcp/)**

```bash
curl https://api.satelit.md/v1/sample          # no key: a taste of rates, fuel, news, law and prices
curl -H "Authorization: Bearer $SATELIT_API_KEY" https://api.satelit.md/v1/rates
```

## SDKs

| Language | Repo | Install |
|---|---|---|
| JavaScript / TypeScript | [satelit-js](https://github.com/Satelit-Moldova/satelit-js) | `npm i github:Satelit-Moldova/satelit-js` |
| Python | [satelit-python](https://github.com/Satelit-Moldova/satelit-python) | `pip install git+https://github.com/Satelit-Moldova/satelit-python` |
| Go | [satelit-go](https://github.com/Satelit-Moldova/satelit-go) | `go get github.com/Satelit-Moldova/satelit-go` |
| PHP 7.2+ | [satelit-php](https://github.com/Satelit-Moldova/satelit-php) | Composer (VCS) or one `require` |

## CMS and shop plugins

| Platform | Repo | What it adds |
|---|---|---|
| WordPress + WooCommerce | [satelit-wordpress](https://github.com/Satelit-Moldova/satelit-wordpress) | Blocks and shortcodes: BNM rates, converter, fuel, prices, news, cinemas; WooCommerce market prices |
| OpenCart 3 and 4 | [satelit-opencart](https://github.com/Satelit-Moldova/satelit-opencart) | BNM rates into store currencies, market prices on product pages |
| PrestaShop | [satelit-prestashop](https://github.com/Satelit-Moldova/satelit-prestashop) | The same for PrestaShop |
| Joomla | [satelit-joomla](https://github.com/Satelit-Moldova/satelit-joomla) | A module and inline tags |
| Drupal | [satelit-drupal](https://github.com/Satelit-Moldova/satelit-drupal) | Blocks and a settings form |

## Ready-made projects

| Repo | Use it for |
|---|---|
| [satelit-cinema](https://github.com/Satelit-Moldova/satelit-cinema) | A complete cinema-schedule and film website on the Movies API |
| [satelit-widgets](https://github.com/Satelit-Moldova/satelit-widgets) | Embeddable widgets for any site, with a key-holding proxy (Node, Cloudflare Worker, PHP) |
| [satelit-examples](https://github.com/Satelit-Moldova/satelit-examples) | Bots, alerts, digests, spreadsheets, exporters and other copy-paste use cases |

## Pe scurt

Satelit adună datele publice ale Moldovei într-un singur API. Aici găsiți SDK-uri, pluginuri pentru WordPress, OpenCart, PrestaShop, Joomla și Drupal, un site de cinema gata făcut și exemple. Cheile se fac în [consolă](https://developer.satelit.md/ro/); întrebări: contact@satelit.md.
