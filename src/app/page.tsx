"use client";
import Input from "@/components/UI/Input";
import { socket } from "@/socket";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [roomID, setRoomID] = useState<string>();
  const [inputRoomID, setInputRoomID] = useState<string>("");
  const [name, setName] = useState<string>("");

  const createRoom = () =>
    socket.emit("create_room", name, (roomID: string) => setRoomID(roomID));
  const joinRoom = () =>
    socket.emit("join_room", name, inputRoomID, (roomID: string | undefined) =>
      setRoomID(roomID)
    );

  useEffect(() => {
    if (roomID) router.push(`/room/${roomID}`);
  }, [roomID, router]);

  return (
    <div className="flex flex-col justify-center items-center gap-6 w-screen h-screen">
      <Input value={name} setValueAction={setName} placeholder="Name" />
      <div className="flex flex-col items-center gap-4">
        <button
          className={`bg-black w-32 h-16 rounded-xl transition-colors duration-200 hover:bg-[#000000aa] ${
            name.trim().length === 0 ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={createRoom}
          disabled={name.trim().length === 0}
        >
          Create Room
        </button>
        <Input
          value={inputRoomID}
          setValueAction={setInputRoomID}
          placeholder="ID"
          disabled={name.trim().length === 0}
        />
        <button
          className={`bg-black w-32 h-16 rounded-xl transition-colors duration-200 hover:bg-[#000000aa] ${
            name.trim().length === 0 ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={joinRoom}
          disabled={name.trim().length === 0}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
