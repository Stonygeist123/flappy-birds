"use client";
import { socket } from "@/socket";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { roomID } = useParams();
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState(false);
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    socket.on("start", (users: Array<User>) => {
      setStart(true);
      setUsers(users);
    });
  }, []);

  const handleReady = () => {
    socket.emit("ready", roomID, (ready: boolean) => setReady(ready));
  };

  useEffect(() => {
    if (roomID) router.push(`/room/${roomID}`);
  }, [roomID, router]);

  useEffect(() => {
    if (!users.some((u) => u.id === socket.id))
      socket.emit("join_room", roomID, () => router.refresh());
  }, [roomID, router, users]);

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-screen h-screen">
      {start ? (
        <p>Started</p>
      ) : (
        <button
          className="relative bg-black w-32 h-16 rounded-xl transition-colors duration-200 hover:bg-[#000000aa]"
          onClick={handleReady}
        >
          {ready ? "Cancel" : "Ready"}
        </button>
      )}
    </div>
  );
}
