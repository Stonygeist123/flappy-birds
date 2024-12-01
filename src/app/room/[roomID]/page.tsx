"use client";
import { socket } from "@/socket";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page() {
  const { roomID } = useParams();
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState(false);
  const [users, setUsers] = useState<Array<string>>([]);

  useEffect(() => {
    socket.on("start", (users: Array<string>) => {
      setStart(true);
      setUsers(users);
    });
  }, []);

  const handleReady = () => {
    socket.emit("ready", roomID, (ready: boolean) => setReady(ready));
  };

  useEffect(() => {
    if (start) {
      console.log(users.length);
    }
  }, [start, users.length]);

  return start ? (
    <div className="w-screen h-screen">
      <div className={`flex gap-2 absolute right-4 top-4 h-8 items-center`}>
        {users.map((u, i) => (
          <span
            key={i}
            className="relative bg-black rounded-xl min-w-12 p-2 text-center"
          >
            {u}
            {i < users.length ? null : ","}
          </span>
        ))}
      </div>
      <div className="absolute w-screen h-screen">
        {users.map((_, i) => (
          <Image
            key={i}
            src="/images/bird.png"
            alt="bird"
            width={175}
            height={175}
            className={`absolute left-10 top-[300px]`}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-8 w-screen h-screen">
      <button
        className="bg-black w-32 h-16 rounded-xl transition-colors duration-200 hover:bg-[#000000aa]"
        onClick={handleReady}
      >
        {ready ? "Cancel" : "Ready"}
      </button>
    </div>
  );
}
