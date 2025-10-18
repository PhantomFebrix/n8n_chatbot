import ChatWindow from './components/ChatWindow.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo" aria-hidden>
          <span className="logo-mark">🤖</span>
          <span className="logo-text">n8n Chatbot Demo</span>
        </div>
        <p className="header-subtitle">
          n8n ile oluşturduğunuz iş akışını React tabanlı bir sohbet arayüzüyle sunun.
        </p>
      </header>

      <main className="app-main">
        <ChatWindow />
      </main>

      <footer className="app-footer">
        <p>
          Webhook adresinizi <code>.env</code> dosyasına ekleyin ve n8n chatbotunuzla anında sohbet edin.
        </p>
      </footer>
    </div>
  );
}

export default App;
