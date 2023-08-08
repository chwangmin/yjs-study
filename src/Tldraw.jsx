import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import { useUsers } from "y-presence";
import { useMultiplayerState } from "./hooks/useMultiplayerState";
import "./styles.css";
import { useState, useRef, useEffect } from "react";

function Editor({ roomId }) {
  console.log("Editor gogogogogogogo");
  const fileSystemEvents = useFileSystem();
  const { onMount, onChange, onUndo, onRedo, onChangePresence } =
    useMultiplayerState(roomId);

  const appRef = useRef(null);
  let reson2;
  let user2;

  useEffect(() => {
    if (appRef.current) {
      console.log("alsdfkj;aljf;adksj;flksaj;fdlkj");
      handleMount(appRef.current);
      handleChange(appRef.current, reson2);
      handleUndo();
      handleRedo();
      handleChangePresence(appRef.current, user2);
    }
  });

  const handleMount = (app) => {
    appRef.current = app;
    console.log("!1111111111111111111111", app);
    onMount(app); // Call the original onMount function
    //appRef.current.reset();
  };

  const handleChange = (app, reson) => {
    reson2 = reson;
    onChange(app, reson);
  };

  const handleUndo = () => {
    onUndo();
  };

  const handleRedo = () => {
    onRedo();
  };

  const handleChangePresence = (app, user) => {
    user2 = user;
    onChangePresence(app, user);
  };

  return (
    <div id="11111">
      <Tldraw
        showMenu={false}
        showZoom={false}
        autofocus
        disableAssets
        showPages={false}
        onMount={handleMount} // 여기서 onMount 함수를 호출하며 app 인자를 전달합니다.
        {...fileSystemEvents}
        onChange={handleChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onChangePresence={handleChangePresence}
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
