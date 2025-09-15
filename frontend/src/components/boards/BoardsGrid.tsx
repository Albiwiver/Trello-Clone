import { BoardTile } from "./BoardTitle"
import { Board } from "@/types/board"


export const BoardsGrid = ({boards, onEdit, onDeleted}: {boards: Board[], onEdit: (b:Board) => void, onDeleted: (id:string) => void}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-[1580px] gap-4 mt-4 auto-rows-fr">
        {boards.map(board => <BoardTile key={board.id} board={board} onEdit={onEdit} onDeleted={onDeleted}/>)}
    </div>
  )
}
