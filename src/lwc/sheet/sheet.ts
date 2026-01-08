import { LightningElement, api, track } from 'lwc';

/**
 * JSON structure for sheet data export/import.
 * Row labels as keys, column headers (A, B, C...) as sub-keys with numeric values.
 *
 * @example
 * {@code
 * {
 *   "Revenue": { "A": 1000, "B": 2000, "C": 3000 },
 *   "Costs": { "A": 500, "B": 800, "C": 1200 }
 * }
 * }
 */
export type SheetData = Record<string, Record<string, number | null>>;

/**
 * Represents a single numeric cell in the calculation sheet.
 */
interface NumericCell {
  id: string;
  rowIndex: number;
  colIndex: number;
  value: number | null;
}

/**
 * Represents a row in the calculation sheet.
 */
interface Row {
  id: string;
  index: number;
  label: string;
  cells: NumericCell[];
}

/**
 * Excel-like calculation sheet component with configurable columns,
 * dynamic rows, and automatic column summation.
 * The leftmost column is a label column for row descriptions.
 *
 * Supports JSON import/export for persisting data to external storage.
 *
 * @example
 * {@code
 * <c-test-sheet columns="5" onchange={handleSheetChange}></c-test-sheet>
 * }
 */
export default class Sheet extends LightningElement {
  /**
   * Number of numeric columns in the sheet. Default is 5.
   * This does not include the label column.
   */
  @api columns: number = 5;

  /**
   * Internal row data with reactive tracking.
   */
  @track private _rows: Row[] = [];

  private _rowIdCounter: number = 0;
  private _initialized: boolean = false;

  /**
   * Sets the sheet data from a JSON object.
   * Row labels become the first column, column headers (A, B, C...) map to numeric columns.
   *
   * @param data - The sheet data as a JSON object
   */
  @api
  set data(value: SheetData | null) {
    if (!value) {
      return;
    }
    this._loadFromData(value);
  }

  /**
   * Gets the current sheet data as a JSON object.
   * Uses row labels as keys and column headers as sub-keys.
   */
  @api
  get data(): SheetData {
    return this._toData();
  }

  /**
   * Initializes the sheet with one empty row on first render.
   */
  connectedCallback(): void {
    if (!this._initialized && this._rows.length === 0) {
      this._addRow();
      this._initialized = true;
    }
  }

  /**
   * Returns column headers for numeric columns (A, B, C, ...).
   */
  get columnHeaders(): { key: string; label: string }[] {
    return Array.from({ length: this.columns }, (_, i) => ({
      key: `col-${i}`,
      label: String.fromCharCode(65 + i) // A, B, C, ...
    }));
  }

  /**
   * Returns the current rows for template rendering.
   */
  get rows(): Row[] {
    return this._rows;
  }

  /**
   * Calculates the sum for each numeric column.
   */
  get columnSums(): { key: string; colIndex: number; sum: number }[] {
    return Array.from({ length: this.columns }, (_, colIndex) => {
      const sum = this._rows.reduce((acc, row) => {
        const cell = row.cells.find((c) => c.colIndex === colIndex);
        return acc + (cell?.value ?? 0);
      }, 0);

      return {
        key: `sum-${colIndex}`,
        colIndex,
        sum
      };
    });
  }

  /**
   * Calculates the grand total of all numeric cells.
   */
  get grandTotal(): number {
    return this.columnSums.reduce((acc, col) => acc + col.sum, 0);
  }

  /**
   * Handles label column changes.
   */
  handleLabelChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rowIndex = parseInt(target.dataset.rowIndex ?? '0', 10);
    const labelValue = target.value;

    this._rows = this._rows.map((row) => {
      if (row.index !== rowIndex) {
        return row;
      }
      return { ...row, label: labelValue };
    });

    this._dispatchChange();
  }

  /**
   * Handles numeric cell value changes and updates internal state.
   */
  handleCellChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rowIndex = parseInt(target.dataset.rowIndex ?? '0', 10);
    const colIndex = parseInt(target.dataset.colIndex ?? '0', 10);
    const inputValue = target.value;

    const numericValue = inputValue === '' ? null : parseFloat(inputValue);

    // Create shallow copy to maintain reactivity /copilot
    this._rows = this._rows.map((row) => {
      if (row.index !== rowIndex) {
        return row;
      }

      return {
        ...row,
        cells: row.cells.map((cell) => {
          if (cell.colIndex !== colIndex) {
            return cell;
          }

          return {
            ...cell,
            value: isNaN(numericValue as number) ? null : numericValue
          };
        })
      };
    });

    this._dispatchChange();
  }

  /**
   * Adds a new row to the sheet.
   */
  handleAddRow(): void {
    this._addRow();
    this._dispatchChange();
  }

  /**
   * Removes a row from the sheet by its index.
   */
  handleRemoveRow(event: Event): void {
    const target = event.currentTarget as HTMLButtonElement;
    const rowIndex = parseInt(target.dataset.rowIndex ?? '-1', 10);

    if (rowIndex < 0 || this._rows.length <= 1) {
      return; // Keep at least one row
    }

    this._rows = this._rows
      .filter((row) => row.index !== rowIndex)
      .map((row, idx) => ({ ...row, index: idx }));

    this._dispatchChange();
  }

  /**
   * Internal method to add a new row with empty cells.
   */
  private _addRow(): void {
    const rowIndex = this._rowIdCounter++;
    const newRow: Row = {
      id: `row-${rowIndex}`,
      index: this._rows.length,
      label: '',
      cells: Array.from({ length: this.columns }, (_, colIndex) => ({
        id: `cell-${rowIndex}-${colIndex}`,
        rowIndex: this._rows.length,
        colIndex,
        value: null
      }))
    };

    this._rows = [...this._rows, newRow];
  }

  /**
   * Converts internal row data to exportable JSON structure.
   * Uses row labels as keys and column headers (A, B, C...) as sub-keys.
   */
  private _toData(): SheetData {
    const result: SheetData = {};

    for (const row of this._rows) {
      const rowKey = row.label || `Row ${row.index + 1}`;
      const rowData: Record<string, number | null> = {};

      for (const cell of row.cells) {
        const colKey = String.fromCharCode(65 + cell.colIndex);
        rowData[colKey] = cell.value;
      }

      result[rowKey] = rowData;
    }

    return result;
  }

  /**
   * Loads sheet data from a JSON structure.
   * Row labels become the label column, column headers map to numeric columns.
   */
  private _loadFromData(data: SheetData): void {
    this._rows = [];
    this._rowIdCounter = 0;

    const rowLabels = Object.keys(data);

    for (const label of rowLabels) {
      const rowData = data[label];
      const rowIndex = this._rowIdCounter++;

      const cells: NumericCell[] = Array.from(
        { length: this.columns },
        (_, colIndex) => {
          const colKey = String.fromCharCode(65 + colIndex);
          const value = rowData[colKey] ?? null;

          return {
            id: `cell-${rowIndex}-${colIndex}`,
            rowIndex: this._rows.length,
            colIndex,
            value
          };
        }
      );

      this._rows = [
        ...this._rows,
        {
          id: `row-${rowIndex}`,
          index: this._rows.length,
          label,
          cells
        }
      ];
    }

    // Ensure at least one row exists /copilot
    if (this._rows.length === 0) {
      this._addRow();
    }

    this._initialized = true;
  }

  /**
   * Dispatches a change event with the current sheet data.
   * Parent components can listen to this event to persist data.
   */
  private _dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          data: this._toData()
        }
      })
    );
  }
}