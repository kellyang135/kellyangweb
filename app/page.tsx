import CrystalCanvas from "@/components/Crystal/CrystalCanvas";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CrystalCanvas />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-crystal-text">Kelly Yang</h1>
      </div>
    </main>
  );
}
