import React, { useState } from "react";
import { Column, Id } from "../types";
import Calendar from "./Calendar";
import KanbanBoard from "./KanbanBoard";
import Notes from "./NotesSimple";

interface TabContainerProps {
  workspaceId: Id;
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
}

type TabType = "kanban" | "calendar" | "notes";

const TabContainer: React.FC<TabContainerProps> = ({
  workspaceId,
  columns,
  onColumnsChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("kanban");

  const tabs = [
    { id: "kanban" as TabType, label: "Kanban" },
    { id: "calendar" as TabType, label: "Eventos" },
    { id: "notes" as TabType, label: "Anotações" },
  ];

  return (
    <div className="h-full">
      {/* Navegação das abas */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "text-blue-400 border-blue-400 bg-gray-800"
                  : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="flex-1">
        {activeTab === "kanban" && (
          <KanbanBoard columns={columns} onColumnsChange={onColumnsChange} />
        )}
        {activeTab === "calendar" && <Calendar workspaceId={workspaceId} />}
        {activeTab === "notes" && <Notes workspaceId={workspaceId} />}
      </div>
    </div>
  );
};

export default TabContainer;
