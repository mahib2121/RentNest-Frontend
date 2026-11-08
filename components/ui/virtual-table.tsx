"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useRafThrottle } from "@/hooks/useRafThrottle";

/**
 * A virtualised table body.
 *
 * A plain `<table>` with a mapped `<tbody>` renders every row, however many
 * there are. With a thousand listings that is a thousand rows of DOM to
 * create, style and lay out on every render — most of them scrolled out of
 * sight. This renders only the rows that are actually on screen, plus a
 * small overscan so fast scrolling does not flash empty rows.
 *
 * The table stays a real table: `<thead>` is a normal sticky header, and the
 * body rows are real `<tr>` elements inside a `<tbody>`.
 *
 * The body is a spacer of the full scroll height and the rows inside it are
 * absolutely positioned, offset by the virtualizer's measured start. The
 * cost of that trick is that the rows no longer take part in the table's
 * column layout, so the widths are worked out here and applied to every row
 * explicitly — otherwise each row would size its own columns and drift out
 * of line with the header.
 *
 * Row heights are measured rather than assumed, so a row that wraps to two
 * lines does not overlap the row below it.
 */

export type VirtualTableColumn<T> = {
  key: string;
  label: string;
  /**
   * Width hint, e.g. `"180px"` or `"20%"`. Columns without one share
   * whatever space is left over.
   */
  width?: string;
  /** Right-align the cell contents. */
  align?: "left" | "right";
  /** Render the header cell. Defaults to a plain label. */
  renderHeader?: () => React.ReactNode;
  renderCell: (row: T) => React.ReactNode;
};

export type VirtualTableProps<T> = {
  columns: VirtualTableColumn<T>[];
  rows: T[];
  /** Stable key for a row. */
  rowKey: (row: T) => string;
  /** Height of the scroll viewport in pixels. */
  height?: number;
  /** Rows rendered above and below the visible window. */
  overscan?: number;
  /** Rendered when there are no rows. */
  empty?: React.ReactNode;
  /** Sticky header. On by default. */
  stickyHeader?: boolean;
  /** Extra classes on the scroll container. */
  className?: string;
};

/** The width the table is laid out at before it has been measured. */
const ESTIMATED_TABLE_WIDTH = 1024;

/** The minimum width the table is given, so it scrolls rather than crushing. */
const MIN_TABLE_WIDTH = 760;

export function VirtualTable<T>({
  columns,
  rows,
  rowKey,
  height = 560,
  overscan = 8,
  empty,
  stickyHeader = true,
  className,
}: VirtualTableProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const [tableWidth, setTableWidth] = useState(ESTIMATED_TABLE_WIDTH);

  /**
   * The table's own width. It has to be measured because the body rows are
   * absolutely positioned: they are laid out against the width given here
   * rather than against the table, and if the two disagree the columns in
   * the body stop lining up with the header.
   */
  useEffect(() => {
    const table = tableRef.current;

    if (!table) return;

    const measure = () => {
      const next = table.getBoundingClientRect().width;

      if (next > 0) {
        setTableWidth((current) =>
          Math.abs(current - next) > 1 ? next : current,
        );
      }
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(table);

    return () => observer.disconnect();
  }, []);

  /**
   * Row heights are measured, not assumed. The estimate is only used until
   * the real height of a row is known, so a row that wraps to two lines
   * still occupies the space it needs.
   *
   * `initialRect` gives the virtualizer a viewport to work with on the very
   * first render. Without it the scroll element has no measured size yet,
   * the virtualizer reports zero visible items, and the table renders
   * completely empty until the browser gets around to laying it out.
   */
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 57,
    overscan,
    initialRect: { width: 1024, height },
    getItemKey: (index) => rowKey(rows[index]),
  });

  const virtualRows = virtualizer.getVirtualItems();

  /**
   * Scrolling fires far more often than the screen can be repainted, and
   * measuring the rows means reading a layout property each time. Running
   * the measurement once per frame keeps the scroll smooth without doing
   * work whose result would be thrown away before it was ever seen.
   */
  const measureRows = useRafThrottle(() => {
    virtualizer.measure();
  });

  if (rows.length === 0 && empty) {
    return <div className={className}>{empty}</div>;
  }

  /**
   * If the virtualizer has not produced a window yet — the first render on
   * the server, or before the element is measured — fall back to the first
   * rows so the table is never blank.
   */
  const renderedRows =
    virtualRows.length > 0
      ? virtualRows
      : rows.slice(0, Math.max(1, Math.ceil(height / 57))).map((_, index) => ({
          index,
          key: rowKey(rows[index]),
          start: index * 57,
        }));

  /**
   * The width of the columns that do not declare one.
   *
   * The declared widths are read as a number of pixels; whatever is left of
   * the table is shared equally between the rest. The same numbers are used
   * for the header, the colgroup and every body row, so the three agree.
   */
  const fixedWidth = columns.reduce((total, column) => {
    const parsed = Number.parseFloat(column.width ?? "");

    return Number.isFinite(parsed) ? total + parsed : total;
  }, 0);

  const flexibleCount = columns.filter(
    (column) => !Number.isFinite(Number.parseFloat(column.width ?? "")),
  ).length;

  const flexibleWidth =
    flexibleCount > 0
      ? Math.max(120, (tableWidth - fixedWidth) / flexibleCount)
      : 0;

  const columnWidth = (column: VirtualTableColumn<T>) =>
    Number.isFinite(Number.parseFloat(column.width ?? ""))
      ? column.width
      : `${flexibleWidth}px`;

  return (
    <div
      ref={scrollRef}
      onScroll={measureRows}
      className={`overflow-auto rounded-sm border border-line ${className ?? ""}`}
      style={{ height }}
    >
      <table
        ref={tableRef}
        className="border-collapse text-sm"
        style={{ width: `${Math.max(tableWidth, MIN_TABLE_WIDTH)}px` }}
      >
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={{ width: columnWidth(column) }} />
          ))}
        </colgroup>

        <thead
          className={
            stickyHeader
              ? "sticky top-0 z-10 bg-paper-raised"
              : "bg-paper-raised"
          }
        >
          <tr className="border-b border-line">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-2.5 text-xs font-normal text-muted-foreground ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {column.renderHeader ? (
                  column.renderHeader()
                ) : (
                  <span>{column.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/*
          The body is a spacer of the full scroll height. Rows are absolutely
          positioned inside it, offset by the virtualizer's measured start.
        */}
        <tbody
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
            display: "block",
          }}
        >
          {renderedRows.map((virtualRow) => {
            const row = rows[virtualRow.index];

            if (!row) return null;

            return (
              <tr
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${Math.max(tableWidth, MIN_TABLE_WIDTH)}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: "table",
                  tableLayout: "fixed",
                }}
                className="border-b border-line transition-colors duration-150 ease-out hover:bg-secondary/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{ width: columnWidth(column) }}
                    className={`px-4 py-3 align-middle ${
                      column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {column.renderCell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
