import { Tldraw, useFileSystem } from "@tldraw/tldraw";
import { useUsers } from "y-presence";
import { useMultiplayerState } from "./hooks/useMultiplayerState";
import "./styles.css";
import { store } from "./store";

function Editor({ roomId }) {
  const { awareness, doc, provider, undoManager, yBindings, yShapes } =
    store(1);
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
  const { awareness } = store();
  const users = useUsers(awareness);

  return (
    <div className="absolute p-md">
      <div className="flex space-between">
        <span>Number of connected users: {users.size}</span>
      </div>
    </div>
  );
}

export default function App() {
  const { roomID } = store();
  return (
    <div className="tldraw">
      <Info />
      <Editor roomId={roomID} />
    </div>
  );
}
