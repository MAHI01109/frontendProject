import { Outlet } from "react-router-dom"
import Navbar from "./components/common/navbar"


function App() {


  return (
    <div className="relative">
      <Navbar />
      <main className="flex items-center mt-20 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <Outlet />
      </main>

    </div>
  )
}

export default App
