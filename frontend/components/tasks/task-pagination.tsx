type TaskPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function TaskPagination({ page, totalPages, onPageChange }: TaskPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="px-3 text-sm text-zinc-500">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
