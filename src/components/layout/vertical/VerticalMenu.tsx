// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* <MenuItem href='/home' icon={<i className='ri-home-smile-line' />}>
          Home
        </MenuItem> */}
        <MenuItem href='/pallet' icon={<i className='ri-palette-line' />}>
          Pallets
        </MenuItem>
        <MenuItem href='/new_pallets' icon={<i className='ri-palette-fill' />}>
          New Pallets
        </MenuItem>
        <MenuItem href='/estore' icon={<i className='ri-store-3-fill' />}>
          Estore
        </MenuItem>
        <MenuItem href='/product' icon={<i className='ri-product-hunt-line' />}>
          Products
        </MenuItem>
        <MenuItem href='/shipper_master' icon={<i className='ri-ship-2-fill' />}>
          Shipper Master
        </MenuItem>
        <MenuItem href='/pallet_type_master' icon={<i className='ri-flip-horizontal-line' />}>
          Pallet Type Master
        </MenuItem>
        <MenuItem href='/user-master' icon={<i className='ri-user-settings-fill' />}>
          User Master
        </MenuItem>
        <MenuItem href='/category_master' icon={<i className='ri-flip-horizontal-fill' />}>
          Category Master
        </MenuItem>
        <MenuItem href='/purchase_order' icon={<i className='ri-briefcase-line' />}>
          Purchase Order
        </MenuItem>
        <MenuItem href='/receive-po' icon={<i className='ri-receipt-line' />}>
          Receive PO
        </MenuItem>
        <MenuItem href='/receive_po_new' icon={<i className='ri-briefcase-fill' />}>
          Receive PO New
        </MenuItem>
        <MenuItem href='/receive_po_odoo' icon={<i className='ri-receipt-line' />}>
          Receive PO Odoo
        </MenuItem>
        <MenuItem href='/distribution' icon={<i className='ri-receipt-line' />}>
          Distribution
        </MenuItem>
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
