/*jslint browser: true, devel: true, plusplus: true, indent: 2 */
/*
 * Redirect users to a pre-translated website based on the user's language settings.
 * If the page contains link elements with a hreflang attribute, the code will use
 * the href attribute of the link element. Otherwise, the code depends on a
 * directory/folder structure where your main translation is in the root folder
 * and translations are in sub-directories/folders in the format of the 2 digit
 * language code and the 2 digit country code without the dash. The first 2 digits
 * are in ISO 639-1 format and second 2 digits are in ISO 3166-1 Alpha 2 format.
 *
 * ISO 639-1: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 * ISO 3166-1: http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 *
 * The sample uses "enus" (English, United States) as the default language and
 * supports:
 *  enus (English, United States):  http://www.your-site.com/
 *  esmx (Spanish, Mexico):         http://www.your-site.com/esmx/
 *  ptbr (Portuguese, Brazil):      http://www.your-site.com/ptbr/
 *  zhcn (Chinese, China):          http://www.your-site.com/zhcn/
 *
 * Notes:
 * ======
 * If link elements are not provided with a hreflang attribute, the code assumes
 * that all your default language pages are translated with the same names and set
 * options.useLangFolder to true.
 *  http://www.your-site.com/about.html
 * and
 *  http://www.your-site.com/esmx/about.html
 *
 * Unless your page has link elements with hreflang attributes, then you delete
 * the contents of the options.supportedLangCodes object as the code will fill it in for
 * you based on the link elements with an hreflang attribute.
 *
 * If you want your folder structure to include dashes, set options.removeDashes to false.
 *
 * If you have pages that do not have a translation, but want to keep the language
 * cookie, set options.keepCookie to true.
 *
 * Syntax of options.supportedLangCodes object.
 *
 *  options.supportedLangCodes = {
 *    "enus": {supported: true},
 *    "esmx": {supported: true},
 *    "ptbr": {supported: true},
 *    "zhcn": {supported: true}
 *  }
 *
 * 2014-09-29 TKO v0.10 Created by Tanny O'Haley
 * 2014-10-10 TKO v0.11 Added configurable language code cookie name support.
 *
 *
 * Wrapper function to hide auto redirect and utility functions.
 */
