import CrystalCanvas from "@/components/Crystal/CrystalCanvas";

export default function Home() {
  return (
    <main className="relative">
      <CrystalCanvas />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-crystal-text mb-4">Kelly Yang</h1>
          <p className="text-xl text-crystal-muted">Materials Science & EECS @ UC Berkeley</p>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">About</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Experience</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Projects</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Education Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Education</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 max-w-2xl mx-4">
          <h2 className="text-3xl font-bold mb-4">Contact</h2>
          <p className="text-crystal-muted">Content coming soon...</p>
        </div>
      </section>
    </main>
  );
}
