"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Users,
  Flower2,
  FileText,
  Edit,
  Trash2,
  Check,
  Building2,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getClients, createClientData, updateClientData, deleteClientData } from "@/lib/data/clients";
import { getInvoices } from "@/lib/data/invoices";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Client } from "@/lib/types";
import { clientSchema } from "@/lib/validators";
import { useHydrated } from "@/lib/useHydrated";
import { TableSkeleton } from "@/components/ui/Skeleton";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const mounted = useHydrated();

  // Formulaire d'ajout
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addCity, setAddCity] = useState("Abidjan");

  // Formulaire de modification
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("Abidjan");

  const { clients } = useAppStore();

  const allClients = getClients();
  const allInvoices = getInvoices();

  const filteredClients = allClients.filter((client) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(q) ||
      client.email.toLowerCase().includes(q) ||
      client.phone.includes(q) ||
      client.address.toLowerCase().includes(q) ||
      client.city.toLowerCase().includes(q)
    );
  });

  // Action : Ajouter un client avec validation Zod
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = clientSchema.safeParse({
      name: addName.trim(),
      email: addEmail.trim() || "contact@client.cd",
      phone: addPhone.trim() || "+243 81 000 0000",
      address: addAddress.trim() || "Kinshasa, RDC",
      city: addCity.trim() || "Kinshasa",
      paymentTermsDays: 30,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Données client invalides");
      return;
    }

    createClientData(parsed.data);

    toast.success(`Client ${addName} ajouté avec succès !`);
    setShowAddModal(false);
    setAddName("");
    setAddEmail("");
    setAddPhone("");
    setAddAddress("");
  };

  // Action : Ouvrir le formulaire de modification
  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setEditAddress(client.address);
    setEditCity(client.city || "Kinshasa");
  };

  // Action : Enregistrer la modification avec validation Zod
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const parsed = clientSchema.safeParse({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      city: editCity.trim() || "Kinshasa",
      paymentTermsDays: editingClient.paymentTermsDays || 30,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Données client invalides");
      return;
    }

    updateClientData(editingClient.id, parsed.data);

    toast.success(`Fiche de ${editName} mise à jour !`);
    setEditingClient(null);
  };

  // Action : Supprimer un client (avec notification directe)
  const handleDeleteClient = (client: Client) => {
    deleteClientData(client.id);
    toast.success(`Client ${client.name} supprimé`);
  };

  if (!mounted) {
    return <TableSkeleton title="Chargement des clients..." />;
  }

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-3.5 sm:space-y-6 overflow-y-auto bg-white dark:bg-[#0F172A] transition-colors">
      {/* Fil d'Ariane & En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#F1F5F9] dark:border-[#1E293B]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
            <span>Gestion</span>
            <span>&gt;</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Clients</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Répertoire des Clients
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Gérez votre carnet d&apos;adresses, coordonnées et historique de facturation
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher nom, email, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#1E293B] transition-all"
            />
          </div>

          {/* Bouton Ajouter un client */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un client</span>
          </button>
        </div>
      </div>

      {/* Grille de Cartes Clients (Responsive & Design System Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#1E293B]/20">
            <Users className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Aucun client trouvé</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const clientInvoices = allInvoices.filter((i) => i.clientId === client.id);

            return (
              <div
                key={client.id}
                className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl sm:rounded-2xl p-3 sm:p-4.5 bg-white dark:bg-[#1E293B]/40 shadow-2xs space-y-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* En-tête : Avatar & Nom */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        <Flower2 className="w-4 h-4 text-emerald-300" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
                          {client.name}
                        </h3>
                        <div className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate">{client.city || "Kinshasa"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées : Email, Téléphone, Adresse */}
                  <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 border-t border-b border-neutral-100 dark:border-neutral-800 py-3">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate font-medium">{client.email}</span>
                    </div>

                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate font-medium">{client.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 truncate text-neutral-500 text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  </div>
                </div>

                {/* Pied de carte : Factures rattachées & Boutons Modifier / Supprimer */}
                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-neutral-400 text-[11px] font-semibold">
                    {clientInvoices.length} facture(s)
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Bouton Modifier */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(client)}
                      className="px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Modifier les coordonnées du client"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                      <span>Modifier</span>
                    </button>

                    {/* Bouton Supprimer */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClient(client)}
                      className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-neutral-400 hover:text-rose-600 hover:border-rose-300 transition-colors flex items-center justify-center shrink-0"
                      title="Supprimer le client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* VOLET LATÉRAL COULISSANT (Slide-over Drawer) : Nouveau Client / Modifier Client */}
      {(showAddModal || editingClient) && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Arrière-plan transparent cliquable pour refermer */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => {
              setShowAddModal(false);
              setEditingClient(null);
            }}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-12">
            <div className="w-screen max-w-md bg-white dark:bg-[#0F172A] border-l border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
              {/* En-tête du volet */}
              <div className="px-5 py-4 border-b border-[#F1F5F9] dark:border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">
                      {editingClient ? "Modifier la fiche client" : "Nouveau client"}
                    </h2>
                    <p className="text-[11px] text-neutral-400">
                      {editingClient ? editingClient.name : "Coordonnées de facturation RDC"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClient(null);
                  }}
                  className="w-8 h-8 rounded-xl border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Formulaire dans le volet coulissant */}
              <form
                onSubmit={editingClient ? handleSaveEdit : handleAddClient}
                className="flex-1 overflow-y-auto p-5 space-y-4 text-xs"
              >
                <div className="notched-input-group">
                  <label className="notched-label">Nom du client ou entreprise *</label>
                  <input
                    type="text"
                    required
                    value={editingClient ? editName : addName}
                    onChange={(e) =>
                      editingClient ? setEditName(e.target.value) : setAddName(e.target.value)
                    }
                    placeholder="Ex: Société Congolaise de Commerce"
                    className="notched-input"
                  />
                </div>

                <div className="notched-input-group">
                  <label className="notched-label">Email professionnel *</label>
                  <input
                    type="email"
                    required
                    value={editingClient ? editEmail : addEmail}
                    onChange={(e) =>
                      editingClient ? setEditEmail(e.target.value) : setAddEmail(e.target.value)
                    }
                    placeholder="contact@entreprise.cd"
                    className="notched-input"
                  />
                </div>

                <div className="notched-input-group">
                  <label className="notched-label">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={editingClient ? editPhone : addPhone}
                    onChange={(e) =>
                      editingClient ? setEditPhone(e.target.value) : setAddPhone(e.target.value)
                    }
                    placeholder="+243 81 234 5678"
                    className="notched-input"
                  />
                </div>

                <div className="notched-input-group">
                  <label className="notched-label">Adresse physique *</label>
                  <input
                    type="text"
                    required
                    value={editingClient ? editAddress : addAddress}
                    onChange={(e) =>
                      editingClient ? setEditAddress(e.target.value) : setAddAddress(e.target.value)
                    }
                    placeholder="Ex: Boulevard du 30 Juin, Gombe"
                    className="notched-input"
                  />
                </div>

                <div className="notched-input-group">
                  <label className="notched-label">Ville</label>
                  <input
                    type="text"
                    value={editingClient ? editCity : addCity}
                    onChange={(e) =>
                      editingClient ? setEditCity(e.target.value) : setAddCity(e.target.value)
                    }
                    placeholder="Ex: Kinshasa"
                    className="notched-input"
                  />
                </div>

                {/* Footer d'actions en bas du volet */}
                <div className="pt-6 border-t border-[#F1F5F9] dark:border-[#1E293B] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingClient(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    {editingClient ? "Enregistrer les modifications" : "Ajouter le client"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
