import ChatWindow from './components/ChatWindow.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo" aria-hidden>
          <span className="logo-mark">🤖</span>
          <span className="logo-text">Workinlot Chatbot Demo</span>
        </div>
        <p className="header-subtitle">
          Poc pulse proje asistanı ile anında etkileşim kurun.
        </p>
      </header>

      <main className="app-main">
        <ChatWindow />
      </main>

      <footer className="app-footer">
        <p>
          Proje akışınız hakkında hızlı yanıtlar almak için Poc Pulse Proje Asistanı ile sohbet edin.
        </p>
      </footer>
    </div>
  );
}

export default App;
