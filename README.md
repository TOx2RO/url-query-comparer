URL Query Comparer
=====================

Comparing multiple URLs having similar query parameters in an easy-to-read manner.

Example
---------------------
  * http://example.com/?a=foo&b=bar&c=baz&d=
  * http://example.com/?a=apple&c=baz&d=&e=orange

When you have two URLs as above, you will get the following table.

    +------+------------+----+--------+------------+
    |a     |b           |c   |d       |e           |
    +------+------------+----+--------+------------+
    |foo   |bar         |baz |[EMPTY] |[UNDEFINED] |
    |apple |[UNDEFINED] |baz |[EMPTY] |orange      |
    +------+------------+----+--------+------------+


Usage
---------------------
  1. Open index.html
  2. Input some URLs to be compared in the textbox
  3. Click 'parse' button

Thanks
---------------------
[Bootstrap](http://twitter.github.com/bootstrap/) by Twitter

