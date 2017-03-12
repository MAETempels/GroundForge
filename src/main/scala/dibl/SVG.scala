/*
 Copyright 2017 Jo Pol
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see http://www.gnu.org/licenses/gpl.html
*/

package dibl

import scala.scalajs.js.annotation.JSExport

@JSExport
object SVG {

  @JSExport
  def circle(r: Int): String = s"M $r,0 A $r,$r 0 0 1 0,$r $r,$r 0 0 1 -$r,0 $r,$r 0 0 1 0,-$r $r,$r 0 0 1 $r,0 Z"

  @JSExport
  val bobbin: String = "m 0,40" +
    " c -3.40759,0 -6.01351,3.60204 -1.63269,3.60204" +
    " l 0,19.82157" +
    " c -3.67432,-0.008 -1.7251,5.087 -1.32784,7.27458 0.76065,4.18864 1.01701,8.40176 0.3478,12.58551 -1.68869,10.55725 -2.31894,21.67593 1.25552,31.9161 0.2088,0.59819 0.68935,2.7631 1.40054,2.7636 0.71159,0 1.19169,-2.16521 1.40057,-2.7636" +
    " C 5.01838,104.95964 4.38954,93.84095 2.70085,83.2837 2.03164,79.09995 2.28656,74.88683 3.04721,70.69819 3.44447,68.51061 5.61865,63.44146 1.71951,63.42361" +
    " l 0,-19.82157" +
    " C 5.86853,43.60204 3.4855,39.99659 0,40" +
    " L 0,0"

  private val square = "M -6,-6 6,-6 6,6 -6,6 Z"
  private val diamond = "M -5,0 0,8 5,0 0,-8 Z"
  private def shape(node: Props) = // See https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands
    if (node.pin) circle(4)
    else if (node.bobbin) bobbin
    else circle(6)

  @JSExport
  val markerDefinitions: String = {
    def startMarker(colorName: String,
                    colorValue: String
                   ) = endMarker(colorName, colorValue, "start", "")

    def endMarker(colorName: String,
                  colorValue: String,
                  idPrefix: String = "end",
                  properties: String = """refX="10""""
                 ) =
      s"""<marker $properties
         | id="$idPrefix-$colorName"
         | viewBox="0 -5 10 10"
         | markerWidth="6"
         | markerHeight="8"
         | orient="auto"
         | markerUnits="userSpaceOnUse">
         | <path d="M0,0L10,0"
         |  stroke-width="3"
         |  stroke="$colorValue"></path>
         |</marker>
         |""".
        stripMargin.stripLineEnd.replaceAll("[\n\r]", "")

    def threadMarker() = pairMarker("thread", square)

    def pairMarker(idSuffix: String = "pair", shape: String = diamond) =
      s"""<marker id="start-$idSuffix"
         | viewBox="-7 -7 14 14"
         | markerWidth="12"
         | markerHeight="12"
         | orient="auto"
         | markerUnits="userSpaceOnUse">
         | <path d="$shape"
         |  fill="#000"
         |  style="opacity: 0.5;"></path>
         |</marker>
         |""".stripMargin.stripLineEnd.replaceAll("[\n\r]", "")

    def twistMark(count: Int = 1) =
      s"""<marker id="twist-$count"
         | viewBox="-2 -2 4 4"
         | markerWidth="5"
         | markerHeight="5"
         | orient="auto"
         | markerUnits="userSpaceOnUse">
         | <path d="M 0,6 0,-6"
         |  fill="#000"
         |  stroke="#000"
         |  stroke-width="1px"></path>
         |</marker>
         |""".stripMargin.stripLineEnd.replaceAll("[\n\r]", "")

    s"""<defs>
       |  ${threadMarker()}
       |  ${pairMarker()}
       |  ${twistMark()}
       |  ${startMarker("red", "#f00")}
       |  ${startMarker("green", "#0f0")}
       |  ${startMarker("purple", "#609")}
       |  ${endMarker("red", "#f00")}
       |  ${endMarker("green", "#0f0")}
       |  ${endMarker("purple", "#609")}
       |</defs>""".stripMargin.stripLineEnd
  }


  private def pathDescription(diagram: Diagram, link: Props): String = {
    val source = diagram.nodes(link.source)
    val target = diagram.nodes(link.target)
    val sX = source.x
    val sY = source.y
    val tX = target.x
    val tY = target.y
    pathDescription(link, sX, sY, tX, tY)
  }

