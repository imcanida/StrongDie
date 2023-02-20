import { useContext } from 'react'
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap'
import { AppContextDetails, AppContext } from '../../context'
import { StrongDieButton } from '../../helpers/Styles'
import logo from '../../logo.svg'

const TopHeader = () => {
  const { player, setPlayer } = useContext<AppContextDetails>(AppContext)
  const handleLogout = () => {
    setPlayer(undefined)
  }
  return (
    <Navbar className="my-2" color="dark" dark>
      <NavbarBrand href="/">
        <img
          alt="logo"
          src={logo}
          style={{
            height: 40,
            width: 40,
          }}
        />{' '}
        <small style={{ fontSize: '12px' }}>Strong-Die</small>
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        {player ? (
          <>
            <p style={{ color: 'white' }}>User: {player.userName}</p>
            <NavItem>
              <StrongDieButton onClick={handleLogout}>Logout</StrongDieButton>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <p style={{ color: 'white' }}>Join a game</p>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  )
}
export { TopHeader }
