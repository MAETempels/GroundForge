# [DEMO](https://d-bl.github.io/GroundForge/)
A web based toolbox to design bobbin lace grounds with matching diagrams.

[TesseLace.com]: http://TesseLace.com

## How it's Made / Under the Hood

### Proof of concept with D3.js

To get a proof of concept a force graph [example] with [D3.js] was changed into tiny thread an pair diagrams diagrams with the following steps:

- Replaced the server side JSon with the hard-coded `[js/sample.js]` assembled from a manual sketch `[js/sample.png]`.
- Applied arrow heads and flattened them to line ends to emulate [color coded pair diagrams] or to emulate the over/under effect in thread diagrams.
- Made nodes transparent except for bobbins.
- Assigned the thread number as a class to each section of a thread to assign colors.
- Turned the links from lines to paths with a third node to add mid-markers for twist marks.
- Initial coordinates replace the default random values, thus the animation stabalizes much quicker which prevents rotated and flipped diagrams.

[js/sample.js]: https://github.com/d-bl/GroundForge/blob/7a94b670636a138b1f417c0640561bfb1cbc5fc7/js/sample.js
[js/sample.png]: https://github.com/d-bl/GroundForge/blob/50421a210ee28c73bcdddbc997802d48128ce6b9/js/sample.png

### Using data from TesseLace

To provide alternatives for the `js/sample.js`, [scala code] transforms a selection of matrices generated by [TesseLace.com].
The [matrices] for the interleaved patterns of the [bridges] publication
define patterns by both incoming and outgoing pairs per node tagging the lines connecting the nodes.
GroundForge uses a [compact] format using just incoming pairs per node tagging the nodes.

The geometric information within the matrices is used to initialise the thread diagrams, speeding up the animation as explained above.
These [pages] were used to create the thumbnails.
The diagrams lack the original geometric information after completion of the animation,
so topological duplicates were removed from the generated thumbnails.
Downloadable pattern sheets provide geometric variations that can be customised into intermediate and other variations.

The thread diagrams are not generated from the matrices, but from the generated pair diagrams by replacing nodes with stitches.
To paint threads each segment has a class identifying the thread it belongs to.
To keep track of the threads while constructing the diagram, 
the algorithm has to figure out a working order to create the lace just like a real lace maker does.

[pages]: https://github.com/d-bl/GroundForge/blob/master/src/test/resources/
[compact]: https://d-bl.github.io/GroundForge/images/legend.png
[bridges]: https://tesselace.com/research/bridges2012/
[matrices]: http://web.uvic.ca/~vmi/papers/interleavedpatterns.html
[example]: http://bl.ocks.org/mbostock/4062045
[D3.js]: http://d3js.org/
[color coded pair diagrams]: https://en.wikipedia.org/w/index.php?title=Mesh_grounded_bobbin_lace&oldid=639789191#Worker_pair_versus_two_pair_per_pin
[scala code]: https://github.com/d-bl/GroundForge/tree/master/

### Color-picker: jscolor

Safari nor Internet Explorer support `<input type="color">`. The free [color-picker](http://jscolor.com/) works on both platforms and was easy to apply.

## How to Contribute

You may just want to improve some grammar. 
When signed in with a github [account](https://github.com)
you will see edit buttons when browsing through the wiki pages of the user guide.
When selecting one of the html pages listed above, you will see a pencil to start an edit.
This will cause github to fork the project under your own account and guide you to create a pull request
to be discussed, accepted and merged (or not) by the owner of this project.

For too complicated situations use the issues link on top of this page to make suggestions or start a discussion.