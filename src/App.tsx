import React, { useEffect, useState } from "react";
import "./App.css";
import KanbanBoard from "./components/KanbanBoard";
import WorkspaceList from "./components/WorkspaceList";
import { Column, Id, Workspace } from "./types";

const initialWorkspaces: Workspace[] = [
  { id: 1, name: "Pessoal", columns: [] },
  { id: 2, name: "Trabalho", columns: [] },
];

const App: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem("workspaces");
    return saved ? JSON.parse(saved) : initialWorkspaces;
  });
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<Id | null>(
    () => {
      const saved = localStorage.getItem("selectedWorkspaceId");
      return saved ? JSON.parse(saved) : null;
    }
  );

  // Salvar workspaces e área selecionada no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem("workspaces", JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem(
      "selectedWorkspaceId",
      JSON.stringify(selectedWorkspaceId)
    );
  }, [selectedWorkspaceId]);

  const handleAddWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: Date.now(),
      name,
      columns: [],
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
  };

  const handleSelectWorkspace = (id: Id) => {
    setSelectedWorkspaceId(id);
  };

  const handleUpdateColumns = (columns: Column[]) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === selectedWorkspaceId ? { ...ws, columns } : ws
      )
    );
  };

  const handleDeleteWorkspace = (id: Id) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
    if (selectedWorkspaceId === id) {
      setSelectedWorkspaceId(null);
    }
  };

  const handleEditWorkspaceName = (id: Id, newName: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id ? { ...ws, name: newName } : ws))
    );
  };

  const selectedWorkspace = workspaces.find(
    (ws) => ws.id === selectedWorkspaceId
  );

  return (
    <div className="min-h-screen bg-black">
      {selectedWorkspace ? (
        <div>
          <button
            className="m-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            onClick={() => setSelectedWorkspaceId(null)}
          >
            Voltar
          </button>
          <KanbanBoard
            columns={selectedWorkspace.columns}
            onColumnsChange={handleUpdateColumns}
          />
        </div>
      ) : (
        <WorkspaceList
          workspaces={workspaces}
          onSelect={handleSelectWorkspace}
          onAdd={handleAddWorkspace}
          onDelete={handleDeleteWorkspace}
          onEditName={handleEditWorkspaceName}
        />
      )}
    </div>
  );
};

export default App;
