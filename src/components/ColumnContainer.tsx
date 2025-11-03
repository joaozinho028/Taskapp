import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  tasks: Task[];
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const ColumnContainer = (props: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteColumn(column.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-900
        w-[350px] h-[500px]
        border-2 border-rose-500
        max-h-[500px] rounded-md
        flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-900
        w-[350px] h-[500px]
        max-h-[500px] rounded-md
        flex flex-col"
    >
      {/* Column Title*/}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-black
                text-md font-bold
                h-[60px] p-3    
                cursor-grab
                rounded-b-none
                border-columnBackgroundColor border-4
                flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div
            className="flex
                        justify-center items-center
                        bg-gray-900
                        px-2.5 py-1 text-sm rounded-full"
          >
            1
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              autoFocus
              className="bg-black text-white focus:border-rose-500 border border-gray-700 rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
          className="stroke-gray-500
                    hover:stroke-white
                    hover:bg-gray-800
                    rounded py-2 px-2"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Column Task Container*/}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Column Footer*/}
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 items-center
            border-columnBackgroundColor border2 rounded-md p-2
            border-x-columnBackgroundColor
            hover:bg-gray-800 hover:text-rose-500
            active:bg-black"
      >
        <PlusIcon />
        Nova Tarefa
      </button>

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Excluir Coluna"
        message={`Excluir a coluna ${column.title}?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ColumnContainer;
