import type { Result, Err } from "shared";
import { succeed, fail } from "shared";
import type { TextEditor, Position } from "vscode";

export async function getQueryText(
  editor: TextEditor
): Promise<Result<Err<"NoText">, string>> {
  const text = (() => {
    const selections = editor.selections.filter(
      (selection) => !selection.isEmpty
    );
    if (selections.length === 0) {
      const documentText = editor.document.getText();
      if (editor.document.languageId === "markdown") {
        const cursorPosition = editor.selection.active;
        const codeBlockText = getCodeBlockText(documentText, cursorPosition);
        if (codeBlockText) {
          return codeBlockText;
        }
      }
      return documentText;
    }
    return selections
      .map((selection) => editor.document.getText(selection))
      .join("\n");
  })();

  if (text.trim() === "") {
    return fail({
      type: "NoText" as const,
      reason: `no text in the editor`,
    });
  }

  return succeed(text);
}

/**
 * Extracts the text within the code block where the cursor is positioned.
 *
 * @param documentText - The entire text of the document.
 * @param cursorPosition - The current position of the cursor.
 * @returns The text within the code block or null if the cursor is not in a code block.
 */
function getCodeBlockText(documentText: string, cursorPosition: Position): string | null {
  const lines = documentText.split("\n");
  let inCodeBlock = false;
  let codeBlockStart = -1;
  let codeBlockEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line && line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockStart = i;
      } else {
        inCodeBlock = false;
        codeBlockEnd = i;
        if (cursorPosition.line >= codeBlockStart && cursorPosition.line <= codeBlockEnd) {
          return lines.slice(codeBlockStart + 1, codeBlockEnd).join("\n");
        }
      }
    }
  }

  return null;
}
