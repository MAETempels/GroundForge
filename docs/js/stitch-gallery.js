const GF_stitches = {

    lastValidStitchValue: "ct", // the initial value by loadStitchForm
    imagesLocation: "/GroundForge/images/stitches",
    stitches: [
        "cllcrrcllcrrc",
        "ctctctc",
        "ct",
        "ctct",
        "clcrclc",
        "ctctc",
        "ctclctc",
        "crclct",
        "ctclcrctc",
        "ctcttctc",
        "crcllrrrc",
        "tctctllctctr",
    ],

    fixStitchValue(inputField) {
        const value = inputField.value.toLowerCase();
        inputField.value = value
        if (/^([-]|([tclr])*)$/.test(value)) {
            GF_stitches.lastValidStitchValue = value;
        } else {
            const pos1 = inputField.selectionStart - 1;
            const pos2 = inputField.selectionEnd - 1;
            inputField.value = GF_stitches.lastValidStitchValue;
            inputField.setSelectionRange(pos1, pos2);
            if (typeof window.AudioContext !== "undefined") {
                const ctx = new window.AudioContext();
                const o = ctx.createOscillator();
                o.type = "sine";
                o.frequency.value = 440;
                o.onended = function () {
                    ctx.close();
                };
                o.connect(ctx.destination);
                o.start();
                o.stop(ctx.currentTime + 0.05);
            }
        }
    },


    loadStitchExamples() {
        for (let stitch of GF_stitches.stitches) {
            document.querySelector("#gallery").innerHTML += `
            <figure>
                <svg width="20" height="54">
                  <g transform="scale(2,2)">
                    <g transform="translate(5,6)">
                      ${PairSvg.shapes(stitch)}
                    </g>
                  </g>
                </svg>
                <img src="${GF_stitches.imagesLocation}/${stitch}.svg"
                     title="${stitch}">
                <figcaption>
                     <a href="javaScript:GF_stitches.setStitch('${stitch}')">${stitch}</a>&nbsp;
                </figcaption>
            </figure>`
        }
    },

    paintStitchValue() {
        return d3.select("#stitchDef").node().value.toLowerCase().replace(/[^ctlrp-]/g, '')
    },

    load(isDroste) {
        this.loadStitchExamples();
        this.loadStitchForm(isDroste);
        this.setColorCode();
    },

    loadStitchForm() {
        let p = document.createElement("p")
        p.innerHTML += `
            <span id="colorCode"></span>
            <input type="text" value="ct"
                   id="stitchDef" name="stitchDef"
                   onkeyup="GF_stitches.setColorCode()"
                   oninput="GF_stitches.fixStitchValue(this)"
                   onclick="return false" onsubmit="return false"
            >
            Flip: 
            <a class="button" href="javascript:GF_stitches.flip2d()">&harr;</a>
            <a class="button" href="javascript:GF_stitches.flip2p()">&varr;</a>
            <a class="button" href="javascript:GF_stitches.flip2q()">both</a>
            <label for="setRandom">Random stitch:</label>
            <a id="setRandom" class="button" href="javascript:GF_stitches.setRandomStitch()">generate</a>
`
        let element = document.querySelector("#gallery");
        element.parentNode.insertBefore(p, element.nextSibling)
        this.setStitch("ct")
    },

    setRandomStitch() {
        /* genRandomStitch(maxCrosses, maxTwistsBetweenCrosses, maxTwistsBefore,  maxTwistsAfter)   */
        let s = GF_Random.genRandomStitch(4, 1, 1, 1).toLowerCase()
        GF_stitches.setStitch(s)
        // TODO the next function calls depend on the presence of nets.js, the name generate is too general
        if (typeof stitchChanged === "function") {
            stitchChanged();
        }
        if (typeof generate === "function") {
            generate("1");
        }
    },

    flip2d() {
        var n = d3.select('#stitchDef').node()
        n.value = n.value.toLowerCase().replace(/l/g, "R").replace(/r/g, "L").toLowerCase()
        this.setColorCode()
    },

    flip2p() {
        var n = d3.select('#stitchDef').node()
        n.value = n.value.toLowerCase().split("").reverse().join("")
        this.setColorCode()
    },

    flip2q() {
        this.flip2d()
        this.flip2p()
    },

    setColorCode() {
        let node = d3.select("#stitchDef").node();
        if (node)
            document.querySelector('#colorCode').innerHTML = `
        <svg width="20px" height="25px">
          <g transform="scale(2,2)">
            <g transform="translate(5,6)">
              ${PairSvg.shapes(node.value.toLowerCase())}
            </g>
          </g>
        </svg>`
    },

    setStitch(stitch) {
        const n = document.querySelector("#stitchDef")
        n.value = stitch
        this.lastValidStitchValue = stitch;
        this.setColorCode();
    }
}

