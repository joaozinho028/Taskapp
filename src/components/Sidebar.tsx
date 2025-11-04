import React from "react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
}) => {
  const menuItems = [
    {
      id: "Workspaces",
      label: "Workspaces",
      icon: "🏢",
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: "📅",
    },
  ];

  const socialLinks = [
    {
      id: "whatsapp",
      label: "WhatsApp Web",
      icon: "📲",
      href: "https://wa.me/",
      external: true,
    },
    {
      id: "email",
      label: "Email Google",
      icon: "📤",
      href: "mailto:",
      external: true,
    },
  ];

  const handleItemClick = (item: any) => {
    if (item.external) {
      window.open(item.href, "_blank");
    } else {
      onSectionChange(item.id);
      // Fecha o sidebar no mobile após selecionar uma seção
      if (window.innerWidth < 1024) {
        onToggle();
      }
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "w-64" : "w-0"} 
          fixed left-0 top-0 z-50 lg:static lg:z-auto`}
      >
        <div
          className={`flex flex-col h-full ${
            isOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
          } transition-opacity duration-300`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white whitespace-nowrap">
                TaskApp
              </h2>
              <button
                onClick={onToggle}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Menu Principal */}
          <div className="flex-1 p-4 overflow-hidden">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            {/* Separador */}
            <div className="my-6">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="px-3 text-xs font-medium text-gray-400 uppercase whitespace-nowrap">
                  Comunicação
                </span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>
            </div>

            {/* Links de Redes Sociais */}
            <nav className="space-y-2">
              {socialLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">↗</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-500 text-center">
              TaskApp v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