var autoLanguageRedirect = (function () {
  "use strict";
  /*
   * Private global variables put here to make it easy for you to edit.
   */
  var options = {
      defaultLangCode: "enus",
      supportedLangCodes: {},
      keepCookie: false,
      removeDashes: true,
      useLangFolder: false,
      langCookieName: "lang_code"
    },
    // Make jsLint happy.
    util,
    debug = true;

  /*
   * Utility methods.
   */
  util = (function () {
    /*
     * Cookie manipulation
     */
    var cookie = (function () {
      function set(name, value, days, path) {
        var date, expires;

        if (days) {
          date = new Date();
          date.setTime(date.getTime() + (days * 864E5));
          expires = "; expires=" + date.toGMTString();
        } else {
          expires = "";
        }

        if (!path) {
          path = "/";
        }

        document.cookie = name + "=" + value + expires + "; path=" + path;
      }

      function get(name) {
        var nameEQ = name + "=", ca = document.cookie.split(';'), i, c;

        for (i = 0; i < ca.length; i++) {
          c = ca[i].trim();
          if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length);
          }
        }

        return null;
      }

      function remove(name) {
        set(name, "", -1);
      }

      return {
        set: set,
        get: get,
        remove: remove
      };
    }());

    /*
     * Get the number of top level properties in an object.
     */
    function objLength(obj) {
      var count = 0, key;

      if (typeof obj === "object") {
        if (Object.keys) {
          return Object.keys(obj).length;
        }

        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            count++;
          }
        }
      }

      return count;
    }

    /*
     * Emulate jQuery extend.
     */
    function extend(out) {
      var i, key;

      out = out || {};

      for (i = 1; i < arguments.length; i++) {
        if (arguments[i]) {
          for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
              out[key] = arguments[i][key];
            }
          }
        }
      }

      return out;
    }

    return {
      cookie: cookie,
      extend: extend,
      objLength: objLength
    };
  }());


  /*
   * Auto fill the options.supportedLangCodes object from link elements with a hreflang
   * attribute.
   */
  function processHrefLangAttrs() {
    var links = document.getElementsByTagName("link"),
      i,
      link,
      hreflang,
      href,
      languages = {};

    // Walk through each of the link elements looking for a hreflang attribute.
    for (i = 0; i < links.length; i++) {
      link = links[i];
      hreflang = link.getAttribute("hreflang");
      // Is there a hreflang attribute?
      if (hreflang) {
        // Remove dash from hreflang?
        if (options.removeDashes) {
          hreflang = hreflang.replace("-", "");
        }
        // Set this as a supported language. Initialize object.
        languages[hreflang] = {supported: true};
        // Get the href.
        href = link.href;
        if (href) {
          // Add the href to the list of hrefs by language code.
          languages[hreflang].href = href;
        }
      }
    }

    // Check to make sure your default language is in the list. If not, add it.
    if (!languages[options.defaultLangCode]) {
      languages[options.defaultLangCode] = {supported: true};
    }

    if (debug) {
      // Display alternate language urls. Remove for production.
      for (i in languages) {
        if (languages.hasOwnProperty(i)) {
          console.log("language/country code:", i, "href:", languages[i].href);
        }
      }
    }

    return languages;
  }

  /*
   * Auto redirect based on the language and country of the browser.
   */
  function languageRedirect() {
    var la = location.pathname.split('/'), // array of items in the pathname.
      langCode = (navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "en-US").toLowerCase(),
      langFolder = (la.length > 2 ? la[1] : options.defaultLangCode),
      page = la[la.length - 1],
      savedLangCode = util.cookie.get(options.langCookieName),
      href,
      // Support IE for location.origin.
      origin = location.origin || location.protocol + "//" + location.host;

    if (options.removeDashes) {
      langCode = langCode.replace("-", "");
    }

    if (debug) {
      console.log("langCode:", langCode);
      console.log("savedLangCode:", savedLangCode);
    }

    // If the language code cookie has not been saved, save the cookie if it is a
    // supported language.
    if (!savedLangCode) {
      // Is it a supported language?
      if (options.supportedLangCodes[langCode]) {
        util.cookie.set(options.langCookieName, langCode, 365);
        savedLangCode = langCode;
      } else {
        // The language code is NOT supported by this site, do not process auto redirect.
        return;
      }
    }

    // If the language code is no longer supported, redirect the user to the default language.
    if (!options.supportedLangCodes[savedLangCode].supported) {
      if (!options.keepCookie) {
        util.cookie.remove(options.langCookieName);
      }

      savedLangCode = options.defaultLangCode;
    }

    // If the saved language code is equal to the current language folder,
    // redirecting is not required.
    if (options.useLangFolder && savedLangCode === langFolder) {
      return;
    }

    if (options.supportedLangCodes[savedLangCode].href) {
      href = options.supportedLangCodes[savedLangCode].href;
    } else if (savedLangCode === options.defaultLangCode) {
      href = origin + "/" + page;
    } else {
      href = origin + "/" + savedLangCode + "/" + page;
    }

    if (debug) {
      console.log("href:", href);
    }

    // If we are already on the page, exit to prevent an infinite loop.
    if (href === location.href) {
      return;
    }

    location.href = href;
  }

  function run(optionChanges) {
    options = util.extend({}, options, optionChanges);

    // If there are no entries, get the data from the hreflang attribute of link elements.
    if (!util.objLength(options.supportedLangCodes)) {
      options.supportedLangCodes = processHrefLangAttrs();
    }
    languageRedirect();
  }

  return run;
}());

autoLanguageRedirect();
