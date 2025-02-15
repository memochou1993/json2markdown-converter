# JSON2Markdown Converter

JSON2Markdown Converter is designed to convert JSON data into Markdown, making it especially useful for providing a quick overview or for non-developers to read.

# Demo

[JSON2Markdown Converter](https://memochou1993.github.io/json2markdown-converter/)

# How It Works

The conversion process begins by using the [json2markdown](https://github.com/memochou1993/json2markdown) package to parse the JSON data into Markdown, followed by using [markdown2html](https://github.com/memochou1993/markdown2html) to convert the Markdown into sanitized HTML.

In this process:

- Objects are converted into headings and content.
- Arrays are converted into lists.
- Arrays of objects are converted into tables.
- Markdown content is preserved.
- HTML content is sanitized.

The following shows how different types of JSON data appear after being converted into Markdown.

# Examples

## JSON Object

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

Hello, World!

## JSON Array

- ♈ Aries
- ♉ Taurus
- ♊ Gemini
- ♋ Cancer
- ♌ Leo
- ♍ Virgo
- ♎ Libra
- ♏ Scorpius
- ♐ Sagittarius
- ♑ Capricorn
- ♒ Aquarius
- ♓ Pisces

## JSON Array of Objects

| Symbol | Name | Description | See Also | Metadata |
| --- | --- | --- | --- | --- |
| 🌑 | New Moon | A new moon, the first of the eight phases of the moon. | 🌘, 🌒 | <pre><code>{<br>  "codepoints": "U+1F311",<br>  "shortcodes": [<br>    ":new_moon:"<br>  ]<br>}</code></pre> |
| 🌒 | Waxing Crescent Moon | A waxing crescent moon, the second of the eight phases of the moon. | 🌑, 🌓 | <pre><code>{<br>  "codepoints": "U+1F312",<br>  "shortcodes": [<br>    ":waxing_crescent_moon:"<br>  ]<br>}</code></pre> |
| 🌓 | First Quarter Moon | A first quarter moon, the third of the eight phases of the moon. | 🌒, 🌔 | <pre><code>{<br>  "codepoints": "U+1F313",<br>  "shortcodes": [<br>    ":first_quarter_moon:"<br>  ]<br>}</code></pre> |
| 🌔 | Waxing Gibbous Moon | A waxing gibbous moon, the fourth of the eight phases of the moon. | 🌓, 🌕 | <pre><code>{<br>  "codepoints": "U+1F314",<br>  "shortcodes": [<br>    ":waxing_gibbous_moon:"<br>  ]<br>}</code></pre> |
| 🌕 | Full Moon | A full moon, the fifth of the eight phases of the moon. | 🌔, 🌖 | <pre><code>{<br>  "codepoints": "U+1F315",<br>  "shortcodes": [<br>    ":full_moon:"<br>  ]<br>}</code></pre> |
| 🌖 | Waning Gibbous Moon | A waning gibbous moon, the sixth of the eight phases of the moon. | 🌕, 🌗 | <pre><code>{<br>  "codepoints": "U+1F316",<br>  "shortcodes": [<br>    ":waning_gibbous_moon:"<br>  ]<br>}</code></pre> |
| 🌗 | Last Quarter Moon | A last quarter moon, the seventh of the eight phases of the moon. | 🌖, 🌘 | <pre><code>{<br>  "codepoints": "U+1F317",<br>  "shortcodes": [<br>    ":last_quarter_moon:"<br>  ]<br>}</code></pre> |
| 🌘 | Waning Crescent Moon | A waning crescent moon, the eighth of the eight phases of the moon. | 🌗, 🌑 | <pre><code>{<br>  "codepoints": "U+1F318",<br>  "shortcodes": [<br>    ":waning_crescent_moon:"<br>  ]<br>}</code></pre> |

## Markdown Code Block

```js
import { Converter as JsonToMarkdownConverter } from '@memochou1993/json2markdown';
import { Converter as MarkdownToHtmlConverter } from '@memochou1993/markdown2html';

const markdown = JsonToMarkdownConverter.toMarkdown({
  status: '😤',
});

const html = MarkdownToHtmlConverter.toHTML(markdown);

console.log(html);

// Output:
// <h1>status</h1>
// <p>😤</p>
```

## Markdown Image

![Logo](https://memochou1993.github.io/json2markdown-converter/logo.svg)

## HTML Link

<a onmouseover="alert('XSS Attack will be ineffective!')" target="_blank" href="https://github.com/memochou1993/json2markdown-converter">Visit GitHub</a>

# License

[MIT](https://github.com/memochou1993/json2markdown-converter/blob/main/LICENSE)
