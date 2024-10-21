import './WeaponSkillTreeSelector.css'
import BasicButton from "./BasicButton";
import { createContext, useContext, useState } from 'react';
import WeaponSkillTree from './WeaponSkillTree';
import { weapon } from './SkillTreeMenu';

interface WeaponSkillTreeSelectorProps{
    index: number,
    handleClick: (index: number, name: string) => void,
    skillTreeMemoryButtonMemory: number[],
    skillTreeFeedButtonMemoryFunction: (index: number, array: number[]) => void,
    pointTrackerValue: number,
    pointTrackerValueFunction: (index: number, value: number) => void,
    choiceButtonMemory: number[],
    skillTreeFeedChoiceButtonMemoryFunction: (index: number, array: number[]) => void,
    removeTreeMemoryFunction: (index: number) => void,
}

export const WeaponSelected = createContext("")

export default function WeaponSkillTreeSelector({ index = 0, handleClick, skillTreeMemoryButtonMemory, skillTreeFeedButtonMemoryFunction, pointTrackerValue, pointTrackerValueFunction, choiceButtonMemory, skillTreeFeedChoiceButtonMemoryFunction }: WeaponSkillTreeSelectorProps)
{
    const greatswordButtonID = "greatsword-select-button"
    const maceButtonID = "mace-select-button"
    const swordButtonID = "sword-select-button"
    const wandButtonID = "wand-select-button"
    const scepterButtonID = "scepter-select-button"
    const spellbookButtonID = "spellbook-select-button"
    const bowButtonID = "bow-select-button"
    const shieldButtonID = "shield-select-button"
    const focusButtonID = "focus-select-button"

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

    function BackButton()
    {
        console.log("Registered BACK BUTTON press")
        
        // hide the current tree
        
        // show the tree selector
        handleClick(index, "Weapon")
        if (buttonGroup !== null)
            buttonGroup.setAttribute("data-show", "1")
        if (title !== null)
            title.setAttribute("data-show", "1")
        setSelectedWeapon("back")
    }

    return(
        <div className="weapon-skill-tree-selector">

            <h2 id="weapon-selector-title" data-show="1">SELECT A WEAPON</h2>

            <div id="weapon-selector-buttons" data-show="1">
                <BasicButton index={0} id={greatswordButtonID} icon={"./icons/Class_Icons/FighterIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Greatsword"} handleClick={SelectWeapon} />
                <BasicButton index={1} id={maceButtonID} icon={"./icons/Class_Icons/FighterIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"1H Mace \n Coming Soon Wave 1"} handleClick={SelectWeapon} />
                <BasicButton index={2} id={swordButtonID} icon={"./icons/Class_Icons/FighterIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"1H Sword \n Coming Soon Wave 1"} handleClick={SelectWeapon} />
                <BasicButton index={3} id={wandButtonID} icon={"./icons/Class_Icons/MageIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Wand"} handleClick={SelectWeapon} />
                <BasicButton index={4} id={scepterButtonID} icon={"./icons/Class_Icons/MageIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Scepter \n Coming Soon Wave 1"} handleClick={SelectWeapon} />
                <BasicButton index={5} id={spellbookButtonID} icon={"./icons/Class_Icons/MageIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Spellbook \n Coming Soon Wave 1"} handleClick={SelectWeapon} />
                <BasicButton index={6} id={bowButtonID} icon={"./icons/Class_Icons/RangerIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Bow"} handleClick={SelectWeapon} />
                <BasicButton index={7} id={shieldButtonID} icon={"./icons/Class_Icons/FighterIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Shield \n Coming Soon Wave 1"} handleClick={SelectWeapon} />
                <BasicButton index={8} id={focusButtonID} icon={"./icons/Class_Icons/MageIcon.PNG"} tooltipSortClass={"weapon-select"} tooltipSide={"bottom"} tooltipText={"Focus \n Coming Soon Wave 1"} handleClick={SelectWeapon} />
            </div>

            <WeaponSelected.Provider value={selectedWeapon}>
                <WeaponSkillTree index={index} buttonMemory={skillTreeMemoryButtonMemory} feedMemoryFunction={skillTreeFeedButtonMemoryFunction} pointTrackerValue={pointTrackerValue} feedPointTrackerValue={pointTrackerValueFunction} choiceButtonMemory={choiceButtonMemory} feedChoiceButtonMemoryFunction={skillTreeFeedChoiceButtonMemoryFunction} backButtonFunction={BackButton} />
            </WeaponSelected.Provider>
            
        </div>
    )
}