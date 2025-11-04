import React, { useEffect, useState } from "react";
import "./App.css";
import Agenda from "./components/Agenda";
import Sidebar from "./components/Sidebar";
import TabContainer from "./components/TabContainer";
import WorkspaceList from "./components/WorkspaceList";
import MenuIcon from "./icons/MenuIcon";
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
  const [activeSection, setActiveSection] = useState<string>("Workspaces");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    // No desktop, inicia aberto; no mobile, inicia fechado
    return window.innerWidth >= 1024;
  });

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

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === "Workspaces") {
      setSelectedWorkspaceId(null); // Volta para lista de workspaces
    }
    setSidebarOpen(false); // Fecha sidebar no mobile
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const selectedWorkspace = workspaces.find(
    (ws) => ws.id === selectedWorkspaceId
  );

  const renderMainContent = () => {
    if (activeSection === "agenda") {
      return (
        <>
          <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center p-4">
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded mr-3 transition-colors"
                title="Menu"
              >
                <MenuIcon />
              </button>
              <h1 className="text-xl font-semibold text-white">Agenda</h1>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Agenda />
          </div>
        </>
      );
    }

    // Para seção Workspaces
    if (selectedWorkspace) {
      return (
        <>
          <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  title="Menu"
                >
                  <MenuIcon />
                </button>
                <button
                  className="px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  onClick={() => setSelectedWorkspaceId(null)}
                >
                  Voltar
                </button>
              </div>
              <h1 className="text-xl font-semibold text-white">
                {selectedWorkspace.name}
              </h1>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <TabContainer
              workspaceId={selectedWorkspace.id}
              columns={selectedWorkspace.columns}
              onColumnsChange={handleUpdateColumns}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded mr-3 transition-colors"
              title="Menu"
            >
              <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold text-white">Workspaces</h1>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <WorkspaceList
            workspaces={workspaces}
            onSelect={handleSelectWorkspace}
            onAdd={handleAddWorkspace}
            onDelete={handleDeleteWorkspace}
            onEditName={handleEditWorkspaceName}
          />
        </div>
      </>
    );
  };

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default App;
