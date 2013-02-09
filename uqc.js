/*
Copyright (c) 2013 Hideki Okamoto (Twitter: @tox2ro)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


/**
# Main class
# @class UQC
*/


(function() {
  var UQC;

  UQC = (function() {

    function UQC() {}

    UQC.EMPTY = '<span class="empty_value">[EMPTY]</span>';

    UQC.UNDEFINED = '<span class="undefined_key">[UNDEFINED]</span>';

    /**
    # Extract a URL query to an array
    # http://example.com/?a=x&b=y&c=z => {url: http://example.com/?a=x&b=y&c=z, parameters: {a:'x', b:'y', c:'z'}}
    #
    # @method getQueryArray
    # @param {String} URL
    # @param {Boolean} the query will be decoded by decodeURIComponent()
    # @return {Array} hash map of keys and values
    */


    UQC.getQueryArray = function(url, decode) {
      var key, p, parameters, path, query, value, _i, _len, _ref, _ref1, _ref2;
      if (decode == null) {
        decode = true;
      }
      _ref = url.split('?'), path = _ref[0], query = _ref[1];
      if (!(query != null)) {
        return;
      }
      parameters = {};
      _ref1 = query.split('&');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        p = _ref1[_i];
        _ref2 = p.split('='), key = _ref2[0], value = _ref2[1];
        if (value == null) {
          continue;
        }
        value = value.length === 0 ? this.EMPTY : value;
        parameters[key] = decode ? decodeURIComponent(value) : value;
      }
      return {
        url: url,
        parameters: parameters
      };
    };

    /**
    # Aggregate parameter keys of query arrays to an array
    # {a:1, b:2, c:3}, {b:4, c:5, d:6} => [a, b, c, d]
    #
    # @method aggregateParameterKeys
    # @param {Array} query arrays
    # @return {Array} keys extracted from query arrays
    */


    UQC.aggregateParameterKeys = function(queryArrays) {
      var key, keys, qa, value, _i, _len, _ref;
      keys = {};
      for (_i = 0, _len = queryArrays.length; _i < _len; _i++) {
        qa = queryArrays[_i];
        _ref = qa.parameters;
        for (key in _ref) {
          value = _ref[key];
          keys[key] = 1;
        }
      }
      return Object.keys(keys).sort();
    };

    /**
    # Convert multi-line strings separated by return codes to an array of strings
    #
    # @method convertMultiLineStringsToArray
    # @param {String} Multi-line strings
    # @return {Array} An array of strings
    */


    UQC.convertMultiLineStringsToArray = function(strings) {
      var string;
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = strings.split(/\r\n|\r|\n/);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          string = _ref[_i];
          _results.push(string);
        }
        return _results;
      })()).filter(function(x) {
        return x.replace(/^\s+$/, '') !== '';
      });
    };

    /**
    # Parse
    #
    # @method parse
    */


    UQC.parse = function() {
      var aggregatedParameterKeys, html, isDecodeURI, key, qp, queryParametersArrays, url, _i, _j, _len, _len1;
      isDecodeURI = document.getElementById('decodeURI').checked;
      queryParametersArrays = ((function() {
        var _i, _len, _ref, _results;
        _ref = UQC.convertMultiLineStringsToArray(document.getElementById('urls').value);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          url = _ref[_i];
          _results.push(UQC.getQueryArray(url, isDecodeURI));
        }
        return _results;
      })()).filter(function(x) {
        return x != null;
      });
      aggregatedParameterKeys = UQC.aggregateParameterKeys(queryParametersArrays);
      html = '<table class="table table-striped table-condensed table-bordered">';
      html += "<thead><tr><th></th></th><th>" + (aggregatedParameterKeys.reduce(function(a, b) {
        return "" + a + "</th><th>" + b;
      })) + "</th></tr></thead><tbody>";
      for (_i = 0, _len = queryParametersArrays.length; _i < _len; _i++) {
        qp = queryParametersArrays[_i];
        html += "<tr><td><a href=\"" + qp.url + "\" title=\"" + qp.url + "\">link</a></td>";
        for (_j = 0, _len1 = aggregatedParameterKeys.length; _j < _len1; _j++) {
          key = aggregatedParameterKeys[_j];
          html += key in qp.parameters ? "<td>" + qp.parameters[key] + "</td>" : "<td>" + this.UNDEFINED + "</td>";
        }
        html += "</tr>";
      }
      html += "</tbody></table>";
      return document.getElementById('result').innerHTML = html;
    };

    return UQC;

  })();

  this.UQC = UQC;

}).call(this);
