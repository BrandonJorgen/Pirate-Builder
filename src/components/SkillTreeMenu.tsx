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

    let archetypeTreeButtonMemory = useRef([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    let newMemoryArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let newChoiceMemoryArray: any[] = [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ]

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
    }, 100)

    function AddTab()
    {
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

    function AssignArchetype(tree: string)
    {
        selectedArchetype.current = tree
    }

    function GetArchetypeButtonMemory(array: number[])
    {
        archetypeTreeButtonMemory.current = array
    }

    function GetArchetypePointTrackingValue(value: number)
    {
        archetypePointTrackerValue.current += value
    }

    function GetWeaponButtonMemory(index: number, array: number[])
    { 
        weaponTreeButtonMemories.current[index] = array
    }

    function GetWeaponPointTrackingValue(index: number, value: number)
    {
        weaponPointTrackerValueArray.current[index] += value
    }

    function GetWeaponChoiceButtonMemory(index: number, array:number[])
    {
        weaponChoiceButtonMemories.current[index] = array
    }

    return(
    <div className='skill-tree-menu'>
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList>
                <Tab>Archetype</Tab>
                {instTabs.map((tab, i) => (<Tab key={i - 1}>{tab}</Tab>))}
                <Tab className={"tab-plus"}>+</Tab>
            </TabList>

            <TabPanel>
                <archetype.Provider value={selectedArchetype.current}>
                    <ArchetypeSkillTreeSelector handleArchetypeSelected={AssignArchetype} skillTreeMemoryButtonMemory={archetypeTreeButtonMemory.current} skillTreeFeedButtonMemoryFunction={GetArchetypeButtonMemory} pointTrackerValue={archetypePointTrackerValue.current} pointTrackerValueFunction={GetArchetypePointTrackingValue} choiceButtonMemory={[]} skillTreeFeedChoiceButtonMemoryFunction={function (_index: number, _array: number[]): void {
                            throw new Error('Function not implemented.');
                        } } />
                </archetype.Provider>
            </TabPanel>

            
            {instTabTables.map((i) => (
                <TabPanel>
                    <weapon.Provider value={instTabs}>
                        <WeaponSkillTreeSelector key={i - 1} index={i - 1} handleClick={ChangeTabName} skillTreeMemoryButtonMemory={weaponTreeButtonMemories.current[i - 1]} skillTreeFeedButtonMemoryFunction={GetWeaponButtonMemory} pointTrackerValue={weaponPointTrackerValueArray.current[i - 1]} pointTrackerValueFunction={GetWeaponPointTrackingValue} choiceButtonMemory={weaponChoiceButtonMemories.current[i - 1]} skillTreeFeedChoiceButtonMemoryFunction={GetWeaponChoiceButtonMemory}/>
                    </weapon.Provider>
                </TabPanel>))}
            <TabPanel>
            </TabPanel>
        </Tabs>
    </div>
    )
}