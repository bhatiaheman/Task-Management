"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskFormModal } from "@/components/tasks/task-form-modal";
import { TaskList } from "@/components/tasks/task-list";
import { TaskPagination } from "@/components/tasks/task-pagination";
import { useTaskList } from "@/hooks/use-task-list";

export function TaskDashboard() {
  const { user, logout } = useAuth();
  const {
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
  } = useTaskList();

  async function onLogout() {
    try {
      await logout();
      toast.success("Signed out");
    } catch {
      toast.error("Sign out failed");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--tm-bg)]">
      <DashboardHeader
        email={user?.email}
        onRefresh={() => void load()}
        onAddTask={openCreate}
        onLogout={() => void onLogout()}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Overview</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
              Your tasks
              {meta.total > 0 && (
                <span className="ml-2 text-lg font-normal text-zinc-500">({meta.total})</span>
              )}
            </p>
          </div>
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={onStatusFilterChange}
          />
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          onAdd={openCreate}
          onToggle={(t) => void onToggle(t)}
          onEdit={openEdit}
          onDelete={(t) => void onDelete(t)}
        />

        <TaskPagination page={meta.page} totalPages={meta.totalPages} onPageChange={onPageChange} />

        <p className="mt-12 text-center text-xs text-zinc-600">
          <Link className="text-emerald-600 hover:underline" href="/">
            Home
          </Link>
        </p>
      </main>

      {modal ? (
        <TaskFormModal
          mode={modal}
          title={formTitle}
          description={formDescription}
          status={formStatus}
          saving={saving}
          onTitleChange={setFormTitle}
          onDescriptionChange={setFormDescription}
          onStatusChange={setFormStatus}
          onClose={closeModal}
          onSubmit={(e) => void submitForm(e)}
        />
      ) : null}
    </div>
  );
}
