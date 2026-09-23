import { useMemo, useState } from 'react'
import { PageHeader } from '@/presentation/components/shared/PageHeader/PageHeader'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { AccountsTable } from '../components/AccountsTable'
import { AccountsNavigator, ALL_SUBGROUPS } from '../components/AccountsNavigator'
import { buildAccountTree, collectAccountCodes } from '../utils/buildAccountTree'
import { filterAccountTree } from '../utils/filterAccountTree'
import { ROOT_ACCOUNTS_FILTER, branchFilter } from '../utils/accountFilters'
import { useAccountEntries, useAllAccountEntries } from '@/core/finance'

const ROOT_PAGE_SIZE = 50

export function AccountsPage() {
  const [groupCode, setGroupCode] = useState('')
  const [subGroupCode, setSubGroupCode] = useState('')
  const [text, setText] = useState('')

  // Cuentas de primer nivel: Activos, Pasivos, Capital...
  const rootQuery = useAccountEntries({
    pageNumber: 1,
    pageSize: ROOT_PAGE_SIZE,
    filter: ROOT_ACCOUNTS_FILTER,
  })
  const groups = useMemo(() => rootQuery.data?.data ?? [], [rootQuery.data])
  const selectedGroup = groups.find((group) => group.accountCode === groupCode)
  const groupMask = selectedGroup?.groupMask

  // Toda la gaveta del grupo, recorriendo cuantas páginas haga falta: de aquí
  // salen los rubros de nivel 2 y el árbol completo que cuelga de ellos.
  const branchQuery = useAllAccountEntries(
    groupMask != null ? branchFilter(groupMask) : undefined,
    { enabled: groupMask != null }
  )
  const branchAccounts = useMemo(() => branchQuery.data?.accounts ?? [], [branchQuery.data])
  const subGroups = useMemo(
    () => branchAccounts.filter((account) => account.levels === 2),
    [branchAccounts]
  )

  // Las raíces del árbol son las hijas de la selección más profunda
  const rootFatherNum = subGroupCode || groupCode
  const tree = useMemo(
    () => (rootFatherNum === '' ? [] : buildAccountTree(branchAccounts, rootFatherNum)),
    [branchAccounts, rootFatherNum]
  )
  const visibleTree = useMemo(() => filterAccountTree(tree, text), [tree, text])

  const isSearching = text.trim() !== ''
  const expandedOnSearch = useMemo(
    () => (isSearching ? collectAccountCodes(visibleTree) : undefined),
    [isSearching, visibleTree]
  )

  // El árbol necesita la rama completa: si el API devolvió menos filas de las
  // que dice tener, quedaría incompleto sin avisar.
  const totalRecords = branchQuery.data?.totalRecords ?? 0
  const isTruncated = groupMask != null && totalRecords > branchAccounts.length

  function handleGroupChange(value: string) {
    setGroupCode(value)
    setSubGroupCode('')
  }

  function handleSubGroupChange(value: string) {
    setSubGroupCode(value === ALL_SUBGROUPS ? '' : value)
  }

  function handleClear() {
    setGroupCode('')
    setSubGroupCode('')
    setText('')
  }

  const error = (rootQuery.error ?? branchQuery.error) as Error | null

  const emptyMessage = groupCode === ''
    ? 'Elige un grupo para ver sus cuentas.'
    : isSearching
      ? 'Ninguna cuenta coincide con la búsqueda.'
      : 'Este grupo no tiene cuentas.'

  return (
    <div>
      <PageHeader
        title="Cuentas Contables"
        description="Catálogo de cuentas del plan contable"
      />

      <AccountsNavigator
        groups={groups}
        subGroups={subGroups}
        groupCode={groupCode}
        subGroupCode={subGroupCode}
        text={text}
        isLoadingGroups={rootQuery.isLoading}
        onGroupChange={handleGroupChange}
        onSubGroupChange={handleSubGroupChange}
        onTextChange={setText}
        onClear={handleClear}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {isTruncated && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Este grupo tiene {totalRecords} cuentas y solo se cargaron{' '}
            {branchAccounts.length}: el árbol está incompleto. Avisa al área de sistemas.
          </AlertDescription>
        </Alert>
      )}

      <AccountsTable
        key={`${groupCode}|${subGroupCode}|${text}`}
        nodes={visibleTree}
        isLoading={branchQuery.isLoading}
        emptyMessage={emptyMessage}
        initialExpandedIds={expandedOnSearch}
      />
    </div>
  )
}
