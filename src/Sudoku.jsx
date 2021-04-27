import { useEffect, useState } from "react";
import "./App.css"

const Sudoku = () => {

    const [sudoku, setSudoku] = useState([])
    const [changingSudoku, setChangingSudoku] = useState(true)
    const [numberClicked, setNumberClicked] = useState(true)
    const [colorClicked, setColorClicked] = useState(false)
    const [solveClicked, setSolveClicked] = useState(false)
    const [getNewSudokuClicked, setGetNewSudokuClicked] = useState(false)
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [gettingSudoku, setGettingSudoku] = useState(false)
    const [isSolving, setIsSolving] = useState(false)
    const [isChecking, setIsChecking] = useState(false)

    useEffect(()=>{
        getSudoku("easy")
        addListener()
    }, [])

    const addListener = () => {
        window.addEventListener("keydown", (e)=>{
            if (sudoku === []){
                return
            }
            if (e.key === "1"){
                document.querySelector('.menu-1').click()
            }else if (e.key === "2"){
                document.querySelector('.menu-2').click()
            }else if (e.key === "3"){
                document.querySelector('.menu-3').click()
            }else if (e.key === "4"){
                document.querySelector('.menu-4').click()
            }else if (e.key === "5"){
                document.querySelector('.menu-5').click()
            }else if (e.key === "6"){
                document.querySelector('.menu-6').click()
            }else if (e.key === "7"){
                document.querySelector('.menu-7').click()
            }else if (e.key === "8"){
                document.querySelector('.menu-8').click()
            }else if (e.key === "9"){
                document.querySelector('.menu-9').click()
            }else if (e.key === "Backspace"){
                document.querySelector('.delete').click()
            }
        })

    }

    const handleMouseOver = (y, i) => {
        if (gettingSudoku || isSolving || isChecking){
            return
        }
        let new_sudoku = sudoku
        if (isMouseDown){
            new_sudoku[y][i].clicked = !sudoku[y][i].clicked
            setSudoku(new_sudoku)
            setChangingSudoku(!changingSudoku)
        }

    }

    const handleClick = (y, i) => {
        if (gettingSudoku || isSolving || isChecking){
            return
        }
        let new_sudoku = sudoku
        new_sudoku[y][i].clicked = !sudoku[y][i].clicked
        setSudoku(new_sudoku)
        setChangingSudoku(!changingSudoku)

    }

    const unclickSudoku = () => {
        let new_sudoku = sudoku
        for (let row = 0; row < sudoku.length; row++){
            for (let col = 0; col < sudoku.length; col++){
                new_sudoku[row][col].clicked = false
            }
        }
        setSudoku(new_sudoku)
        setChangingSudoku(!changingSudoku)
    }
    const handleCheck = () => {
        if (gettingSudoku || isSolving || isChecking){
            return
        }
        setIsChecking(true)
        unclickSudoku()
        let solutionSteps = getSolution()
        let solution =  JSON.parse(JSON.stringify( solutionSteps[solutionSteps.length-1] ))
        console.log(solution, "solution")
        console.log(sudoku, "sudoku")
        let new_sudoku = sudoku
        for (let i = 0; i < sudoku.length; i++){
            for (let y = 0; y < sudoku.length; y++){
                if (solution[i][y].number === new_sudoku[i][y].number){
                    new_sudoku[i][y].color = "green"
                }else{
                    new_sudoku[i][y].color = "red"
                }
            }
        }
        setSudoku(new_sudoku)
        setChangingSudoku(!changingSudoku)
        setIsChecking(false)
    }
    const handleDelete = () => {
        if (gettingSudoku || isSolving || isChecking){
            return
        }
        let new_sudoku = sudoku
        for (let i = 0; i < new_sudoku.length; i++){
            for (let y = 0; y < new_sudoku[i].length; y++){
                if (new_sudoku[i][y].clicked){
                    if (!new_sudoku[i][y].fixed){
                        new_sudoku[i][y].number = false
                    }
                    new_sudoku[i][y].color = "white"
                }
            }
        }
        unclickSudoku()
        setSudoku(new_sudoku)
    }

    const changeColor = (new_color) => {
        if (gettingSudoku || isSolving || isChecking){
            return
        }
        let new_sudoku = sudoku
        for (let i = 0; i < new_sudoku.length; i++){
            for (let y = 0; y < new_sudoku[i].length; y++){
                if (new_sudoku[i][y].clicked){
                    new_sudoku[i][y].color = new_color
                }
            }
        }
        unclickSudoku()
        setSudoku(new_sudoku)
    }
    const changeNumber = (new_number) => {
        if (gettingSudoku || isSolving|| isChecking){
            return
        }
        let new_sudoku = sudoku
        for (let i = 0; i < new_sudoku.length; i++){
            for (let y = 0; y < new_sudoku[i].length; y++){
                if (sudoku[i][y].fixed){
                    continue
                }
                if (new_sudoku[i][y].clicked){
                    new_sudoku[i][y].number = new_number
                }
            }
        }
        unclickSudoku()
        setSudoku(new_sudoku)
        setChangingSudoku(!changingSudoku)
    }
    const changeMenu = (item) => {
        if (item === "number"){
            setNumberClicked(true)
            setColorClicked(false)
            setSolveClicked(false)
            setGetNewSudokuClicked(false)
        }
        if (item === "color"){
            setColorClicked(true)
            setNumberClicked(false)
            setSolveClicked(false)
            setGetNewSudokuClicked(false)
        }
        if (item === "solve"){
            setSolveClicked(true)
            setColorClicked(false)
            setNumberClicked(false)
            setGetNewSudokuClicked(false)
        }
        if (item === "sudoku"){
            setGetNewSudokuClicked(true)
            setSolveClicked(false)
            setColorClicked(false)
            setNumberClicked(false)
        }
    }
    const hasBorders = (row, column) => {
        let borders = ""
        if (row === 2 || row === 5 || row === 8){
            borders += "big-border-bottom "
        }
        if (row === 0 || row === 3 || row === 6){
            borders += "big-border-top "
        }
        if (column === 2 || column === 5 || column === 8){
            borders += "big-border-right "
        }
        if (column === 0 || column === 3 || column === 6){
            borders += "big-border-left "
        }
        return borders
    }

    const backtracking = () => {
        if (gettingSudoku || isSolving || isChecking){
            return
        }
        setIsSolving(true)
        let solutionSteps = getSolution()
        console.log(solutionSteps[solutionSteps.length-1])
        let i = 0
        var timer = setInterval(()=>{
            if (i >= solutionSteps.length){
                setIsSolving(false)
                clearInterval(timer)
            }else{
                setSudoku(solutionSteps[i])
                setChangingSudoku(!changingSudoku)
            }
            i++
        },10)
        
    }
   const getSolution = () => {
       let boards = []
        const nextEmptySpot = (board) => {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (board[i][j].number === false) 
                        return [i, j];
                    }
            }
            return [-1, -1];
        }
        const checkRow = (board, row, value) => {
            for(var i = 0; i < board[row].length; i++) {
                if(board[row][i].number === value) {
                    return false;
                }
            }
        
            return true;
        }
        const checkColumn = (board, column, value) => {
            for(var i = 0; i < board.length; i++) {
                if(board[i][column].number === value) {
                    return false;
                }
            }
        
            return true;
        };

        const checkSquare = (board, row, column, value) => {
            let boxRow = Math.floor(row / 3) * 3;
            let boxCol = Math.floor(column / 3) * 3;
            
            for (var r = 0; r < 3; r++){
                for (var c = 0; c < 3; c++){
                    if (board[boxRow + r][boxCol + c].number === value)
                        return false;
                }
            }

        return true;
    };

        const  checkValue = (board, row, column, value) => {
            if(checkRow(board, row, value) &&
            checkColumn(board, column, value) &&
            checkSquare(board, row, column, value)) {
                return true;
            }
            
            return false; 
        };

        const solve = (board) => { 
                let emptySpot = nextEmptySpot(board);
                let row = emptySpot[0];
                let col = emptySpot[1];
            
                if (row === -1){
                    return board;
                }
                for(let num = 1; num<=9; num++){
                    if (checkValue(board, row, col, num)){
                        board[row][col].number = num;
                        boards.push(JSON.parse(JSON.stringify( board )))
                        solve(board);
                    }
                }
            
                if (nextEmptySpot(board)[0] !== -1)
                    board[row][col].number = false;
                    boards.push(JSON.parse(JSON.stringify( board )))
                return board;
            }
        let new_sudoku = JSON.parse(JSON.stringify( sudoku ))
        for (let i = 0; i < sudoku.length; i++){
            for (let y = 0; y < sudoku.length; y++){
                if (new_sudoku[i][y].fixed === false){
                     new_sudoku[i][y].number = false
                }
                
            }
        }
        solve(JSON.parse(JSON.stringify( new_sudoku )))
        return boards
    }

    const getSudoku = (difficulty) => {
        if (gettingSudoku || isSolving || isChecking){
            return
        }
        setGettingSudoku(true)
        let new_sudoku = []
        fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < 9; i++){
                    let row = []
                    for (let y = 0; y < 9; y++){
                        if (data.board[y][i]){
                            row.push({number: data.board[y][i], clicked: false, color: "white", fixed: true})
                        }else{
                            row.push({number: false, clicked: false, color: "white", fixed: false})
                        }
                    }
                    new_sudoku.push(row)
                }
                setSudoku(new_sudoku)
                setGettingSudoku(false)
            });
    }
    return ( 
        <div>
             <div className="sudoku-grid" onMouseDown={() => setIsMouseDown(true)} onMouseUp={() => setIsMouseDown(false)}>
                {sudoku.map((row, y) => row.map((e, i) => <div key={`${y}/${i}`} onMouseDown={()=>{handleClick(y,i)}} onMouseOver={()=>{handleMouseOver(y,i)}}><Square color={sudoku[y][i].color} number={sudoku[y][i].number} clicked={sudoku[y][i].clicked} borders={hasBorders(y,i)} isFixed={sudoku[y][i].fixed}/></div>))}
            </div>
            <div className="menu-grid">
                {numberClicked && <div className="number-clicked">Number</div> || <div className="number" onClick={()=>{changeMenu("number")}}>Number</div>}
                {colorClicked && <div className="color-clicked">Color</div> || <div className="color" onClick={()=>{changeMenu("color")}}>Color</div>}
                {solveClicked && <div className="solve-clicked">Solve</div> || <div className="solve" onClick={()=>{changeMenu("solve")}}>Solve</div>}
                {getNewSudokuClicked && <div className="get-sudoku-clicked">New Sudoku</div> || <div className="get-sudoku" onClick={()=>{changeMenu("sudoku")}}>New Sudoku</div>}
                {<div className="delete" onClick={()=>{handleDelete()}}>Delete</div>}
                {<div className="check" onClick={()=>{handleCheck()}}>Check</div>}

                {colorClicked && <div className="menu-black" onClick={()=>changeColor("black")}></div>}
                {colorClicked && <div className="menu-gray" onClick={()=>changeColor("grey")}></div>}
                {colorClicked && <div className="menu-white" onClick={()=>changeColor("white")}></div>}
                {colorClicked && <div className="menu-green" onClick={()=>changeColor("green")}></div>}
                {colorClicked && <div className="menu-pink" onClick={()=>changeColor("pink")}></div>}
                {colorClicked && <div className="menu-orange" onClick={()=>changeColor("orange")}></div>}
                {colorClicked && <div className="menu-red" onClick={()=>changeColor("red")}></div>}
                {colorClicked && <div className="menu-yellow" onClick={()=>changeColor("yellow")}></div>}
                {colorClicked && <div className="menu-blue" onClick={()=>changeColor("blue")}></div>}

                {numberClicked && <div className="menu-1" onClick={()=>changeNumber(1)}>1</div> || <div className="menu-1" onClick={()=>changeNumber(1)} style={{visibility: "hidden"}}>1</div>}
                {numberClicked && <div className="menu-2" onClick={()=>changeNumber(2)}>2</div> || <div className="menu-2" onClick={()=>changeNumber(2)} style={{visibility: "hidden"}}>2</div>}
                {numberClicked && <div className="menu-3" onClick={()=>changeNumber(3)}>3</div> || <div className="menu-3" onClick={()=>changeNumber(3)} style={{visibility: "hidden"}}>3</div>}
                {numberClicked && <div className="menu-4" onClick={()=>changeNumber(4)}>4</div> || <div className="menu-4" onClick={()=>changeNumber(4)} style={{visibility: "hidden"}}>4</div>}
                {numberClicked && <div className="menu-5" onClick={()=>changeNumber(5)}>5</div> || <div className="menu-5" onClick={()=>changeNumber(5)} style={{visibility: "hidden"}}>5</div>}
                {numberClicked && <div className="menu-6" onClick={()=>changeNumber(6)}>6</div> || <div className="menu-6" onClick={()=>changeNumber(6)} style={{visibility: "hidden"}}>6</div>}
                {numberClicked && <div className="menu-7" onClick={()=>changeNumber(7)}>7</div> || <div className="menu-7" onClick={()=>changeNumber(7)} style={{visibility: "hidden"}}>7</div>}
                {numberClicked && <div className="menu-8" onClick={()=>changeNumber(8)}>8</div> || <div className="menu-8" onClick={()=>changeNumber(8)} style={{visibility: "hidden"}}>8</div>}
                {numberClicked && <div className="menu-9" onClick={()=>changeNumber(9)}>9</div> || <div className="menu-9" onClick={()=>changeNumber(9)} style={{visibility: "hidden"}}>9</div>}

                {solveClicked && <div className="menu-backtracking" onClick={()=>{backtracking()}}>Backtracking</div>}

                {getNewSudokuClicked && <div className="menu-easy" onClick={()=> getSudoku("easy")}>Easy</div>}
                {getNewSudokuClicked && <div className="menu-medium" onClick={()=> getSudoku("medium")}>Medium</div>}
                {getNewSudokuClicked && <div className="menu-hard" onClick={()=> getSudoku("hard")}>Hard</div>}

            </div>
        </div>
    )
}
const Square = ({ number, color, clicked, borders, isFixed}) => {
    var fixed = ""
    if (isFixed){
        fixed = "fixed"
    }else{
        fixed = "not-fixed"
    }
    if (clicked){
        return (
            <div className={`square clicked ${color} ${borders} ${fixed}`}>
                {number}
            </div> 
        )
    }
    return (
        <div className={`square ${color} ${borders} ${fixed}`}>
            {number}
        </div> 
    )
}
export default Sudoku;