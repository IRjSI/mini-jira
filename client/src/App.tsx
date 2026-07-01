import './App.css'

function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Collaborative workspace</p>
          <h1>ProjectFlow</h1>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <a href="#overview">Overview</a>
          <a href="#projects">Projects</a>
          <a href="#boards">Boards</a>
          <a href="#tasks">Tasks</a>
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>Plan, track, and ship together</h2>
          </div>
          <button type="button" className="primary-btn">New project</button>
        </header>

        <section id="overview" className="card-grid">
          <article className="card">
            <h3>Projects</h3>
            <p>Organize your product work by team and initiative.</p>
          </article>
          <article className="card">
            <h3>Boards</h3>
            <p>Move work through stages with simple drag-and-drop-ready structure.</p>
          </article>
          <article className="card">
            <h3>Tasks</h3>
            <p>Keep ownership, priority, and progress visible for everyone.</p>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
