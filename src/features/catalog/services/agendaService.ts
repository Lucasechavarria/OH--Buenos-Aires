// Agenda Service
// src/features/catalog/services/agendaService.ts

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
}

export const getEvents = async (): Promise<Event[]> => {
  // Por ahora devolvemos un mock ya que la API no existe físicamente aún
  return [
    { id: "e1", title: "Sunset Sessions", date: "Sábado 10/05 - 19:00", location: "Rooftop OH!", category: "Música" },
    { id: "e2", title: "Fashion Talk: Primavera", date: "Jueves 15/05 - 18:30", location: "Plaza Central", category: "Moda" },
    { id: "e3", title: "Wine Tasting Experience", date: "Viernes 16/05 - 20:00", location: "Área Gastronómica", category: "Gastronomía" },
  ];
};
