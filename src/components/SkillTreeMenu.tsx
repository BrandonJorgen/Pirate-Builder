import './SkillTreeMenu.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ArchetypeSkillTreeSelector from './ArchetypeSkillTreeSelector'
import WeaponSkillTreeSelector from './WeaponSkillTreeSelector'
import { useRef, useState } from 'react'

export default function SkillTreeMenu()
{

    //TODO: Tab system for multiple skilltree viewing 

    // An array of every tab (should start at 1 (0 based) to account for Archetype and + tab)
    // A state of the currently selected tab (should not be any longer than the tab array)
    // If the + tab is selected through the selected state, create a new tab and swap our selected state to the new tab

    // What does an instanced TAB look like?
    // <Tab> NAME OF THE WEAPON OR WEAPON SELECTOR </Tab>
    // How the fuck do I change this text FROM THE CHILD :(

    const [ tabIndex, setTabIndex ] = useState(0)

    let numberOfTabs = useRef(1) // 0 based value
    let [ instTabs, setInstTabs ] =  useState<any[]>([])
    let [ instTabTables, setInstTabTables ] = useState<any[]>([])

    setTimeout(() => {
        if (tabIndex === numberOfTabs.current) // The + tab in the array
        {
            AddTab()
            setTabIndex(numberOfTabs.current - 1) // The tab before the + tab
        }
    }, 100)

    function AddTab()
    {
        console.log("ADD TAB")
        setInstTabs((instTabs: any[]) => [...instTabs, "Weapon"])
        setInstTabTables((instTabTables: any[]) => [...instTabTables, numberOfTabs.current - 1])
        numberOfTabs.current++ //This should be ran at the end of this code block just to make sure everything is set up correctly
    }

    function ChangeTabName(index: number, name: string)
    {
        console.log("Index: " + index + ", Name: " + name)

        let tempArray = instTabs.map((tab, i) => {
            if (i === index)
            {
                return name
            }
            else
            {
                return tab
            }
        })

        setInstTabs(tempArray)

    }

    return(
    <div className='skill-tree-menu'>
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList>
                <Tab>Archetype</Tab>
                {instTabs.map((tab, i) => (<Tab key={i}>{tab}</Tab>))}
                <Tab className={"tab-plus"}>+</Tab>
            </TabList>

            <TabPanel>
                <ArchetypeSkillTreeSelector />
            </TabPanel>
            {instTabTables.map((i) => (<TabPanel><WeaponSkillTreeSelector key={i} index={i} handleClick={ChangeTabName}/></TabPanel>))}
            <TabPanel>
            </TabPanel>
        </Tabs>
    </div>
    )
}