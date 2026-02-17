// src/components/RoomCard.tsx
import { emitRoomAction } from "../admin/lib/roomActions";

type Room = {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  badge?: string;
  meta: string;
};

type Props = {
  room: Room;
};

export function RoomCard({ room }: Props) {
  return (
    <article
      className="
        group
        relative
        h-full
        flex
        flex-col
        rounded-[var(--radius-card)]
        bg-white
        overflow-hidden
        shadow-[var(--shadow-card)]
        border border-black/5
        transition
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
      "
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {room.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-[rgb(var(--gold))] px-3 py-1 text-xs font-semibold text-white">
            {room.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-[rgb(var(--muted))]">
          {room.type}
        </p>

        <h3 className="mt-1 font-[var(--font-serif)] text-xl">{room.name}</h3>

        <p className="mt-2 text-sm text-[rgb(var(--muted))]">{room.meta}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-semibold">
            ${room.price}
            <span className="text-sm font-normal text-[rgb(var(--muted))]">
              {" "}
              / night
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emitRoomAction("details", room)}
              className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/5 transition"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => emitRoomAction("reserve", room)}
              className="rounded-full bg-[rgb(var(--gold))] px-4 py-2 text-sm text-[#0b1220] font-semibold hover:opacity-90 transition"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
