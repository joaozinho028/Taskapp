import React, { useEffect, useState } from "react";
import EditIcon from "../icons/EditIcon";
import GridIcon from "../icons/GridIcon";
import ListIcon from "../icons/ListIcon";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import { Event, Id } from "../types";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface CalendarProps {
  workspaceId: Id;
}

const Calendar: React.FC<CalendarProps> = ({ workspaceId }) => {
  // Função utilitária para criar datas sem problemas de timezone
  const createDateFromString = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
  };

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(`events-${workspaceId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">(() => {
    const saved = localStorage.getItem(`calendar-layout-${workspaceId}`);
    return (saved as "list" | "grid") || "list";
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  useEffect(() => {
    localStorage.setItem(`events-${workspaceId}`, JSON.stringify(events));
  }, [events, workspaceId]);

  useEffect(() => {
    localStorage.setItem(`calendar-layout-${workspaceId}`, layoutMode);
  }, [layoutMode, workspaceId]);

  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? { ...eventData, id: editingEvent.id }
            : event
        )
      );
    } else {
      const newEvent: Event = {
        ...eventData,
        id: Date.now(),
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: Id) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setEventToDelete(event);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      setEvents((prev) =>
        prev.filter((event) => event.id !== eventToDelete.id)
      );
    }
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const cancelDeleteEvent = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const openModal = (event?: Event) => {
    setEditingEvent(event || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // Função para formatar data (corrigida para evitar problemas de timezone)
  const formatDate = (dateString: string) => {
    const date = createDateFromString(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para obter eventos do mês atual (corrigida)
  const getEventsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return events.filter((event) => {
      const eventDate = createDateFromString(event.startDate);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  // Navegar entre meses
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthEvents = getEventsForMonth();

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Calendário</h2>
        <div className="flex items-center gap-4">
          {/* Botões de alternância de layout */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setLayoutMode("list")}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                layoutMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <ListIcon />
              Lista
            </button>
            <button
              onClick={() => setLayoutMode("grid")}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                layoutMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <GridIcon />
              Grid
            </button>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          >
            <PlusIcon />
            Novo Evento
          </button>
        </div>
      </div>

      {/* Navegação do calendário */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          ←
        </button>
        <h3 className="text-xl font-semibold">
          {currentDate.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={() => navigateMonth("next")}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          →
        </button>
      </div>

      {/* Eventos - Layout alternável */}
      {monthEvents.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          Nenhum evento neste mês
        </p>
      ) : (
        <div
          className={
            layoutMode === "list"
              ? "space-y-4"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          }
        >
          {monthEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-gray-800 p-4 rounded-lg border border-gray-700 ${
                layoutMode === "grid" ? "h-fit min-h-[140px] flex flex-col" : ""
              }`}
            >
              {layoutMode === "list" ? (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{event.name}</h4>
                    <p className="text-gray-300 text-sm">
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </p>
                    {event.observation && (
                      <p className="text-gray-400 text-sm mt-2">
                        {event.observation}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(event)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-base line-clamp-2">
                      {event.name}
                    </h4>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => openModal(event)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <p className="text-gray-300 text-sm">
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </p>
                    {event.observation && (
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                        {event.observation}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <EventModal
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={closeModal}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Excluir Evento"
        message={
          eventToDelete
            ? `Tem certeza que deseja excluir o evento "${
                eventToDelete.name
              }"?\n\nPeríodo: ${formatDate(
                eventToDelete.startDate
              )} - ${formatDate(
                eventToDelete.endDate
              )}\n\nEsta ação não pode ser desfeita.`
            : ""
        }
        onConfirm={confirmDeleteEvent}
        onCancel={cancelDeleteEvent}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

interface EventModalProps {
  event: Event | null;
  onSave: (event: Omit<Event, "id">) => void;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onSave, onClose }) => {
  // Função utilitária para criar datas sem problemas de timezone (local)
  const createDateFromString = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Função para obter data atual no formato YYYY-MM-DD sem problemas de timezone
  const getTodayString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [name, setName] = useState(event?.name || "");
  const [startDate, setStartDate] = useState(
    event?.startDate || getTodayString()
  );
  const [endDate, setEndDate] = useState(event?.endDate || getTodayString());
  const [observation, setObservation] = useState(event?.observation || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Nome do evento é obrigatório");
      return;
    }

    // Validação de datas usando a função utilitária
    const startDateObj = createDateFromString(startDate);
    const endDateObj = createDateFromString(endDate);

    if (startDateObj > endDateObj) {
      alert("Data de início deve ser anterior ou igual à data de fim");
      return;
    }

    onSave({
      name: name.trim(),
      startDate,
      endDate,
      observation: observation.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-white">
          {event ? "Editar Evento" : "Novo Evento"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Nome do evento"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Data de Início *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Data de Fim *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Observação
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Observações sobre o evento"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              {event ? "Salvar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Calendar;
