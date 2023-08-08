import { useCallback, useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

let provider;

export function useMultiplayerState(roomId, app2) {
  let doc = new Y.Doc();
  if (provider) {
    provider.disconnect();
  }
  console.log("111111111");
  console.log(roomId);

  provider = new WebsocketProvider(
    "ws://ec2-3-37-28-211.ap-northeast-2.compute.amazonaws.com:3000",
    roomId,
    doc,
    {
      connect: true,
    }
  );
  console.log(doc);

  provider.connect();

  console.log(provider);

  let awareness = provider.awareness;

  let yShapes = doc.getMap("shapes");
  let yBindings = doc.getMap("binding");

  let undoManager = new Y.UndoManager([yShapes, yBindings]);

  let tldrawRef = useRef();

  let onMount = (app) => {
    console.log("222222222222222222", app);
    console.log("asdfasfd");
    app.loadRoom(roomId);
    app.pause();
    tldrawRef.current = app;

    app.replacePageContent(
      Object.fromEntries(yShapes.entries()),
      Object.fromEntries(yBindings.entries()),
      {}
    );
  };

  let reason2;

  let onChange = throttle((app, reason) => {
    reason2 = reason;
    if (
      reason &&
      reason.includes("user") &&
      !reason.includes("session") &&
      !reason.includes("delete")
    ) {
      return;
    }

    let shapes = app.shapes;
    let bindings = app.bindings;

    doc.transact(() => {
      shapes.forEach((shape) => {
        if (!shape) {
          // shape is falsy, so we cannot access its id property
          // do something else here, or simply return
          console.error("Shape is undefined or of type never");
          return;
        } else {
          yShapes.set(shape.id, shape);
        }
      });
      bindings.forEach((binding) => {
        if (!binding || typeof binding === "undefined") {
        } else {
          yBindings.set(binding.id, binding);
        }
      });
    }, tldrawRef.current);

    let keys = shapes.reduce((keys, shape) => {
      keys.add(shape.id);
      return keys;
    }, new Set());

    Array.from(yShapes.keys()).forEach((id) => {
      if (!keys.has(id)) {
        yShapes.delete(id);
      }
    });
  }, 50);

  let onUndo = () => {
    undoManager.undo();
  };

  let onRedo = () => {
    undoManager.redo();
  };

  let onChangePresence = (app, user) => {
    awareness.setLocalStateField("tdUser", user);
  };

  useEffect(() => {
    let onChangeAwareness = throttle(() => {
      let tldraw = tldrawRef.current;

      if (!tldraw || !tldraw.room) return;

      let others = Array.from(awareness.getStates().entries())
        .filter(([key, _]) => key !== awareness.clientID)
        .map(([_, state]) => state)
        .filter((user) => user.tdUser !== undefined);

      let ids = others.map((other) => other.tdUser.id);

      Object.values(tldraw.room.users).forEach((user) => {
        if (user && !ids.includes(user.id) && user.id !== tldraw.room?.userId) {
          tldraw.removeUser(user.id);
        }
      });

      tldraw.updateUsers(others.map((other) => other.tdUser).filter(Boolean));
    }, 50);

    awareness.on("change", onChangeAwareness);

    return () => awareness.off("change", onChangeAwareness);
  }, []);

  useEffect(() => {
    let handleChanges = throttle((event) => {
      let tldraw = tldrawRef.current;

      if (!tldraw || event.origin === tldraw) return;

      tldraw.replacePageContent(
        Object.fromEntries(yShapes.entries()),
        Object.fromEntries(yBindings.entries()),
        {}
      );
    }, 25);

    yShapes.observeDeep(handleChanges);

    return () => yShapes.unobserveDeep(handleChanges);
  }, []);

  useEffect(() => {
    function handleDisconnect() {
      provider.disconnect();
    }
    window.addEventListener("beforeunload", handleDisconnect);

    return () => window.removeEventListener("beforeunload", handleDisconnect);
  }, []);

  return {
    onMount,
    onChange,
    onUndo,
    onRedo,
    onChangePresence,
  };
}
