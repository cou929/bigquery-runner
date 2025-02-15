import type { FC } from "react";
import React from "react";
import type { RowsPayload } from "shared";

export const TextRows: FC<{ rowsPayload: RowsPayload }> = ({ rowsPayload }) => {
  const { heads, rows } = rowsPayload;

  const getMaxLengths = () => {
    const lengths = heads.map((head) => head.id.length);
    rows.forEach(({ rows }) => {
      rows.forEach((row) => {
        row.forEach((cell, i) => {
          const valueLength = cell.value === undefined ? 4 : String(cell.value).length; // "null" length is 4
          if (valueLength > (lengths[i] || 0)) {
            lengths[i] = valueLength;
          }
        });
      });
    });
    return lengths;
  };

  const maxLengths = getMaxLengths();

  const formatRow = (row: any[]) => {
    return row
      .map((cell, i) => {
        const value = cell.value === undefined ? "null" : String(cell.value);
        return value.padEnd(maxLengths[i] ?? 0, " ");
      })
      .join("  ");
  };

  const getSeparator = (length: number) => {
    return "-".repeat(length);
  };

  return (
    <>
      <pre>
        {heads.map((head, i) => head.id.padEnd(maxLengths[i] ?? 0, " ")).join("  ")}
        {"\n"}
        {heads.map((head, i) => getSeparator(maxLengths[i] ?? 0)).join("  ")}
        {"\n"}
        {rows.map(({ rows }) =>
          rows.map((row, j) => (
            <React.Fragment key={j}>
              {formatRow(row)}
              {"\n"}
            </React.Fragment>
          ))
        )}
      </pre>
      <details>
        <summary>Show entire RowsPayload for debug</summary>
        <pre>{JSON.stringify(rowsPayload, null, 2)}</pre> {/* Show entire RowsPayload for debug */}
      </details>
    </>
  );
};
