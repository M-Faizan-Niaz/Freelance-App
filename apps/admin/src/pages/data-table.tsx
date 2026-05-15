import { Fragment, useEffect, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  type Column,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  Search,
  SlidersHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import { type ListColors200DataItem, useListColors } from "@repo/api-client";
import { ColorDeleteModal } from "./color-delete-modal";
import { ColorViewModal } from "./color-view-modal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPinStyle(column: Column<ListColors200DataItem>): React.CSSProperties {
  const pinned = column.getIsPinned();
  if (!pinned) return {};
  return {
    position: "sticky",
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: 1,
  };
}

function SortIndicator({ column }: { column: Column<ListColors200DataItem> }) {
  const sorted = column.getIsSorted();
  if (sorted === "asc") return <ArrowUp className="size-3.5 shrink-0" />;
  if (sorted === "desc") return <ArrowDown className="size-3.5 shrink-0" />;
  return <ArrowUpDown className="size-3.5 shrink-0 opacity-40" />;
}

function ColumnFilter({ column }: { column: Column<ListColors200DataItem> }) {
  const filterValue = column.getFilterValue();
  return (
    <Input
      value={(filterValue as string) ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      placeholder="Filter…"
      className="h-7 text-xs"
    />
  );
}


// ─── Column definitions ───────────────────────────────────────────────────────

const columnHelper = createColumnHelper<ListColors200DataItem>();

const baseColumns: ColumnDef<ListColors200DataItem, any>[] = [
  {
    id: "select",
    size: 44,
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={() => row.toggleSelected()}
        aria-label="Select row"
      />
    ),
  },
  columnHelper.accessor("id", {
    header: "ID",
    size: 70,
    enableSorting: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    size: 200,
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    size: 320,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => getValue() ?? <span className="text-muted-foreground italic">—</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    size: 140,
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => formatDate(getValue()),
  }),
];

// ─── Page component ───────────────────────────────────────────────────────────

export function DataTablePage() {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const actionsColumn: ColumnDef<ListColors200DataItem, any> = {
    id: "actions",
    size: 110,
    enableSorting: false,
    enableColumnFilter: false,
    enableResizing: false,
    header: () => "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => setViewingColor(row.original)}
          title="View details"
          data-testid="action-view"
        >
          <Eye className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() =>
            navigate({
              to: "/colors/$colorId/edit",
              params: { colorId: String(row.original.id) },
            })
          }
          title="Edit"
          data-testid="action-edit"
        >
          <SquarePen className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive"
          onClick={() => setDeletingId(row.original.id)}
          title="Delete"
          data-testid="action-delete"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  };

  const columns = [...baseColumns, actionsColumn];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [viewingColor, setViewingColor] = useState<ListColors200DataItem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [pageSizeInput, setPageSizeInput] = useState("10");

  // Reset to first page whenever search, column filters, or sort changes
  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [globalFilter, columnFilters, sorting]);

  const colorsParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter || undefined,
    sortBy: sorting[0]?.id,
    sortOrder: (sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined) as "asc" | "desc" | undefined,
    filters:
      columnFilters.length > 0
        ? JSON.stringify(Object.fromEntries(columnFilters.map((f) => [f.id, f.value])))
        : undefined,
  };

  const { data, isLoading, isError } = useListColors(colorsParams, {
    query: { placeholderData: (prev) => prev },
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    rowCount: data?.meta.pagination.total ?? 0,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    initialState: {
      columnPinning: { left: ["select", "name"] },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiSort: false,
    enableSortingRemoval: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enableRowSelection: true,
  });

  function exportCSV() {
    const visible = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && !["select", "actions"].includes(col.id));
    const headers = visible.map((col) => col.id);
    const rows = (data?.data ?? []).map((row) =>
      visible.map((col) => {
        const val = String((row as any)[col.id] ?? "");
        return val.includes(",") ? `"${val}"` : val;
      }),
    );
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "colors.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = data?.meta.pagination.total ?? 0;
  const selectedCount = Object.keys(rowSelection).length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <Fragment>
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
          Components
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Data Table</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          TanStack Table v8 — server-side pagination, sorting &amp; filtering via the Colors API.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search name or description…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
            data-testid="data-table-search"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground mr-1">
              {selectedCount} selected
            </span>
          )}

          {/* Column visibility toggle */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="size-4" />
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Toggle Columns
              </p>
              <div className="space-y-2">
                {table
                  .getAllLeafColumns()
                  .filter((col) => !["select", "actions"].includes(col.id))
                  .map((col) => (
                    <div key={col.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={col.getIsVisible()}
                        onCheckedChange={(v) => col.toggleVisibility(!!v)}
                      />
                      <Label
                        htmlFor={`col-${col.id}`}
                        className="text-xs capitalize cursor-pointer"
                      >
                        {col.id}
                      </Label>
                    </div>
                  ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <Fragment key={headerGroup.id}>
                  {/* Sort / label row */}
                  <TableRow className="border-b-0 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize(), ...getPinStyle(header.column) }}
                        className={cn(
                          "relative select-none whitespace-nowrap",
                          header.column.getIsPinned() && "bg-card",
                        )}
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <button
                            className="flex items-center gap-1 font-medium hover:text-foreground w-full text-left"
                            onClick={header.column.getToggleSortingHandler()}
                            title={`Sort by ${header.column.id}`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <SortIndicator column={header.column} />
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}

                        {/* Column resize handle */}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn(
                              "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none transition-colors hover:bg-border",
                              header.column.getIsResizing() && "bg-primary",
                            )}
                          />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>

                  {/* Per-column filter row */}
                  <TableRow className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={`${header.id}-filter`}
                        style={{ width: header.getSize(), ...getPinStyle(header.column) }}
                        className={cn(
                          "py-1.5",
                          header.column.getIsPinned() && "bg-card",
                        )}
                      >
                        {header.column.getCanFilter() ? (
                          <ColumnFilter column={header.column} />
                        ) : null}
                      </TableHead>
                    ))}
                  </TableRow>
                </Fragment>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, colIdx) => (
                      <TableCell key={colIdx}>
                        <div className="h-4 rounded bg-muted animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-destructive"
                  >
                    Failed to load colors. Please try again.
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={cn(row.getIsSelected() && "bg-muted/40")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize(), ...getPinStyle(cell.column) }}
                        className={cn(cell.column.getIsPinned() && "bg-card")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination footer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "No rows"
            : `${from}–${to} of ${total} rows`}
          {selectedCount > 0 && ` · ${selectedCount} selected`}
        </p>

        <div className="flex items-center gap-4">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
            <Input
              type="number"
              min={1}
              value={pageSizeInput}
              onChange={(e) => {
                setPageSizeInput(e.target.value);
                const n = parseInt(e.target.value, 10);
                if (!isNaN(n) && n >= 1) {
                  table.setPageSize(n);
                  table.setPageIndex(0);
                }
              }}
              className="h-8 w-16 text-xs text-center"
            />
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[4rem] text-center text-sm tabular-nums">
              {pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <ColorDeleteModal colorId={deletingId} onClose={() => setDeletingId(null)} />
    <ColorViewModal color={viewingColor} onClose={() => setViewingColor(null)} />
    </Fragment>
  );
}
