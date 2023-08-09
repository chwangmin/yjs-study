import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import { useUsers } from "y-presence";
import { useMultiplayerState } from "./hooks/useMultiplayerState";
import "./styles.css";
import { useState, useRef } from "react";

function Editor({ roomId }) {
  console.log("Editor gogogogogogogo");
  const fileSystemEvents = useFileSystem();
  const { onMount, ...events } = useMultiplayerState(roomId);

  const appRef = useRef(null);

  if (appRef.currrent) {
    appRef.current.reset();
  }

  const handleMount = (app) => {
    appRef.current = app;
    console.log("!1111111111111111111111", app);
    onMount(app); // Call the original onMount function
    console.log(appRef.current.value);
  };

  return (
    <div key={roomId}>
      <Tldraw
        showMenu={false}
        showZoom={false}
        autofocus
        disableAssets
        showPages={false}
        onMount={handleMount} // 여기서 onMount 함수를 호출하며 app 인자를 전달합니다.
        {...fileSystemEvents}
        {...events}
      />
    </div>
  );
}

function Info({ onEnterRoom }) {
  return (
    <div className="absolute p-md">
      <div className="flex space-between">
        <button onClick={onEnterRoom}>방 입장</button>
      </div>
    </div>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState(2);

  const handleEnterRoom = () => {
    setRoomId((prevRoomId) => prevRoomId + 1);
  };
  return (
    <div className="tldraw">
      <Info onEnterRoom={handleEnterRoom} />
      <Editor roomId={roomId} />
    </div>
  );
}
