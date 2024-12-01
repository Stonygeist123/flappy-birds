"use client";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [roomID, setRoomID] = useState<string>();
  const [inputRoomID, setInputRoomID] = useState<string>("");

  const createRoom = () =>
    socket.emit("create_room", (roomID: string) => setRoomID(roomID));
  const joinRoom = () =>
    socket.emit("join_room", inputRoomID, (roomID: string | undefined) =>
      setRoomID(roomID)
    );

  useEffect(() => {
    if (roomID) router.push(`/room/${roomID}`);
  }, [roomID, router]);

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-screen h-screen">
      <button
        className="relative bg-black w-32 h-16 rounded-xl transition-colors duration-200 hover:bg-[#000000aa]"
        onClick={createRoom}
      >
        Create Room
      </button>
      <input
        value={inputRoomID}
        onChange={(e) => setInputRoomID(e.currentTarget.value)}
        placeholder="ID"
        className="text-black"
      />
      <button
        className="relative bg-black w-32 h-16 rounded-xl transition-colors duration-200 hover:bg-[#000000aa]"
        onClick={joinRoom}
      >
        Join Room
      </button>
    </div>
  );
}
