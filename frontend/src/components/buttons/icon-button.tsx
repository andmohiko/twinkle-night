import { ActionIcon } from '@mantine/core'

import {
  type ButtonImportance,
  type ButtonSize,
  buttonColor,
  getButtonVariant,
} from '@/components/buttons/types'

type Props = {
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  importance?: ButtonImportance
  disabled?: boolean
  loading?: boolean
  size?: ButtonSize
}

export const IconButton = ({
  icon,
  onClick,
  importance = 'primary',
  disabled = false,
  loading = false,
  size = 'md',
}: Props): React.ReactElement => (
  <ActionIcon
    onClick={onClick}
    variant={getButtonVariant(importance)}
    disabled={disabled}
    loading={loading}
    color={buttonColor}
    size={size}
    radius={10}
  >
    {icon}
  </ActionIcon>
)
