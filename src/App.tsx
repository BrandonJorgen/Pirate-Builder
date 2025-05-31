import './App.css'
import Header from './components/Header'
import SkillTreeMenu from './components/SkillTreeMenu'

function App() {

  return (
    <div className='app'>
        <SkillTreeMenu />
        <Header />
        <p>Many of the Archetype skill trees are WIP until after the first A2 weekend</p>
    </div>
  )
}

export default App
