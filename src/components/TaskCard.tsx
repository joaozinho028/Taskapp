import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id);
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
        className="bg-gray-800 opacity-30 p-2.5 h-[100px]
        min-h-[100px] items-center flex flex-left rounded-xl border-2
        border-rose-500 cursor-grab relative"
      />
    );
  }

  if (editMode) {
    return (
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className="bg-gray-800 p-2.5 h-[100px]
            min-h-[100px] items-center flex flex-left rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500
            cursor-grab relative task"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded
                bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Conteúdo da tarefa aqui"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.shiftKey && e.key == "Enter") toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      onClick={toggleEditMode}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 p-2.5 h-[100px]
        min-h-[100px] items-center flex flex-left rounded-xl
        hover:ring-2 hover:ring-inset hover:ring-rose-500
        cursor-grab relative"
    >
      <p
        className="my-auto h-[90%] w-full overflow-y-auto
        overflow-x-hidden whitespace-pre-wrap"
      >
        {" "}
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
          className="stroke-white absolute right-4 top-1/2
                    -translate-y-1/2 bg-gray-900 p-2 rounded"
        >
          <TrashIcon />
        </button>
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Excluir Tarefa"
        message={`Excluir a tarefa ${task.content}?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default TaskCard;
