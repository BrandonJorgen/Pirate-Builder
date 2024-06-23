import './WeaponSkillTreeSelector.css'
import BasicButton from "./BasicButton";
import { createContext, useContext, useRef, useState } from 'react';
import WeaponSkillTree from './WeaponSkillTree';
import { weapon } from './SkillTreeMenu';

interface WeaponSkillTreeSelectorProps{
    index: number,
    handleClick: (index: number, name: string) => void,
    skillTreeMemoryButtonMemory: number[],
    skillTreeFeedButtonMemoryFunction: (index: number, array: number[]) => void,
    pointTrackerValue: number,
    pointTrackerValueFunction: (index: number, value: number) => void,
}

export const WeaponSelected = createContext("")

export default function WeaponSkillTreeSelector({ index = 0, handleClick, skillTreeMemoryButtonMemory, skillTreeFeedButtonMemoryFunction, pointTrackerValue, pointTrackerValueFunction, }: WeaponSkillTreeSelectorProps)
{
    const greatswordButtonID = "greatsword-select-button"
    const wandButtonID = "wand-select-button"
    const bowButtonID = "bow-select-button"

    let [ selectedWeapon, setSelectedWeapon ] = useState(" ")

    let buttonGroup: HTMLElement | null
    let title: HTMLElement | null

    let weaponContext = useContext(weapon)

    setTimeout(() => {
        buttonGroup = document.getElementById("weapon-selector-buttons")
        title = document.getElementById("weapon-selector-title")

        if (weaponContext[index] !== " ")
        {
            TreeMemory()
        }
            
    }, 100)

    function TreeMemory()
    {
        switch (weaponContext[index])
        {
            case "Greatsword":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                setSelectedWeapon("Greatsword-Skill-Tree")
                //handleClick(index, "Greatsword")
                break

            case "Wand":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                setSelectedWeapon("Wand-Skill-Tree")
                //handleClick(index, "Wand")
                break

            case "Bow":
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                setSelectedWeapon("Bow-Skill-Tree")
                //handleClick(index, "Bow")
                break
        }
    }

    function SelectWeapon(event: any)
    {
        let localButtonID = event.target.id

        switch (localButtonID)
        {
            case greatswordButtonID:
                setSelectedWeapon("Greatsword-Skill-Tree")
                handleClick(index, "Greatsword")
                if (buttonGroup !== null)
                    buttonGroup.setAttribute("data-show", "0")
                if (title !== null)
                    title.setAttribute("data-show", "0")
                break
            
            case wandButtonID:
                setSelectedWeapon("Wand-Skill-Tree")
                handleClick(index, "Wand")
            if (buttonGroup !== null)
                buttonGroup.setAttribute("data-show", "0")
            if (title !== null)
                title.setAttribute("data-show", "0")
            break

            case bowButtonID:
                setSelectedWeapon("Bow-Skill-Tree")
                handleClick(index, "Bow")
            if (buttonGroup !== null)
                buttonGroup.setAttribute("data-show", "0")
            if (title !== null)
                title.setAttribute("data-show", "0")
            break

            default:
                console.log("NO WEAPON SELECTED DESPITE BUTTON PRESS")
        }
    }

    return(
        <div className="weapon-skill-tree-selector">

            <h2 id="weapon-selector-title" data-show="1">SELECT A WEAPON</h2>

            <div id="weapon-selector-buttons" data-show="1">
                <BasicButton index={0} id={greatswordButtonID} icon={"./icons/Class_Icons/FighterIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Greatsword"} handleClick={SelectWeapon} />
                <BasicButton index={1} id={wandButtonID} icon={"./icons/Class_Icons/MageIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Wand"} handleClick={SelectWeapon} />
                <BasicButton index={2} id={bowButtonID} icon={"./icons/Class_Icons/RangerIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Bow"} handleClick={SelectWeapon} />
            </div>

            <WeaponSelected.Provider value={selectedWeapon}>
                <WeaponSkillTree index={index} buttonMemory={skillTreeMemoryButtonMemory} feedMemoryFunction={skillTreeFeedButtonMemoryFunction} pointTrackerValue={pointTrackerValue} feedPointTrackerValue={pointTrackerValueFunction} />
            </WeaponSelected.Provider>
            
        </div>
    )
}