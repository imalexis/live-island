import logo from "./logo.svg";
import "./App.css";
import LiveIsland from "./LiveIsland";

function App() {
  return (
    <div className="App">
      <LiveIsland
        ws={"ws://localhost:8080"}
        duration={5000}
        dismiss="proactive"
      />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
