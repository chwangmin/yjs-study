import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function store() {
  const VERSION = 2;

  // Create the doc
  const doc = new Y.Doc();

  const roomID = `y-tldraw-${VERSION}`;

  // Create a websocket provider
  const provider = new WebsocketProvider(
    "ws://ec2-3-37-28-211.ap-northeast-2.compute.amazonaws.com:3000",
    roomID,
    doc,
    {
      connect: true,
    }
  );

  // Export the provider's awareness API
  const awareness = provider.awareness;

  const yShapes = doc.getMap("shapes");
  const yBindings = doc.getMap("bindings");

  // Create an undo manager for the shapes and binding maps
  const undoManager = new Y.UndoManager([yShapes, yBindings]);

  return {
    doc,
    roomID,
    provider,
    awareness,
    yShapes,
    yBindings,
    undoManager,
  };
}
