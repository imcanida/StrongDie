import logo from './logo.svg'
import './App.css'
import { Navbar, NavbarBrand } from 'reactstrap'
import Game from './components/Game'
const App = () => {
  return (
    <div className="App">
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
      </Navbar>
      <Game />
    </div>
  )
}

export default App
