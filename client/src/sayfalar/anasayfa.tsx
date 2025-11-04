// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { useState } from "react";
import { Header } from "@/bilesenler/baslik";
import { TasksSection } from "@/bilesenler/gorevler-bolumu";
import { ProfileModal } from "@/bilesenler/profil-modal";
import { AddTaskModal } from "@/bilesenler/gorev-ekle-modal";

export default function Home() {
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-hidden">
        {/* Görevler Bölümü - Artık kenar çubuğu yok */}
        <TasksSection onAddTask={() => setAddTaskModalOpen(true)} />
      </main>

      {/* Modallar */}
      <AddTaskModal 
        open={addTaskModalOpen} 
        onOpenChange={setAddTaskModalOpen} 
      />
    </div>
  );
}

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
