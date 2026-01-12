import type { Task } from '../types/task';

const STORAGE_KEY = 'tasks_v1';

const isTauri = () =>
  typeof window !== 'undefined' && '__TAURI__' in window;

// Función helper para importaciones dinámicas de Tauri que Vite no puede analizar
const dynamicImport = async (modulePath: string) => {
  // Construir el path en runtime para que Vite no lo analice estáticamente
  const base = '@tauri-apps/api';
  const fullPath = `${base}/${modulePath}`;
  // @ts-ignore
  return import(/* @vite-ignore */ fullPath);
};

export const loadTasks = async (): Promise<Task[]> => {
  if (isTauri()) {
    try {
      // Importación dinámica que Vite no puede analizar estáticamente
      const fsModule = await dynamicImport('fs');
      const pathModule = await dynamicImport('path');
      const { readTextFile, writeTextFile } = fsModule;
      const { appDataDir, join } = pathModule;

      const dir = await appDataDir();
      const path = await join(dir, 'tasks.json');

      try {
        const raw = await readTextFile(path);
        const parsed = JSON.parse(raw);
        // Convertir las fechas de string a Date
        return (parsed.tasks ?? []).map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }));
      } catch {
        const empty = { tasks: [] };
        await writeTextFile(path, JSON.stringify(empty, null, 2));
        return [];
      }
    } catch (error) {
      console.error('Error loading tasks from Tauri:', error);
      return [];
    }
  }

  // WEB - usar localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Convertir las fechas de string a Date
    return (parsed.tasks ?? []).map((task: any) => ({
      ...task,
      date: new Date(task.date),
    }));
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  if (isTauri()) {
    try {
      // Importación dinámica que Vite no puede analizar estáticamente
      const fsModule = await dynamicImport('fs');
      const pathModule = await dynamicImport('path');
      const { writeTextFile } = fsModule;
      const { appDataDir, join } = pathModule;

      const dir = await appDataDir();
      const path = await join(dir, 'tasks.json');

      await writeTextFile(
        path,
        JSON.stringify(
          {
            tasks: tasks.map((task) => ({
              ...task,
              date: task.date.toISOString(),
            })),
          },
          null,
          2
        )
      );
      return;
    } catch (error) {
      console.error('Error saving tasks to Tauri:', error);
      throw error;
    }
  }

  // WEB - usar localStorage
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tasks: tasks.map((task) => ({
          ...task,
          date: task.date.toISOString(),
        })),
      })
    );
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
    throw error;
  }
};
