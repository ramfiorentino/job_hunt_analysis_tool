import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Job Lens</h1>
        <p className="header__subtitle">Your personal job market dashboard</p>
      </header>

      <main className="dashboard">
        <section className="panel">
          <h2 className="panel__title">Keyword Frequency</h2>
          <p className="panel__placeholder">Chart — coming in Phase 2</p>
        </section>

        <section className="panel">
          <h2 className="panel__title">Skill Gap</h2>
          <p className="panel__placeholder">Heatmap — coming in Phase 2</p>
        </section>

        <section className="panel">
          <h2 className="panel__title">Salary Distribution</h2>
          <p className="panel__placeholder">Chart — coming in Phase 2</p>
        </section>

        <section className="panel">
          <h2 className="panel__title">Location & Remote</h2>
          <p className="panel__placeholder">Charts — coming in Phase 2</p>
        </section>

        <section className="panel panel--wide">
          <h2 className="panel__title">Job Listings</h2>
          <p className="panel__placeholder">Table with filters — coming in Phase 2</p>
        </section>
      </main>
    </div>
  )
}

export default App
