import Navbar from "@/app/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar currentPage="home" />
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <h1 className="text-7xl mb-4 font-mono">hanap</h1>
        <p className="text-gray-500 text-xl">a job search engine for teens</p>
      </div>
    </main>
  );
}
