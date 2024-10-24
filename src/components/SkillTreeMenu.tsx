import './SkillTreeMenu.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ArchetypeSkillTreeSelector from './ArchetypeSkillTreeSelector'
import WeaponSkillTreeSelector from './WeaponSkillTreeSelector'
import { createContext, useRef, useState } from 'react'

export const archetype = createContext(" ")
export const weapon = createContext([" "])

export default function SkillTreeMenu()
{

    const [ tabIndex, setTabIndex ] = useState(0)

    let numberOfTabs = useRef<number>(1) // 0 based value
    let [ instTabs, setInstTabs ] =  useState<string[]>([])
    let [ instTabTables, setInstTabTables ] = useState<any[]>([])

    let selectedArchetype = useRef(" ")

    let [ archetypeTabName, setArchetypeTabName ] = useState("Archetype")

    let archetypeTreeButtonMemory = useRef([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    let archetypeChoiceButtonMemory = useRef<any[]>([ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,  , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,  , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,  , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ])
    let newMemoryArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let newChoiceMemoryArray: any[] = [ , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ]

    let archetypePointTrackerValue = useRef(0)

    // Array of skill tree memories, one item for each instantiated skill tree (Wand has 47 buttons)
    let weaponTreeButtonMemories = useRef<number[][]>([])
    let weaponPointTrackerValueArray = useRef<number[]>([])
    let weaponChoiceButtonMemories = useRef<number[][]>([]) // An array in this array should only hold the value of what choice was made. There should be an index for each button, type 2 or not doesn't matter

    setTimeout(() => {
        if (tabIndex === numberOfTabs.current) // The + tab in the array
        {
            AddTab()
            setTabIndex(numberOfTabs.current - 1) // The tab before the + tab
        }

        if (numberOfTabs.current > 1) {
            if (tabIndex > 0)
            {
                //selectedWeapon.current = instTabs[tabIndex - 1]
            }
        }

        console.log(archetypeChoiceButtonMemory.current)
    }, 100)

    function AddTab()
    {
        console.log("AddTab was called")
        setInstTabs((instTabs: string[]) => [...instTabs, "Weapon"])
        setInstTabTables((instTabTables: any[]) => [...instTabTables, numberOfTabs.current - 1])

        // set up weapon memory for new tab
        weaponTreeButtonMemories.current[numberOfTabs.current - 1] = newMemoryArray
        weaponPointTrackerValueArray.current[numberOfTabs.current - 1] = 0
        weaponChoiceButtonMemories.current[numberOfTabs.current - 1] = newChoiceMemoryArray

        numberOfTabs.current++ //This should be ran at the end of this code block just to make sure everything is set up correctly
    }

    function ChangeTabName(index: number, name: string)
    {
        console.log("A tab was just renamed")

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

    function ChangeArchetypeTabName(name: string)
    {
        setArchetypeTabName(name)
    }

    function AssignArchetype(tree: string)
    {
        selectedArchetype.current = tree
    }

    function GetArchetypeButtonMemory(array: number[])
    {
        archetypeTreeButtonMemory.current = array
    }

    function GetArchetypeChoiceButtonMemory(_index: number, _array: number[])
    {
        
    }

    function GetArchetypePointTrackingValue(value: number)
    {
        archetypePointTrackerValue.current += value
    }

    function GetWeaponButtonMemory(_index: number, _array: number[])
    { 
        //This just adds a new array every time while also seemingly updating the correct one?
        //weaponTreeButtonMemories.current[index] = array
    }

    function GetWeaponPointTrackingValue(index: number, value: number)
    {
        weaponPointTrackerValueArray.current[index] += value
    }

    function GetWeaponChoiceButtonMemory(_index: number, _array:number[])
    {
        //This just adds a new array every time while also seemingly updating the correct one?
        //weaponChoiceButtonMemories.current[index] = array
    }

    function RemoveWeaponTreeMemory(index: number)
    {
        console.log(weaponTreeButtonMemories)
        weaponTreeButtonMemories.current.splice(index, 1)
        console.log(weaponTreeButtonMemories)
    }

    return(
    <div className='skill-tree-menu'>
        <div className='skill-tree-menu-bg' />
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList>
                <Tab>{archetypeTabName}</Tab>
                {instTabs.map((tab, i) => (<Tab key={i - 1}>{tab}</Tab>))}
                <Tab className={"tab-plus"}>+</Tab>
            </TabList>

            <TabPanel>
                <archetype.Provider value={selectedArchetype.current}>
                    <ArchetypeSkillTreeSelector handleArchetypeSelected={AssignArchetype} skillTreeMemoryButtonMemory={archetypeTreeButtonMemory.current} skillTreeFeedButtonMemoryFunction={GetArchetypeButtonMemory} pointTrackerValue={archetypePointTrackerValue.current} pointTrackerValueFunction={GetArchetypePointTrackingValue} choiceButtonMemory={archetypeChoiceButtonMemory.current} skillTreeFeedChoiceButtonMemoryFunction={GetArchetypeChoiceButtonMemory} tabNameFunction={ChangeArchetypeTabName} />
                </archetype.Provider>
            </TabPanel>

            
            {instTabTables.map((i) => (
                <TabPanel>
                    <weapon.Provider value={instTabs}>
                        <WeaponSkillTreeSelector key={i - 1} index={i - 1} handleClick={ChangeTabName} skillTreeMemoryButtonMemory={weaponTreeButtonMemories.current[i - 1]} skillTreeFeedButtonMemoryFunction={GetWeaponButtonMemory} pointTrackerValue={weaponPointTrackerValueArray.current[i - 1]} pointTrackerValueFunction={GetWeaponPointTrackingValue} choiceButtonMemory={weaponChoiceButtonMemories.current[i - 1]} skillTreeFeedChoiceButtonMemoryFunction={GetWeaponChoiceButtonMemory} removeTreeMemoryFunction={RemoveWeaponTreeMemory}/>
                    </weapon.Provider>
                </TabPanel>))}
            <TabPanel>
            </TabPanel>
        </Tabs>
    </div>
    )
}