  @JSExport
  def pathDescription(link: Props, sX: Int, sY: Int, tX: Int, tY: Int): String = {
    val dX = tX - sX
    val dY = tY - sY
    val left = link.left
    val right = link.right
    val start = link.start
    val end = link.end
    val nrOfTwists = link.nrOfTwists

    def mid = if (left)
      s"S${sX - dY / 3 + dX / 3},${sY + dX / 3 + dY / 3}"
    else if (right)
      s"S${sX + dY / 3 + dX / 3},${sY + dY / 3 - dX / 3}"
    else " "

    // TODO see issue #70 to calculate a white end/start
    if (end == "white")
      s"M$sX,${sY + mid} ${tX - dX / 4},${tY - dY / 4}"
    else if (start == "white")
      s"M${sX + dX / 4},${(sY + dY / 4) + mid} $tX,$tY"
    else if (nrOfTwists > 0)
      "M" + sX + "," + sY + " " + (sX + dX / 2) + "," + (sY + dY / 2) + " " + tX + "," + tY
    else s"M$sX,$sY $tX,$tY"
  }

  private def markerRef(key: String, node: Props): Option[String] =
    node
      .get(key)
      .filter(value => value != "white")
      .map(value =>
        s"; marker-$key: url('#$key-$value')"
      )

  private def renderLinks(diagram: Diagram,
                  strokeWidth: String,
                  markers: Boolean
                 ): String = diagram.links.map { link =>
    val opacity = if (link.border || link.toPin) 0 else 1
    val markerRefs = if (!markers) "" else
      link.get("mid").map(_ => s"; marker-mid: url('#twist-1')").getOrElse("") +
        markerRef("start", link).getOrElse("") +
        markerRef("end", link).getOrElse("")
    val pd = pathDescription(diagram, link)
    val cl = link.get("thread").map(nr => s"link thread$nr").getOrElse("link")
    // TODO no stroke color/width would allow styling threads with CSS
    // what in turn allows changes without repeating the simulation
    // stand-alone SVG does require stroke details
    s"""<path
       | class="$cl"
       | d="$pd"
       | style="stroke: rgb(0, 0, 0); stroke-width: $strokeWidth; fill: none; opacity: $opacity$markerRefs"
       |></path>""".stripMargin
  }.mkString

  private def renderNodes(nodes: Seq[Props]
                 ): String = nodes.map { node =>
    val opacity = if (node.bobbin || node.pin) 1 else 0
    val stroke = if (node.bobbin) "rgb(0, 0, 0); stroke-width: 2px" else "none"
    val cssClasses = (node.get("startOf"), node.get("thread")) match {
      case (Some(_), _) =>
        s"node threadStart"
      case (None, Some(t)) =>
        s"node thread$t"
      case _ => "node"
    }
    s"""<path
       | class="$cssClasses"
       | d="${shape(node)}"
       | style="fill: rgb(0, 0, 0); stroke: $stroke; opacity: $opacity"
       | transform="translate(${node.x},${node.y})"
       |><title>${node.title}</title></path>""".stripMargin
  }.mkString

  /** Prefix required when writing to an SVG file */
  val prolog = "<?xml version='1.0' encoding='UTF-8'?>"

  def threadsCSS(colors: Array[String]
                 = ("f00,f00,000,000,00f,00f,000,000"*20).split(",")
                ): String =
    colors.indices
      .map(i => s".thread$i { color: #${colors(i)} }")
      .mkString("\n")


  /** @param diagram     collections of nodes and links
    * @param strokeWidth recommended values: "1px" for pair diagrams, "2px" for thread diagrams
    *                    thicker lines improve zooming out
    *                    the color code width for pair diagram is slightly more than 1px
    *                    the gap for a thread behind another is about 7px
    * @param markers     if true color coding of pair diagrams is rendered
    *                    which can slow down animation significantly
    *                    and breaks animation on IE, see issue #52
    * @return and SVG document as String
    */
  @JSExport
  def render(diagram: Diagram,
             strokeWidth: String = "1px",
             markers: Boolean = true,
             width: Int = 744,
             height: Int = 1052
            ): String =
  s"""
     |<svg
     | id="svg2"
     | version="1.1"
     | width="$width"
     | height="$height"
     | pointer-events="all"
     | xmlns="http://www.w3.org/2000/svg"
     | xmlns:svg="http://www.w3.org/2000/svg"
     | xmlns:xlink="http://www.w3.org/1999/xlink"
     |>
     |$markerDefinitions
     |${renderLinks(diagram, strokeWidth, markers)}
     |${renderNodes(diagram.nodes)}
     |</svg>""".stripMargin.stripLineEnd
}