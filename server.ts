import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);

    const rooms = new Map<string, Array<User>>();
    io.on("connection", (socket) => {
        socket.on("create_room", (name: string, callback: (roomID: string) => void) => {
            const ID = (Math.random() + 1).toString(36).substring(8);
            socket.join(ID);
            const user: User = { name, id: socket.id, ready: false };
            rooms.set(ID, [user]);
            callback(ID);
        });

        socket.on("join_room", (name: string, roomID: string, callback: (roomID: string | undefined) => void) => {
            if (!rooms.has(roomID))
                callback(undefined);
            else {
                socket.join(roomID);
                const user: User = { name, id: socket.id, ready: false };
                rooms.get(roomID)!.push(user);
                callback(roomID);
            }
        });

        socket.on('ready', (roomID: string, callback: (ready: boolean) => void) => {
            if (!socket.rooms.has(roomID))
                callback(false);
            else {
                const users = rooms.get(roomID)!;
                const ready = !users.find(u => u.id === socket.id)!.ready;
                const newUsers = [...users];
                newUsers[newUsers.findIndex(u => u.id === socket.id)].ready = ready;
                rooms.set(roomID, newUsers);
                if (users.every(u => u.ready))
                    io.to(roomID).emit("start", users.map(u => u.name));
                callback(ready);
            }
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});