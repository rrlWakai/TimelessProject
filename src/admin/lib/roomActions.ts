// src/lib/roomActions.ts
export type RoomActionRoom = {
  id: string;
  type: string;
  name: string;
  image: string;
  price: number;
  badge?: string;
  meta: string;
};

export type RoomActionType = "reserve" | "details";

export type RoomActionEventDetail = {
  type: RoomActionType;
  room: RoomActionRoom;
};

const EVENT_NAME = "timeless:room-action";

export function emitRoomAction(type: RoomActionType, room: RoomActionRoom) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<RoomActionEventDetail>(EVENT_NAME, {
      detail: { type, room },
    }),
  );
}

export function onRoomAction(
  handler: (detail: RoomActionEventDetail) => void,
) {
  if (typeof window === "undefined") return () => {};

  const listener = (e: Event) => {
    const ev = e as CustomEvent<RoomActionEventDetail>;
    if (!ev.detail) return;
    handler(ev.detail);
  };

  window.addEventListener(EVENT_NAME, listener as EventListener);
  return () => window.removeEventListener(EVENT_NAME, listener as EventListener);
}
