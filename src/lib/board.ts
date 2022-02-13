import { Game } from "./game";
import { Grid } from "./grid";
import { BoardSquare, GridPoint, IllegalLightGevKeys, OgreSquare } from './types';
import { filterEmpty, flatten, mapReduce } from "./util";

export class Board {
  constructor(private readonly game: Game) { }

  getNeutralLightGevSquares(grid: BoardSquare[][]) {
    return filterEmpty(
      flatten(grid).map(bs => bs.square ? undefined : bs.key)
    ).filter(key => !IllegalLightGevKeys.has(key))
  }
  getVisibleSquares(tempSquare?: OgreSquare): BoardSquare[][] {
    const { game } = this;
    const squares = [
      ...(tempSquare ? [tempSquare] : []),
      ...game.red.getState().board,
      ...game.blue.getState().board,
    ];
    return this.get2dGrid(squares);
  }

  private get2dGrid(allSquares: OgreSquare[]) {
    const allPoints: GridPoint[] = allSquares.map(os => Grid.parseKey(os.key));
    const squareLookup = mapReduce(allSquares, os => os.key);
    const xMin = Math.min(0, ...allPoints.map(p => p.x)) - 1;
    const xMax = Math.max(0, ...allPoints.map(p => p.x)) + 1;
    const yMin = Math.min(-1, ...allPoints.map(p => p.y)) - 1;
    const yMax = Math.max(1, ...allPoints.map(p => p.y)) + 1;
    const out: BoardSquare[][] = [];
    for (let y = yMin; y <= yMax; y++) {
      const row: BoardSquare[] = [];
      out.push(row);
      for (let x = xMin; x <= xMax; x++) {
        const key = Grid.makeKey({ x, y });
        row.push({
          key,
          square: squareLookup[key],
        });
      }
    }
    return out;
  }
}
