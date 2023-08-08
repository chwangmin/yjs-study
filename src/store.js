import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const VERSION = 2;

// Create the doc
export const doc = new Y.Doc();

export let roomID = `y-tldraw-${VERSION}`;

// Create a websocket provider
export let provider = new WebsocketProvider(
  "ws://ec2-3-37-28-211.ap-northeast-2.compute.amazonaws.com:3000",
  roomID,
  doc,
  {
    connect: true,
  }
);

// Export the provider's awareness API
export let awareness = provider.awareness;

export const yShapes = doc.getMap("shapes");
export const yBindings = doc.getMap("bindings");

// Create an undo manager for the shapes and binding maps
export const undoManager = new Y.UndoManager([yShapes, yBindings]);

export function enterRoom(newRoomID) {
  // Disconnect from the current room
  provider.disconnect();

  // Update the roomID
  roomID = newRoomID;

  // Create a new instance of the WebsocketProvider with the updated roomID
  provider = new WebsocketProvider(
    "ws://ec2-3-37-28-211.ap-northeast-2.compute.amazonaws.com:3000",
    roomID,
    doc,
    {
      connect: true,
    }
  );
  awareness = provider.awareness;
}
