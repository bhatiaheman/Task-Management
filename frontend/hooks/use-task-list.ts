"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTask,
  updateTask,
} from "@/lib/api";
import type { Task, TaskStatus } from "@/lib/types";
import type { ModalMode } from "@/components/tasks/task-form-modal";

export function useTaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | TaskStatus>("");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<TaskStatus>("TODO");
  const [saving, setSaving] = useState(false);

  const searchDebouncedSkip = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 320);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (searchDebouncedSkip.current) {
      searchDebouncedSkip.current = false;
      return;
    }
    setMeta((m) => ({ ...m, page: 1 }));
  }, [searchDebounced]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTasks({
        page: meta.page,
        limit: meta.limit,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(searchDebounced ? { search: searchDebounced } : {}),
      });
      setTasks(res.data);
      setMeta(res.meta);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, statusFilter, searchDebounced]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormTitle("");
    setFormDescription("");
    setFormStatus("TODO");
    setModal("create");
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setFormTitle(task.title);
    setFormDescription(task.description ?? "");
    setFormStatus(task.status);
    setModal("edit");
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const submitForm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
        if (modal === "create") {
          await createTask({
            title: formTitle,
            description: formDescription || undefined,
            status: formStatus,
          });
          toast.success("Task created");
        } else if (modal === "edit" && editing) {
          await updateTask(editing.id, {
            title: formTitle,
            description: formDescription || null,
            status: formStatus,
          });
          toast.success("Task updated");
        }
        setModal(null);
        await load();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
    [modal, editing, formTitle, formDescription, formStatus, load],
  );

  const onToggle = useCallback(
    async (task: Task) => {
      try {
        await toggleTask(task.id);
        toast.success("Status updated");
        await load();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Toggle failed");
      }
    },
    [load],
  );

  const onDelete = useCallback(
    async (task: Task) => {
      if (!globalThis.confirm(`Delete "${task.title}"?`)) return;
      try {
        await deleteTask(task.id);
        toast.success("Task deleted");
        await load();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Delete failed");
      }
    },
    [load],
  );

  const onStatusFilterChange = useCallback((value: "" | TaskStatus) => {
    setStatusFilter(value);
    setMeta((m) => ({ ...m, page: 1 }));
  }, []);

  const onPageChange = useCallback((page: number) => {
    setMeta((m) => ({ ...m, page }));
  }, []);

  return {
    tasks,
    meta,
    loading,
    load,
    statusFilter,
    onStatusFilterChange,
    search,
    setSearch,
    modal,
    formTitle,
    formDescription,
    formStatus,
    saving,
    setFormTitle,
    setFormDescription,
    setFormStatus,
    openCreate,
    openEdit,
    closeModal,
    submitForm,
    onToggle,
    onDelete,
    onPageChange,
  };
}
