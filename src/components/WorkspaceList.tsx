import React, { useState } from "react";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import { Workspace } from "../types";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onSelect: (id: string | number) => void;
  onAdd: (name: string) => void;
  onDelete?: (id: string | number) => void;
  onEditName?: (id: string | number, newName: string) => void;
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({
  workspaces,
  onSelect,
  onAdd,
  onDelete,
  onEditName,
}) => {
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<
    string | number | null
  >(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const handleEditClick = (id: string | number, currentName: string) => {
    setEditingId(id);
    setEditingValue(currentName);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(e.target.value);
  };

  const handleEditSave = (id: string | number) => {
    if (editingValue.trim() && onEditName) {
      onEditName(id, editingValue.trim());
    }
    setEditingId(null);
    setEditingValue("");
  };

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string | number
  ) => {
    if (e.key === "Enter") {
      handleEditSave(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingValue("");
    }
  };

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
    }
  };

  const handleDeleteClick = (id: string | number) => {
    setWorkspaceToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (onDelete && workspaceToDelete !== null) {
      onDelete(workspaceToDelete);
    }
    setShowModal(false);
    setWorkspaceToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setWorkspaceToDelete(null);
  };

  return (
    <div className="p-8 flex flex-col items-center bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Áreas de Trabalho</h1>
      <div className="w-full max-w-md mb-6">
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-700 bg-gray-900 text-white rounded px-2 py-1"
            placeholder="Nova área de trabalho"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-600"
            onClick={handleAdd}
          >
            Adicionar
          </button>
        </div>
        {workspaces.length === 0 ? (
          <div className="mb-4 text-gray-300 w-full">
            Nenhuma área de trabalho encontrada.
          </div>
        ) : (
          <ul className="w-full">
            {workspaces.map((ws) => (
              <li key={ws.id} className="mb-2">
                <div className="flex items-center bg-gray-800 text-white rounded hover:bg-gray-700 p-3 w-full">
                  {editingId === ws.id ? (
                    <input
                      className="flex-1 bg-gray-700 text-white rounded px-2 py-1 mr-2 outline-none border border-gray-600"
                      value={editingValue}
                      autoFocus
                      onChange={handleEditChange}
                      onBlur={() => handleEditSave(ws.id)}
                      onKeyDown={(e) => handleEditKeyDown(e, ws.id)}
                    />
                  ) : (
                    <span
                      className="flex-1 cursor-pointer text-left"
                      onClick={() => onSelect(ws.id)}
                    >
                      {ws.name}
                    </span>
                  )}
                  <button
                    className="p-2 flex items-center justify-center hover:text-blue-400"
                    title="Editar área de trabalho"
                    onClick={() => handleEditClick(ws.id, ws.name)}
                  >
                    <EditIcon className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                  </button>
                  <button
                    className="p-2 flex items-center justify-center hover:text-red-500"
                    title="Excluir área de trabalho"
                    onClick={() => handleDeleteClick(ws.id)}
                  >
                    <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg text-white w-80">
            <div className="mb-4">
              Tem certeza que deseja excluir esta área de trabalho?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-700 hover:bg-gray-600"
                onClick={cancelDelete}
              >
                Não
              </button>
              <button
                className="px-4 py-1 rounded bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
