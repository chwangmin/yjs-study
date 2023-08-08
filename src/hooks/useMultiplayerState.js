import { TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useRef } from "react";
import throttle from "lodash.throttle";
import {
  awareness,
  doc,
  provider,
  undoManager,
  yBindings,
  yShapes,
} from "../store";

export function useMultiplayerState(roomId) {
  const tldrawRef = useRef();

  const onMount = useCallback(
    (app) => {
      app.loadRoom(roomId);
      app.pause();
      tldrawRef.current = app;

      app.replacePageContent(
        Object.fromEntries(yShapes.entries()),
        Object.fromEntries(yBindings.entries()),
        {}
      );
    },
    [roomId]
  );

  const onChange = useCallback(
    throttle((app, reason) => {
      if (
        reason &&
        reason.includes("user") &&
        !reason.includes("session") &&
        !reason.includes("delete")
      ) {
        return;
      }

      const shapes = app.shapes;
      const bindings = app.bindings;

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

      const keys = shapes.reduce((keys, shape) => {
        keys.add(shape.id);
        return keys;
      }, new Set());

      Array.from(yShapes.keys()).forEach((id) => {
        if (!keys.has(id)) {
          yShapes.delete(id);
        }
      });
    }, 50),
    []
  );

  const onUndo = useCallback(() => {
    undoManager.undo();
  }, []);

  const onRedo = useCallback(() => {
    undoManager.redo();
  }, []);

  const onChangePresence = useCallback((app, user) => {
    awareness.setLocalStateField("tdUser", user);
    console.log(awareness);
  }, []);

  useEffect(() => {
    const onChangeAwareness = throttle(() => {
      const tldraw = tldrawRef.current;

      if (!tldraw || !tldraw.room) return;

      const others = Array.from(awareness.getStates().entries())
        .filter(([key, _]) => key !== awareness.clientID)
        .map(([_, state]) => state)
        .filter((user) => user.tdUser !== undefined);

      const ids = others.map((other) => other.tdUser.id);

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
    const handleChanges = throttle((event) => {
      const tldraw = tldrawRef.current;

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
