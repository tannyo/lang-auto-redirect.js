# Redirect users to a pre-translated website based on the user's language settings.

Automatically redirect a user to a different language page than your default language based on the user's language settings in their browser.

## Usage

    <script src="path/to/lang-auto-redirect.js"></script>

## Configuration

### Language Support

There are two methods to tell the code which languages you support.

1. You can modify the supportedLangCodes object. The format is:

        supportedLangCodes = {
          "enus": {supported: true},
          "esmx": {supported: true},
          "ptbr": {supported: true},
          "zhcn": {supported: true}
        }

2. Or include the languages you support with link elements that have a hreflang attribute for each language. It is good practice to include hreflang links on your pages. It helps search engines give language specific content for search.

        <link rel="alternate" href="/how.html" hreflang="en-us">
        <link rel="alternate" href="/esmx/how.html" hreflang="es-mx">
        <link rel="alternate" href="/zhcn/how.html" hreflang="zh-cn">
        <link rel="alternate" href="/ptbr/how.html" hreflang="pt-br">
        <link rel="alternate" href="/hiin/how.html" hreflang="hi-in">

### options Object

    options = {
      defaultLangCode: "enus",
      supportedLangCodes: {},
      keepCookie: false,
      removeDashes: true,
      useLangFolder: false,
      langCookieName: "lang_code"
    }

#### defaultLangCode

This is the default language of your website. In this case, English United States

#### supportedLangCodes

Optional if you use links with an hreflang attribute. Otherwise fill in as above.

#### keepCookie

If true, the code will not remove a previously saved language code cookie if it is no longer supported by your website. If the default of false, it will remove the cookie and replace it with the default or calculated cookie.

#### removeDashes

Removes dashes (-) from the `navigator.language` property. This affects the format of you language directory names if using the supportedLangCodes options object.

#### useLangFolder

Set to true if using the supportedLangCodes. It will check the current directory your browser is pointing and not change the location if it is the same as the saved language code.

If set to false the code will calculate the location and if the location is different from the current location, it will change the location.

I leave this property false.

#### langCookieName

The name of the cookie that is saved with the language code. Default is `"lang_code"`.

## Directory Structure

If you use the `supportedLangCodes` object, the code assumes that your directory structure is http://www.yoursite.com/language_code/ format. Your directory structure may look like:

    /            Root default language.
      /esmx/     Spanish for Mexico.
      /hiin/     Hindi for India.
      /ptbr/     Portuguese for Brazil.
      /zhcn/     Simplified Chinese for China.

If you want your directories to include dashes as "es-us", change `removeDashes` to `false`.

    removeDashes: false,

If you use links with an hreflang attribute, you can use whatever directory structure you want to implement, since it is the href attribute of the link that determines the location of the page.

## Manually Set the Language

In your code set the `lang_code` cookie to the language value when you change to a different language page. I use the following jQuery code in my country drop down menu.

    $(".country-menu").find("a").click(function (event) {
      // Put the path parts in an array.
      // Get rid of the first path and return the file path.
      // with the href in front.
      // "/how.html" going to the /esmx/ directory would return
      // "/esmx/how.html".
      var la = location.pathname.split('/'),
        url = this.href + la.slice(la.length - 1).join('/'),
        langCode = $(this).attr("href").replace(/\//g, "");

      event.preventDefault();
      langCode = langCode || "enus";
      cookie.set("lang_code", langCode, 365);
      location.href = url;
    });

## Notes

The code sets a cookie with the language and country code in a cookie named `lang_code`. This helps the user when they come back to your website if their browser is not setup for their preferred language and they select a different language from your language link, drop down, or page.

## Issues

Have a bug? Please create an [issue](https://github.com/tannyo/lang-auto-redirect.js/issues) here on GitHub!

## Contributing

Want to contribute? Great! Just fork the project, make your changes and open a [pull request](https://github.com/tannyo/lang-auto-redirect.js/pulls).

## Changelog
* v0.10 2014-10-09 TKO Created by Tanny O'Haley
* v0.11 2014-10-10 TKO Added configurable language code cookie name support.

## License

The MIT License (MIT)

Copyright (c) 2014 [Tanny O'Haley](http://tanny.ica.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
