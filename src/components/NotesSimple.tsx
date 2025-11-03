import React, { useEffect, useState } from "react";
import EditIcon from "../icons/EditIcon";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import { Id, Note } from "../types";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "./Notes.css";

interface NotesProps {
  workspaceId: Id;
}

const Notes: React.FC<NotesProps> = ({ workspaceId }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(`notes-${workspaceId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem(`notes-${workspaceId}`, JSON.stringify(notes));
  }, [notes, workspaceId]);

  const handleSaveNote = (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();

    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? {
                ...noteData,
                id: editingNote.id,
                createdAt: editingNote.createdAt,
                updatedAt: now,
              }
            : note
        )
      );
    } else {
      const newNote: Note = {
        ...noteData,
        id: Date.now(),
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete.id));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const cancelDeleteNote = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const openModal = (note?: Note) => {
    setEditingNote(note || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para converter markdown simples em HTML
  const parseSimpleMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Anotações</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <PlusIcon />
          Nova Anotação
        </button>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Pesquisar anotações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Lista de anotações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            {searchTerm
              ? "Nenhuma anotação encontrada"
              : "Nenhuma anotação criada ainda"}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                  {note.title}
                </h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => openModal(note)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                    title="Editar"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(note)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                    title="Excluir"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

              <div
                className="note-editor text-gray-300 text-sm mb-3 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: parseSimpleMarkdown(note.content),
                }}
              />

              <div className="text-xs text-gray-500">
                <div>Criado: {formatDate(note.createdAt)}</div>
                {note.updatedAt !== note.createdAt && (
                  <div>Editado: {formatDate(note.updatedAt)}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de edição/criação */}
      {isModalOpen && (
        <SimpleNoteModal
          note={editingNote}
          onSave={handleSaveNote}
          onClose={closeModal}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Excluir Anotação"
        message={
          noteToDelete
            ? `Tem certeza que deseja excluir a anotação "${noteToDelete.title}"?\n\nEsta ação não pode ser desfeita.`
            : ""
        }
        onConfirm={confirmDeleteNote}
        onCancel={cancelDeleteNote}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

interface SimpleNoteModalProps {
  note: Note | null;
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

const SimpleNoteModal: React.FC<SimpleNoteModalProps> = ({
  note,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Título é obrigatório");
      return;
    }

    onSave({
      title: title.trim(),
      content: content,
    });
  };

  // Função para inserir formatação no textarea
  const insertFormatting = (
    startTag: string,
    endTag: string,
    placeholder: string = ""
  ) => {
    const textarea = document.getElementById(
      "content-textarea"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    const textToInsert = selectedText || placeholder;
    const newText = `${startTag}${textToInsert}${endTag}`;
    const newValue =
      textarea.value.substring(0, start) +
      newText +
      textarea.value.substring(end);

    setContent(newValue);

    // Restaurar foco e posicionar cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + startTag.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-white">
          {note ? "Editar Anotação" : "Nova Anotação"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Título da anotação"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Conteúdo
            </label>

            {/* Barra de ferramentas simplificada */}
            <div className="bg-gray-700 p-2 rounded-t-lg border border-gray-600 flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => insertFormatting("**", "**", "texto em negrito")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold"
                title="Negrito (**texto**)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("*", "*", "texto em itálico")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm italic"
                title="Itálico (*texto*)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("__", "__", "texto sublinhado")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm underline"
                title="Sublinhado (__texto__)"
              >
                U
              </button>
              <div className="border-l border-gray-500 mx-1"></div>
              <button
                type="button"
                onClick={() => insertFormatting("# ", "", "Título Principal")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold"
                title="Título H1 (# texto)"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("## ", "", "Subtítulo")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold"
                title="Título H2 (## texto)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("### ", "", "Título Menor")}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold"
                title="Título H3 (### texto)"
              >
                H3
              </button>
            </div>

            {/* Textarea simples */}
            <textarea
              id="content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[300px] px-3 py-2 bg-gray-700 text-white rounded-b-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-y"
              style={{
                borderTop: "none",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                direction: "ltr",
                textAlign: "left",
              }}
              placeholder="Digite o conteúdo da anotação...&#10;&#10;Use os botões acima para formatação:&#10;**negrito** *itálico* __sublinhado__&#10;# Título 1&#10;## Título 2&#10;### Título 3"
            />

            <div className="text-xs text-gray-400 mt-1">
              Use: **negrito** *itálico* __sublinhado__ # Título 1 ## Título 2
              ### Título 3
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              {note ? "Salvar" : "Criar"}
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

export default Notes;
