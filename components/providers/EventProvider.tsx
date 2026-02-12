import { IEvent } from "@/types/event";
import { createContext, useContext, useState } from "react";

interface EventContextProps {
  newEvent: IEvent | null;
  updateNewEvent: (val: IEvent) => void;
  clearNewEvent: () => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const useEvent = () => {
  const ctx = useContext(EventContext);
  if (!ctx) {
    throw new Error("useEvent must be within EventProvider");
  }
  return ctx;
};

interface EventProviderProps {
  children: React.ReactNode;
}

const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [newEvent, setNewEvent] = useState<IEvent | null>(null);

  const updateNewEvent = (data: IEvent) => setNewEvent(data);
  const clearNewEvent = () => setNewEvent(null);

  return (
    <EventContext.Provider value={{ newEvent, updateNewEvent, clearNewEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
