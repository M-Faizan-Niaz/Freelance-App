import { TodoApp } from '@/components/todo-app';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Todo App</h1>
        <TodoApp />
      </div>
    </main>
  );
}
