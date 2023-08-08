import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import { useUsers } from "y-presence";
import { useMultiplayerState } from "./hooks/useMultiplayerState";
import "./styles.css";
import { awareness, roomID, enterRoom } from "./store";

function Editor({ roomId }) {
  const fileSystemEvents = useFileSystem();
  const { onMount, ...events } = useMultiplayerState(roomId);

  return (
    <Tldraw
      showMenu={false}
      showZoom={false}
      autofocus
      disableAssets
      showPages={false}
      onMount={onMount}
      {...fileSystemEvents}
      {...events}
    />
  );
}

function Info() {
  let i = 1;
  const handleEnterRoom = () => {
    i += 1;
    let newRoomID = i; // 원하는 새로운 방 ID로 변경해주세요
    enterRoom(newRoomID);
    console.log(newRoomID);
  };
  const users = useUsers(awareness);

  return (
    <div className="absolute p-md">
      <div className="flex space-between">
        <button onClick={handleEnterRoom}>방 입장</button>
        <span>Number of connected users: {users.size}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="tldraw">
      <Info />
      <Editor roomId={roomID} />
    </div>
  );
}
