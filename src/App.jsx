import React, { lazy, Suspense, useState } from "react";
const Tldraw = lazy(() => import("./Tldraw"));

function App() {
  const [showTldraw1, setShowTldraw1] = useState(false);
  const [showTldraw2, setShowTldraw2] = useState(false);
  const [showTldraw3, setShowTldraw3] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={() => setShowTldraw1(true)}>Tldraw</button>
        <button onClick={() => setShowTldraw2(true)}>Tldraw</button>
        <button onClick={() => setShowTldraw3(true)}>Tldraw</button>
      </div>
      {showTldraw1 && (
        <Suspense fallback={<div>Loading...</div>}>
          <Tldraw />
        </Suspense>
      )}
      {showTldraw2 && (
        <Suspense fallback={<div>Loading...</div>}>
          <Tldraw />
        </Suspense>
      )}
      {showTldraw3 && (
        <Suspense fallback={<div>Loading...</div>}>
          <Tldraw />
        </Suspense>
      )}
    </div>
  );
}

export default App;
