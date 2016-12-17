/*
 Copyright 2015 Jo Pol
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see http://www.gnu.org/licenses/gpl.html dibl
*/
package dibl

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport

class D3Data (pairDiagram: Diagram) {

  lazy val threadDiagram = ThreadDiagram(pairDiagram, maxNrOfNodes = 2000)

  @JSExport
  def pairNodes(): js.Array[js.Dictionary[Any]] = toJS(pairDiagram.nodes)

  @JSExport
  def pairLinks(): js.Array[js.Dictionary[Any]] = toJS(pairDiagram.links)

  @JSExport
  def threadNodes(): js.Array[js.Dictionary[Any]] = toJS(threadDiagram.nodes)

  @JSExport
  def threadLinks(): js.Array[js.Dictionary[Any]] = toJS(threadDiagram.links)

  private def toJS(scalaItems: Seq[Props]): js.Array[js.Dictionary[Any]] = {

    val jsItems = new js.Array[js.Any](scalaItems.length).asInstanceOf[js.Array[js.Dictionary[Any]]]
    for {i <- scalaItems.indices} {
      jsItems(i) = js.Object().asInstanceOf[js.Dictionary[Any]]
      for {key <- scalaItems(i).keys} {
        jsItems(i)(key) = scalaItems(i)(key)
      }
    }
    jsItems
  }
}

@JSExport
object D3Data {

  /** Creates nodes and links from values in form fields of docs/index.html
    *
    * @param compactMatrix see legend on matrix tab
    * @param tileType see values for drop down on matrix tab
    * @param stitches see stitches tab
    * @param rows see patch size tab
    * @param cols see patch size tab
    * @param shiftLeft see footside tab
    * @param shiftUp see footside tab
    * @return An object with links and nodes for a pair diagram and thread diagram.
    *         Evaluation of the thread diagram only takes place when accessed.
    *         Accessing just the thread diagram will only skip the conversion to raw JavaScript
    *         of the pair diagram.
    */
  @JSExport
  def get(compactMatrix: String, rows: Int, cols: Int, shiftLeft: Int, shiftUp: Int, stitches: String, tileType: String
         ): D3Data =
  new D3Data(PairDiagram(Settings(
    compactMatrix, tileType, rows, cols, shiftLeft, shiftUp, stitches
  )))
}
