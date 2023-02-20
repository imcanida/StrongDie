import './App.css'
import { ToastContainer } from 'react-toastify'
import { Game } from './components'
import 'react-toastify/dist/ReactToastify.css'
import { AppContextProvider } from './context'
import { TopHeader } from './components/TopHeader'

const App = () => {
  return (
    <div className="App">
      <ToastContainer />
      <AppContextProvider>
        <TopHeader />
        <Game />
      </AppContextProvider>
    </div>
  )
}

export default App
