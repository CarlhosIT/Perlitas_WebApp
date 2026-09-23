import { X } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/presentation/components/ui/select'
import type { AccountingEntry } from '@/domain/finance/AccountingEntry.types'

/** Radix no admite value="" en un SelectItem, así que "todos" lleva centinela */
export const ALL_SUBGROUPS = '__all__'

interface AccountsNavigatorProps {
  groups: AccountingEntry[]
  subGroups: AccountingEntry[]
  groupCode: string
  subGroupCode: string
  text: string
  isLoadingGroups: boolean
  onGroupChange: (accountCode: string) => void
  onSubGroupChange: (accountCode: string) => void
  onTextChange: (value: string) => void
  onClear: () => void
}

export function AccountsNavigator({
  groups, subGroups, groupCode, subGroupCode, text,
  isLoadingGroups, onGroupChange, onSubGroupChange, onTextChange, onClear,
}: AccountsNavigatorProps) {
  const hasSelection = groupCode !== '' || text.trim() !== ''

  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      <div className="space-y-1">
        <Label htmlFor="account-group">Grupo</Label>
        <Select value={groupCode} onValueChange={onGroupChange}>
          <SelectTrigger id="account-group" className="w-56">
            <SelectValue placeholder={isLoadingGroups ? 'Cargando...' : 'Elige un grupo'} />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.accountCode} value={group.accountCode as string}>
                {group.accountName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="account-subgroup">Rubro</Label>
        <Select
          value={subGroupCode || ALL_SUBGROUPS}
          onValueChange={onSubGroupChange}
          disabled={groupCode === ''}
        >
          <SelectTrigger id="account-subgroup" className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_SUBGROUPS}>Todos los rubros</SelectItem>
            {subGroups.map((sub) => (
              <SelectItem key={sub.accountCode} value={sub.accountCode as string}>
                {sub.accountName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="account-search">Buscar</Label>
        <Input
          id="account-search"
          className="w-64"
          placeholder="Nombre o código de formato"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </div>

      {hasSelection && (
        <Button variant="ghost" onClick={onClear}>
          <X className="h-4 w-4 mr-2" /> Limpiar
        </Button>
      )}
    </div>
  )
}
