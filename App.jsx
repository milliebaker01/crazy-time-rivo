import React, { useState } from "react";

const sections = ["1", "2", "5", "10", "Coin Flip", "Cash Hunt", "Pachinko", "Crazy Time"];

function App() {
  const [history, setHistory] = useState([]);
  const [signals, setSignals] = useState([]);
  const [input, setInput] = useState("");

  const generateSignal = (newHistory) => {
    const last = newHistory[newHistory.length - 1];
    const repeatChance = parseFloat(
      (newHistory.filter((s) => s === last).length / newHistory.length).toFixed(2)
    );

    const freq = sections.reduce((acc, sec) => {
      acc[sec] = newHistory.filter((s) => s === sec).length;
      return acc;
    }, {});

    const leastFrequent = Object.entries(freq).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
    const bonusCount = newHistory.filter((s) => sections.slice(4).includes(s)).length;
    const volatility = parseFloat((bonusCount / newHistory.length).toFixed(2));

    const weights = sections.map((s) => (sections.slice(4).includes(s) ? 2 : 1));
    const guess = sections[weightedRandomIndex(weights)];

    return {
      time: new Date().toLocaleTimeString(),
      repeatChance,
      leastFrequent,
      volatility,
      guess,
    };
  };

  const weightedRandomIndex = (weights) => {
    const total = weights.reduce((a, b) => a + b, 0);
    let threshold = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      threshold -= weights[i];
      if (threshold <= 0) return i;
    }
  };

  const handleSubmit = () => {
    if (!sections.includes(input)) return;
    const newHistory = [...history, input];
    const newSignal = generateSignal(newHistory);
    setHistory(newHistory);
    setSignals([newSignal, ...signals]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Crazy Time RIVO Signal</h1>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          placeholder="Enter last spin (e.g. 1, Pachinko)"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
      <div style={{ maxHeight: 400, overflowY: 'auto', marginTop: 20 }}>
        {signals.map((s, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <div><strong>Time:</strong> {s.time}</div>
            <div><strong>Guess:</strong> {s.guess}</div>
            <div><strong>Volatility:</strong> {s.volatility}</div>
            <div><strong>Least Frequent:</strong> {s.leastFrequent}</div>
            <div><strong>Repeat Chance:</strong> {s.repeatChance}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
