###
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
###

###*
# Main class
# @class UQC
###
class UQC
  @EMPTY = '<span class="empty_value">[EMPTY]</span>'
  @UNDEFINED = '<span class="undefined_key">[UNDEFINED]</span>'

  ###*
  # Extract a URL query to an array
  # http://example.com/?a=x&b=y&c=z => {url: http://example.com/?a=x&b=y&c=z, parameters: {a:'x', b:'y', c:'z'}}
  #
  # @method getQueryArray
  # @param {String} URL
  # @param {Boolean} the query will be decoded by decodeURIComponent()
  # @return {Array} hash map of keys and values
  ###
  @getQueryArray: (url, decode = true) ->
    # Split URL(http://example.com/?a=x&b=y) to a path (http://example.com/) and a query(a=x&b=y)
    [path, query] = url.split '?'
    return if not query?

    parameters = {}
    for p in query.split '&'
      [key, value] = p.split '='

      # Skip when value is null. It occurs when & exists after nothing.
      # ex. http://example.com/?&a=x&b=y / http://example.com/?a=x&&b=y
      continue unless value?

      # Set @EMPTY when value is empty.
      # ex. http://example.com/?a=&b=
      value = if value.length == 0 then @EMPTY else value

      parameters[key] = if decode then decodeURIComponent(value) else value
    {
    url: url
    parameters: parameters
    }

  ###*
  # Aggregate parameter keys of query arrays to an array
  # {a:1, b:2, c:3}, {b:4, c:5, d:6} => [a, b, c, d]
  #
  # @method aggregateParameterKeys
  # @param {Array} query arrays
  # @return {Array} keys extracted from query arrays
  ###
  @aggregateParameterKeys: (queryArrays) ->
    keys = {}
    for qa in queryArrays
      for key, value of qa.parameters
        keys[key] = 1
    Object.keys(keys).sort()

  ###*
  # Convert multi-line strings separated by return codes to an array of strings
  #
  # @method convertMultiLineStringsToArray
  # @param {String} Multi-line strings
  # @return {Array} An array of strings
  ###
  @convertMultiLineStringsToArray: (strings) ->
    (string for string in strings.split(/\r\n|\r|\n/)).filter (x) -> x.replace(/^\s+$/, '') isnt ''

  ###*
  # Parse
  #
  # @method parse
  ###
  @parse: ->
    isDecodeURI = document.getElementById('decodeURI').checked
    queryParametersArrays = (UQC.getQueryArray url, isDecodeURI for url in UQC.convertMultiLineStringsToArray(document.getElementById('urls').value)).filter (x) -> x?
    aggregatedParameterKeys = UQC.aggregateParameterKeys(queryParametersArrays)

    html = '<table class="table table-striped table-condensed table-bordered">'
    html += "<thead><tr><th></th></th><th>" + (aggregatedParameterKeys.reduce (a, b) -> "#{a}</th><th>#{b}") + "</th></tr></thead><tbody>"
    for qp in queryParametersArrays
      html += "<tr><td><a href=\"#{qp.url}\" title=\"#{qp.url}\">link</a></td>"
      for key in aggregatedParameterKeys
        html += if key of qp.parameters then "<td>#{qp.parameters[key]}</td>" else "<td>#{@UNDEFINED}</td>"
      html += "</tr>"
    html += "</tbody></table>"

    document.getElementById('result').innerHTML = html

# Export UQC class
@UQC = UQC