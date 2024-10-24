import { createContext, useContext, useRef, useState } from "react";
import './ArchetypeSkillTreeSelector.css'
import BasicButton from "./BasicButton";
import { archetype } from "./SkillTreeMenu";
import ArchetypeSkillTree from "./ArchetypeSkillTree";

interface ArchetypeSelectorProps
{
    handleArchetypeSelected: (tree:string) => void,
    skillTreeMemoryButtonMemory: number[],
    skillTreeFeedButtonMemoryFunction: (array: number[]) => void,
    pointTrackerValue: number,
    pointTrackerValueFunction: (value: number) => void,
    choiceButtonMemory: number[],
    skillTreeFeedChoiceButtonMemoryFunction: (index: number, array: number[]) => void,
    tabNameFunction: (name: string) => void,
}

export const ArchetypeSelected = createContext("")

export default function ArchetypeSkillTreeSelector({ handleArchetypeSelected, skillTreeMemoryButtonMemory, skillTreeFeedButtonMemoryFunction, pointTrackerValue, pointTrackerValueFunction, choiceButtonMemory, skillTreeFeedChoiceButtonMemoryFunction, tabNameFunction, }: ArchetypeSelectorProps)
{

    const tankButtonID: string = "tank-select-button"
    const fighterButtonID: string = "fighter-select-button"
    const rogueButtonID: string = "rogue-select-button"
    const rangerButtonID: string = "ranger-select-button"
    const mageButtonID: string = "mage-select-button"
    const clericButtonID: string = "cleric-select-button"
    const summonerButtonID: string = "summoner-select-button"
    const bardButtonID: string = "bard-select-button"

    let [ selectedArchetype, setSelectedArchetype ] = useState(" ")

    let archetypeSelected = useRef(0)
    let archetypeContext = useContext(archetype)

    let buttonGroup: HTMLElement | null
    let title: HTMLElement | null

    setTimeout(() => {
        buttonGroup = document.getElementById("archetype-selector-buttons")
        title = document.getElementById("archetype-selector-title")

        if (archetypeContext !== " ")
        {
            TreeMemory()  
        }      
    }, 100)

    function TreeMemory() {
        switch (archetypeContext) 
        {
            case "Fighter":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0");
                if (title !== null)
                    title.setAttribute("data-show", "0");
                archetypeSelected.current = 1
                setSelectedArchetype("Fighter-Skill-Tree")
                handleArchetypeSelected("Fighter")
                break;

            case "Ranger":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0");
                if (title !== null)
                    title.setAttribute("data-show", "0");
                archetypeSelected.current = 1
                setSelectedArchetype("Ranger-Skill-Tree")
                handleArchetypeSelected("Ranger")
                break

            case "Mage":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0");
                if (title !== null)
                    title.setAttribute("data-show", "0");
                archetypeSelected.current = 1
                setSelectedArchetype("Mage-Skill-Tree")
                handleArchetypeSelected("Mage")
                break

            case "Bard":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0");
                if (title !== null)
                    title.setAttribute("data-show", "0");
                archetypeSelected.current = 1
                setSelectedArchetype("Bard-Skill-Tree")
                handleArchetypeSelected("Bard")
                break

            case "Tank":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0");
                if (title !== null)
                    title.setAttribute("data-show", "0");
                archetypeSelected.current = 1
                setSelectedArchetype("Tank-Skill-Tree")
                handleArchetypeSelected("Tank")
                break

            case "Cleric":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0");
                if (title !== null)
                    title.setAttribute("data-show", "0");
                archetypeSelected.current = 1
                setSelectedArchetype("Cleric-Skill-Tree")
                handleArchetypeSelected("Cleric")
                break

            default:
                console.log("Tree memory in Archetype Skill Tree Selector has failed to find an archetype")
        }
    }

    function SelectArchetype(event: any)
    {   
        let localButtonID = event.target.id

        switch (localButtonID)
        {
            case tankButtonID:
                setSelectedArchetype("Tank-Skill-Tree")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                handleArchetypeSelected("Tank")
                tabNameFunction("Tank")
                break
            
            case fighterButtonID:
                setSelectedArchetype("Fighter-Skill-Tree")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                handleArchetypeSelected("Fighter")
                tabNameFunction("Fighter")
                break

            case rogueButtonID:
                console.log("Rogue Selected")
                break

            case rangerButtonID:
                setSelectedArchetype("Ranger-Skill-Tree")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                handleArchetypeSelected("Ranger")
                tabNameFunction("Ranger")
                break

            case mageButtonID:
                setSelectedArchetype("Mage-Skill-Tree")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                handleArchetypeSelected("Mage")
                tabNameFunction("Mage")
                break
            
            case clericButtonID:
                setSelectedArchetype("Cleric-Skill-Tree")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                handleArchetypeSelected("Cleric")
                tabNameFunction("Cleric")
                break

            case summonerButtonID:
                console.log("Summoner Selected")
                break

            case bardButtonID:
                setSelectedArchetype("Bard-Skill-Tree")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                handleArchetypeSelected("Bard")
                tabNameFunction("Bard")
                break

            default:
                console.log("NO ARCHETYPE SELECTED DESPITE BUTTON PRESS")
        }
    }

    return(
        <div className="archetype-skill-tree-selector">

            <h2 id="archetype-selector-title" data-show="1">SELECT AN ARCHETYPE</h2>

            <div id="archetype-selector-buttons" data-show="1">
                <BasicButton tooltipSortClass={"archetype-select"} index={0} id={tankButtonID} icon={"./icons/Class_Icons/TankIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Tank"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={1} id={fighterButtonID} icon={"./icons/Class_Icons/FighterIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Fighter"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={2} id={rogueButtonID} icon={"./icons/Class_Icons/RogueIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Rogue \n Coming soon Phase 2"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={3} id={rangerButtonID} icon={"./icons/Class_Icons/RangerIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Ranger"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={4} id={mageButtonID} icon={"./icons/Class_Icons/MageIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Mage"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={5} id={clericButtonID} icon={"./icons/Class_Icons/ClericIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Cleric"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={6} id={summonerButtonID} icon={"./icons/Class_Icons/SummonerIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Summoner \n  Coming soon Phase 3"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={7} id={bardButtonID} icon={"./icons/Class_Icons/BardIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Bard"} />
            </div>

            <ArchetypeSelected.Provider value={selectedArchetype}>
                <ArchetypeSkillTree buttonMemory={skillTreeMemoryButtonMemory} feedMemoryFunction={skillTreeFeedButtonMemoryFunction} pointTrackerValue={pointTrackerValue} feedPointTrackerValue={pointTrackerValueFunction} choiceButtonMemory={choiceButtonMemory} feedChoiceButtonMemoryFunction={skillTreeFeedChoiceButtonMemoryFunction} />
            </ArchetypeSelected.Provider>
        </div>
    )
}