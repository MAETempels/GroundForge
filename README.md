# [DEMO](https://d-bl.github.io/TesseLaceD/)
A web based toolbox to design bobbin lace grounds with matching diagrams.

[TesseLace.com]: http://TesseLace.com

## How it's Made / Under the Hood

To provide a proof of concept an [example] for [D3.js] was changed into lace diagrams with the following steps:

- Replaced the server side JSon with the hard-coded `sample.js`.
- Applied arrow heads and flattened them to colored line ends to emulate [color coded pair diagrams] or to emulate the over/under effect in thread diagrams.
- Made nodes transparent except for bobbins.
- Assigned the thread number as a class to each section of a thread to assign colors.
- Turned the links from lines to paths with a third node to add mid-markers for twist marks.
- Initial coordinates replace the default random values, thus the animation stabalizes much quicker and it prevents rotated and flipped diagrams.

To provide patterns [scala code] is compiled into `matrix-graphs.js` to generate alternatives for the `sample.js`.
These alternatives are based on a selection of matrices generated by [TesseLace.com].
The matrices contain geometric information used to initialise as explained above.
In the end the diagrams lack the geometric information, so topological duplicates were removed from the selection of matrices.
Users can reinvent the geometric variations by customising the download version of the diagrams,
this customizing allows infinite intermediate versions of the variations.


[example]: http://bl.ocks.org/mbostock/4062045
[D3.js]: http://d3js.org/
[color coded pair diagrams]: https://en.wikipedia.org/w/index.php?title=Mesh_grounded_bobbin_lace&oldid=639789191#Worker_pair_versus_two_pair_per_pin
[scala code]: https://github.com/d-bl/TesseLaceD/tree/master/

## How to Contribute

You may just improve the grammar on the demo-page or on this readme, improve the layout or fix a more technical issue.

Don't know about version control in general or GitHub in particular? No problem:
* just create a github [account](https://github.com)
* hit the fork button at the top of this page
* go to `https://github.com/YOURID/TesseLaceD/tree/gh-pages/`, of course replace YOURID
* choose the file you want to change and hit the pencil to start editing
* save your changes and test with your own demo-page: `http://YOURID.github.io/TesseLaceD/`, again: replace YOURID
* create a pull request at `https://github.com/YOURID/TesseLaceD/tree/gh-pages/` or drop a note
