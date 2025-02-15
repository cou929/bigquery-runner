import type { FC } from "react";
import type { RowsPayload } from "shared";

export const Preview: FC<
  Readonly<{
    rowsPayload: RowsPayload;
  }>
> = ({ rowsPayload: { heads, rows } }) => {
  const renderRow = (row: string[]) => row.join("  ");

  return (
    <pre>
      {heads.map((head) => head.id).join("  ")}
      {"\n"}
      {heads.map(() => "------").join("  ")}
      {"\n"}
      {rows.map(({ rowNumber, rows }) =>
        rows.map((row) =>
          renderRow([`${rowNumber}`, ...row.map((cell) => String(cell.value ?? "null"))])
        ).join("\n")
      ).join("\n")}
    </pre>
  );
};
