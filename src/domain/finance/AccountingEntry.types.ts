export interface AccountingEntry {
  accountCode: string | null
  accountName: string | null
  formatCode: string | null
  /** Gaveta del plan contable: 1 = Activos, 2 = Pasivos, etc. */
  groupMask: number
  /** Nivel de la cuenta dentro del plan contable */
  levels: number
  /** accountCode de la cuenta padre; null en las cuentas de primer nivel */
  fatherNum: string | null
  currTotal: number
  budget: string | null
}

/** Todas las cuentas de una consulta, ya recorridas todas sus páginas */
export interface AccountEntriesResult {
  accounts: AccountingEntry[]
  /** Lo que el servidor dice que hay; si supera a `accounts`, faltaron filas */
  totalRecords: number
}

export interface UpdateAccountBudgetFlagCommand {
  accountCode: string
  budget: boolean
}
