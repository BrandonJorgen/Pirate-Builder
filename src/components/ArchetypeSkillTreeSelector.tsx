import { createContext, useState } from "react";
import SkillTree from "./SkillTree";
import './ArchetypeSkillTreeSelector.css'
import BasicButton from "./BasicButton";

export const ArchetypeSelected = createContext("")

export default function ArchetypeSkillTreeSelector()
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

    let buttonGroup: HTMLElement | null
    let title: HTMLElement | null

    setTimeout(() => {
        buttonGroup = document.getElementById("archetype-selector-buttons")
        title = document.getElementById("archetype-selector-title")
    }, 100)

    function SelectArchetype(event: any)
    {   
        let localButtonID = event.target.id

        switch (localButtonID)
        {
            case tankButtonID:
                console.log("Tank Selected")
                break
            
            case fighterButtonID:
                setSelectedArchetype("Fighter-Skill-Tree")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                break

            case rogueButtonID:
                console.log("Rogue Selected")
                break

            case rangerButtonID:
                console.log("Ranger Selected")
                break

            case mageButtonID:
                console.log("Mage Selected")
                break
            
            case clericButtonID:
                console.log("Cleric Selected")
                break

            case summonerButtonID:
                console.log("Summoner Selected")
                break

            case bardButtonID:
                console.log("Bard Selected")
                break

            default:
                console.log("NO ARCHETYPE SELECTED DESPITE BUTTON PRESS")
        }
    }

    return(
        <div className="archetype-skill-tree-selector">

            <h2 id="archetype-selector-title" data-show="1">SELECT AN ARCHETYPE NEW TEXT</h2>

            <div id="archetype-selector-buttons" data-show="1">
                <BasicButton tooltipSortClass={"archetype-select"} index={0} id={tankButtonID} icon={"public/icons/Class_Icons/TankIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Tank \n coming soon after A2 launch"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={1} id={fighterButtonID} icon={"public/icons/Class_Icons/FighterIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Fighter"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={2} id={rogueButtonID} icon={"public/icons/Class_Icons/RogueIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Rogue \n coming soon after A2 Post Patch"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={3} id={rangerButtonID} icon={"public/icons/Class_Icons/RangerIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Ranger"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={4} id={mageButtonID} icon={"public/icons/Class_Icons/MageIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Mage"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={5} id={clericButtonID} icon={"public/icons/Class_Icons/ClericIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Cleric \n coming soon after A2 launch"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={6} id={summonerButtonID} icon={"public/icons/Class_Icons/SummonerIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Summoner \n coming soon after A2 Post Patch"} />
                <BasicButton tooltipSortClass={"archetype-select"} index={7} id={bardButtonID} icon={"public/icons/Class_Icons/BardIcon.PNG"} handleClick={SelectArchetype} tooltipSide={"bottom"} tooltipText={"Bard \n coming soon after A2 launch"} />
            </div>

            <ArchetypeSelected.Provider value={selectedArchetype}>
                <SkillTree />
            </ArchetypeSelected.Provider>
        </div>
    )
}