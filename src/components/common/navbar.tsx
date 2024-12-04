import { Link } from 'react-router-dom'
import { ModeToggle } from '../ui/mode-toggle'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  return (
    <div className='supports-backdrop-blur:bg-white/95 dark:bg-gray-950/75 h-16 w-full fixed top-0 left-0 right-0 flex px-12 justify-between items-center border border-b shadow-md'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to={'/'} >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home 
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to={'/list'} >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                List
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ModeToggle />
    </div>
  )
}
