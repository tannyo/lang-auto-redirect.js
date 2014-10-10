# Redirect users to a pre-translated website based on the user's language settings.

A module that I wrote for fun that emulates Apache server side virtual include comments.

## Usage

    <script src="path/to/lang-auto-redirect.js"></script>

In your HTML file, use a comment to include a file.

    <!--#include virtual="join-us.html" -->

The HTML comment will cause the code to asynchronously get join-us.html and replace every comment element in your HTML file with the contents of join-us.html.

Each include file will be retrieved once no matter how many times the file is referenced in your HTML source code.

## Issues

Have a bug? Please create an [issue](https://github.com/tannyo/lang-auto-redirect.js/issues) here on GitHub!

## Contributing

Want to contribute? Great! Just fork the project, make your changes and open a [pull request](https://github.com/tannyo/lang-auto-redirect.js/pulls).

## Changelog
* v0.10 2014-10-09 TKO Created by Tanny O'Haley

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
