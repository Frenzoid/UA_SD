import { useEffect, useState } from "react";

function App() {
  const [matrix, setMatrix] = useState([]);

  useEffect(() => {

    const n = 20;

    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        matrix[i][j] = { color: "red", coords: [i, j] }
      }
    }

    // Could also use
    // Array(n).fill(0).map(_ => new Array(n).fill(0).map(_ => ({ color: "red" })))
    // But its disgusting AF.

    setMatrix([...matrix]);

  }, [])

  let updateCell = (i, j) => {
    console.log(i, j);
    matrix[i][j].color = "blue";
    setMatrix([...matrix]);
  }

  return (

    <div className="container">

      {matrix.map((i, ipos) => {

        return (
          <div key={ipos} className="d-flex flex-row wrap">

            {i.map((j, jpos) => {
              return (

                <div
                  style={{ minWidth: "5%", minHeight: "50px", textAlign: "center", color: "white", backgroundColor: matrix[ipos][jpos].color }}
                  key={ipos + ", " + jpos}
                  onClick={() => { updateCell(ipos, jpos) }}
                >
                  {ipos + ", " + jpos}
                </div>

              )
            })}

          </div>
        )

      })}

    </div>
  )
}

export default App;