const GF_Random = {
    stitchArray: [],
    max_L: 40, max_C: 8, max_TBA: 8, max_TC: 8,
    min_L: 1, min_C: 1, min_TBA: 0, min_TC: 1,

    genRandomStitchList(stitchesRequired, maxCrosses, maxTwistsBetweenCrosses, maxTwistsBefore, maxTwistsAfter) {

        // clear previous run
        GF_Random.stitchArray = [];

        // Validate input - needed if called with arguments. Can be higher than user-input.
        if (stitchesRequired < GF_Random.min_L) {
            stitchesRequired = GF_Random.min_L;
        }
        if (stitchesRequired > GF_Random.max_L) {
            stitchesRequired = GF_Random.max_L;
        }

        for (let countStitches = 1; countStitches <= stitchesRequired; countStitches++) {
            GF_Random.stitchArray.push(GF_Random.genRandomStitch(maxCrosses, maxTwistsBetweenCrosses, maxTwistsBefore, maxTwistsAfter))
        }

        return GF_Random.stitchArray;
    },

    genRandomStitch(maxCrosses, maxTwistsBetweenCrosses, maxTwistsBefore, maxTwistsAfter) {
        // define & initialize variables
        let stitch = "";

        // Validate input - needed if called with arguments. Can be higher than user-input.
        if (maxCrosses < GF_Random.min_C) {
            maxCrosses = GF_Random.min_C;
        }
        if (maxCrosses > GF_Random.max_C) {
            maxCrosses = GF_Random.max_C;
        }
        if (maxTwistsBetweenCrosses < GF_Random.min_TC) {
            maxTwistsBetweenCrosses = GF_Random.min_TC;
        }
        if (maxTwistsBetweenCrosses > GF_Random.max_TC) {
            maxTwistsBetweenCrosses = GF_Random.max_TC;
        }
        if (maxTwistsBefore < GF_Random.min_TBA) {
            maxTwistsBefore = GF_Random.min_TBA;
        }
        if (maxTwistsBefore > GF_Random.max_TBA) {
            maxTwistsBefore = GF_Random.max_TBA;
        }
        if (maxTwistsAfter < GF_Random.min_TBA) {
            maxTwistsAfter = GF_Random.min_TBA;
        }
        if (maxTwistsAfter > GF_Random.max_TBA) {
            maxTwistsAfter = GF_Random.max_TBA;
        }

        // how many crosses, minimal 1 cross, therefore add 1 to random integer
        let lengthCrosses = Math.floor(Math.random() * maxCrosses) + 1;

        // twists before first C
        if (maxTwistsBefore > 0) {
            stitch += GF_Random.genTwistsBA(maxTwistsBefore);
        }

        // generate part of stitch
        for (let countCrosses = 1; countCrosses <= lengthCrosses - 1; countCrosses++) {
            stitch += "C";
            stitch += GF_Random.genTwistsCC(maxTwistsBetweenCrosses);
        }

        // last Cross
        stitch += "C";

        // twists after last C
        if (maxTwistsAfter > 0) {
            stitch += GF_Random.genTwistsBA(maxTwistsAfter);
        }

        return stitch;
    },

    // generate a string with "L", "R".
    // note: string of 0, 1, ..., maxTwists twists, therefore (maxTwists + 1)
    // This function gives a chance of 0 twists of (1 / maxTwitst)
    genTwistsBA(maxTwists) {
        let lengthAll = Math.floor(Math.random() * (maxTwists + 1));

        let lengthL = Math.floor(Math.random() * (lengthAll + 1));
        let lengthR = Math.floor(Math.random() * (lengthAll + 1));
        // = 0 if lengthAll = 0

        // make sure that max(lengthL, lengthR) = lengthAll
        // The simplified version: if lengthL < lengthAll then lengthR = lengthAll doesn't work well. It generates more R's than L's.
        // Because: chance(lengthL == lengthAll) = 1/lengthAll and chance(lengthL < lengthAll) = ((lengthAll-1)/lenghtAll).
        if (Math.max(lengthL, lengthR ) !== lengthAll) {
            if ( Math.floor(Math.random() * 2) === 0) {
                lengthL = lengthAll;
            } else {
                lengthR = lengthAll;
            }
        }

        // "T" is short for combination of "L" and "R".
        let lengthT = Math.min(lengthL, lengthR);
        lengthL = lengthL - lengthT;
        lengthR = lengthR - lengthT;

        return "T".repeat(lengthT) + "L".repeat(lengthL) + "R".repeat(lengthR);
    },

    // generate a string with "L", "R".
    // note: string of 0, 1, ..., maxTwists twists, therefore (maxTwists + 1)
    // This function gives a change for zero twists of (1 / square(maxTwists))
    genTwistsCC(maxTwists) {

        let lengthL = Math.floor(Math.random() * (maxTwists + 1));
        let lengthR = Math.floor(Math.random() * (maxTwists + 1));

        // "T" is short for combination of "L" and "R".
        let lengthT = Math.min(lengthL, lengthR);
        lengthL = lengthL - lengthT;
        lengthR = lengthR - lengthT;

        return "T".repeat(lengthT) + "L".repeat(lengthL) + "R".repeat(lengthR);
    },

    genVal(vId) {
        let valWrd = Number(vId.value);
        let vMin = Number(vId.min);
        let vMax = Number(vId.max);

        let toBeep;

        toBeep = isNaN(valWrd);

        if (!toBeep) {
            if (valWrd < vMin) {
                toBeep = true;
                vId.value = vMin;
            }
            if (valWrd > vMax) {
                toBeep = true;
                vId.value = vMax;
            }
        }

        if (toBeep) {
            if (typeof window.AudioContext !== "undefined") {
                const ctx = new window.AudioContext();
                const o = ctx.createOscillator();
                o.type = "sine";
                o.frequency.value = 440;
                o.onended = function () {
                    ctx.close();
                };
                o.connect(ctx.destination);
                o.start();
                o.stop(ctx.currentTime + 0.05);
            }
        }

        return vId;
    },

    // I want to keep genRandomStitchList and genRandomStitch as flexible as is. Therefore, construct as below.
    // Why this display-function, as <p setRandomList> also displays stitchArray = genRandomStitchList?
    // We want to add the colorcode and the threaddiagram to the list. See p2t.newlegendStitch.
    displayRandomStitchList() {

        let displayStitch;
        let displayElement;
        let threadSvg, colorCodeSvg, figure, twistMarkSvg;
        let southEast, southWest, northEast, northWest;

        displayElement = document.getElementById("displayRandomArray");
        displayElement.innerHTML = "";

        for (let i = 0; i < GF_Random.stitchArray.length; i++) {

            displayStitch = GF_Random.stitchArray[i];

            // copied from newLegendStitch, as "document.body.appendChild(figure)" does not clean up previous result, and picts to large
            // without "figcaption"

            threadSvg = GF_svgP2T.newSVG(40,60);
            GF_svgP2T.newStitch(displayStitch, 0,0, threadSvg,40,60);
            GF_svgP2T.addThreadClasses(threadSvg);          // this gives the lines their color

            // copied from GF_stitches.setcolorcode()
            colorCodeSvg = document.createElement("colorCodeSvg");
            twistMarkSvg = document.createElement("twistMarkSvg");

            southEast = ((displayStitch.substring(displayStitch.lastIndexOf("C")+1)).replaceAll("L","")).length.toString();
            southWest = ((displayStitch.substring(displayStitch.lastIndexOf("C")+1)).replaceAll("R","")).length.toString();
            northEast = ((displayStitch.substring(0, displayStitch.indexOf("C"))).replaceAll("L","")).length.toString();
            northWest = ((displayStitch.substring(0, displayStitch.indexOf("C"))).replaceAll("R","")).length.toString();
            if (southEast > 3) {southEast = 3};
            if (southWest > 3) {southWest = 3};
            if (northEast > 3) {northEast = 3};
            if (northWest > 3) {northWest = 3};

            function twistMarkerLine(path,swne) {
                return `<path d="M 20 20 ${path}" style="stroke: #000; stroke-width: 1.7px; marker-mid: url('#twist-${swne}');"></path>`;
            };

            // line not long enough for more than 3 twistmarks
            twistMarkSvg.innerHTML = `
                <svg width="40px" height="40px" fill="none">
                <defs>
                    <marker id="twist-1" viewBox="-2 -2 4 4" markerWidth="9" markerHeight="9" orient="auto" markerUnits="userSpaceOnUse">
                    <path d="M 0 6 L 0 -6" fill="#000" stroke="#000" stroke-width="0.7px"></path>
                    </marker>
                    <marker id="twist-2" viewBox="-2 -2 4 4" markerWidth="9" markerHeight="9" orient="auto" markerUnits="userSpaceOnUse">
                    <path d="M -1 6 L -1 -6 M 1 6 L 1,-6" fill="#000" stroke="#000" stroke-width="0.7px"></path>
                    </marker>
                    <marker id="twist-3" viewBox="-2 -2 4 4" markerWidth="9" markerHeight="9" orient="auto" markerUnits="userSpaceOnUse">
                    <path d="M -1.2 6 L -1.2 -6 M 0 6 L 0 -6 M 1.2 6 L 1.2 -6" fill="#000" stroke="#000" stroke-width="0.7px"></path>
                    </marker>
                 </defs>
                 ${twistMarkerLine("L 30 30 M 30 30 L 40 40", southEast)}
                 ${twistMarkerLine("L 10 30 M 10 30 L  0 40", southWest)}
                 ${twistMarkerLine("L 10 10 M 10 10 L  0  0", northWest)}
                 ${twistMarkerLine("L 30 10 M 30 10 L 40  0", northEast)}
                 
           
            <g transform="scale(2,2)">
            <g transform="translate(10,10)">
              ${PairSvg.shapes(displayStitch.toLowerCase())}
            </g>
            </g>
            </svg>`;

            figure = document.createElement("figure");
            figure.append(threadSvg);

            displayElement.appendChild(figure);
            displayElement.appendChild(twistMarkSvg);
            displayElement.appendChild(colorCodeSvg);
            displayElement.innerHTML += "&nbsp;" + "&nbsp;" + displayStitch;
            displayElement.innerHTML += "<br>";

        }
    },


    makeRandomStitchList(stitchesRequired, maxCrosses, maxTwistsBetweenCrosses, maxTwistsBefore, maxTwistsAfter) {
        // The function can be called with or without attributes.
        // without Number(), document.value is a string. With unexpected results in function genTwists.

        // number of stitches
        if (stitchesRequired === undefined) {
            stitchesRequired = Number(document.getElementById("stitchesRequired").value);
        }
        // maximum number of crosses
        if (maxCrosses === undefined) {
            maxCrosses = Number(document.getElementById("maxCrosses").value);
        }
        // maximum number of twists between two crosses
        if (maxTwistsBetweenCrosses === undefined) {
            maxTwistsBetweenCrosses = Number(document.getElementById("maxTwistsBetweenCrosses").value);
        }
        // maximum number of twists before stitch
        if (maxTwistsBefore === undefined) {
            maxTwistsBefore = Number(document.getElementById("maxTwistsBefore").value);
        }
        // maximum number of twists after stitch
        if (maxTwistsAfter === undefined) {
            maxTwistsAfter = Number(document.getElementById("maxTwistsAfter").value);
        }

        GF_Random.genRandomStitchList(stitchesRequired, maxCrosses, maxTwistsBetweenCrosses, maxTwistsBefore, maxTwistsAfter);
        GF_Random.displayRandomStitchList();

        return GF_Random.stitchArray;
    },
}



