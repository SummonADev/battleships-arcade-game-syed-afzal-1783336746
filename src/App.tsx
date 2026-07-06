import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-cyan-300">
              Battleships Arcade — loading…
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
