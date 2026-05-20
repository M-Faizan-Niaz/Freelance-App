'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Todo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: newTodo.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prev) => [...prev, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  };

  const saveEdit = () => {
    if (!editValue.trim() || !editingId) return;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === editingId ? { ...todo, title: editValue.trim() } : todo)),
    );
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={addTodo} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {todos.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No todos yet. Add one above!</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
              {editingId === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    autoFocus
                  />
                  <Button onClick={saveEdit} size="icon" variant="ghost">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={cancelEdit} size="icon" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      todo.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                  <Button onClick={() => startEditing(todo)} size="icon" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => deleteTodo(todo.id)} size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {todos.filter((t) => t.completed).length} of {todos.length} completed
        </p>
      )}
    </div>
  );
}
