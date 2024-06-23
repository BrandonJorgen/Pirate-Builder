import { createContext, useContext, useRef, useState } from 'react'
import SkillButton from './SkillButton'
import SkillConnection from './SkillConnection'
import './WeaponSkillTree.css'
import SkillPointTracker from './SkillPointTracker'
import { WeaponSelected } from './WeaponSkillTreeSelector'

interface SkillTreeProps
{
    index: number;
    buttonMemory: number[],
    feedMemoryFunction: (index: number, array: number[]) => void,
    pointTrackerValue: number,
    feedPointTrackerValue: (index: number, value: number) => void,
}

export const weaponSkillPointCount = createContext(0)

export default function WeaponSkillTree({ index, buttonMemory, feedMemoryFunction, pointTrackerValue, feedPointTrackerValue, }: SkillTreeProps)
{
    let skillButtons: HTMLCollectionOf<Element>

    let lines: HTMLCollectionOf<Element>

    let tempCount = useRef(pointTrackerValue)

    const [ count, setCount] = useState(pointTrackerValue)

    let selectedWeapon = useContext(WeaponSelected)

    let buttonMemoryArray = buttonMemory

    let useMemory = useRef(1) //used to determine if we need to access the button memory or not

    setTimeout(() => {

        skillButtons = document.getElementsByClassName("skill-button")
        lines = document.getElementsByClassName("skill-connection")

        let treeToShow = document.getElementById(selectedWeapon)

        if (treeToShow === null)
            return

        treeToShow?.setAttribute("data-show", "1")

        if (useMemory.current === 1) 
        {
            TreeMemory()
        }
        
    }, 100)

    function TreeMemory()
    {


        useMemory.current = 0

        // Loop through the memory array to determine what state each button should be in, Pressed or not
        for (let i = 0; i < buttonMemoryArray.length; i++)
        {
            // Does this skill tree use every item in the memory array?
            if (i > skillButtons.length)
                break

            for (let o = 0; o < skillButtons.length; o++)
            {
                // Is this the same button assigned to this position in the memory array?
                if (i === o)
                {
                    if (buttonMemoryArray[i] === 0)
                        continue

                    skillButtons[o].setAttribute("data-selected", "1")

                    let connectedArray = skillButtons[o].getAttribute("data-connected-buttons")?.split(',').map(Number)

                    let connectedLineArray = skillButtons[o].getAttribute("data-connected-lines")?.split(',').map(Number)

                    if (connectedArray !== undefined && connectedLineArray !== undefined)
                    {
                        UpdateConnections(o, connectedArray, connectedLineArray)
                    }
                }
            }
        }
    }
    

    function handleClick(index:number, connectedButtons: number[], connectedLines: number[])
    {
        if (skillButtons[index].getAttribute("data-selected") === "0")
        {
            DecrementCount()
        }
        
        if (skillButtons[index].getAttribute("data-selected") === "1")
        {
            IncrementCount()
        }

        UpdateConnections(index, connectedButtons, connectedLines)
            
    }

    function UpdateConnections(index: number, connectedButtons: number[], connectedLines: number[])
    {
        //Button is pressed
        if (skillButtons[index].getAttribute("data-selected") === "1")
        {

            // SKILL BUTTONS

            // Enable connected buttons
            if (connectedButtons.length > 0)
            {
                //Loop through the connected buttons array and enabled every button
                for (let i = 0; i < connectedButtons.length; i++)
                {
                    if (skillButtons[connectedButtons[i]] === undefined)
                        return

                    skillButtons[connectedButtons[i]].setAttribute("data-disabled", "0")

                    //Multipath button type increment connecting count
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "1")
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-connection-count") != null) 
                        {
                            // convert the connection count attribute to a number
                            let tempNumber = Number(skillButtons[connectedButtons[i]].getAttribute("data-connection-count"))

                            // ++ the variable
                            ++tempNumber

                            // convert the variable back into a string and set the attribute
                            skillButtons[connectedButtons[i]].setAttribute("data-connection-count", tempNumber.toString())
                        }
                    }

                }
                UpdateLines(index, connectedLines)
            }

            buttonMemoryArray[index] = 1
            feedMemoryFunction(index, buttonMemoryArray)
        }
        //Button isn't pressed
        else
        {

            // Disable and Deselect connected buttons
            if (connectedButtons.length > 0)
            {
                //This exists to fix an issue of skill buttons not having a connecting button (usually represented with "") but causing an infinite loop
                if(skillButtons[index].getAttribute("data-connected-buttons") === "")
                    return

                //Loop through the connected buttons array and enabled every button
                for (let i = 0; i < connectedButtons.length; i++)
                {
                    if (skillButtons[connectedButtons[i]] === undefined)
                        return

                    //Basic button type disable and deselect
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "0") 
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-selected") === "1")
                        {
                            skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                            skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                            DecrementCount()
                        }
                        else
                        {
                            skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                        }
                    }

                    //Multipath button type disable and deselect
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "1")
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-connection-count") != null) 
                        {
                            // convert the connection count attribute to a number
                            let tempNumber = Number(skillButtons[connectedButtons[i]].getAttribute("data-connection-count"))

                            // -- the variable
                            --tempNumber

                            if (tempNumber < 0)
                                tempNumber = 0

                            // convert the variable back into a string and set the attribute
                            skillButtons[connectedButtons[i]].setAttribute("data-connection-count", tempNumber.toString())

                            console.log("How many times did I get called? --")

                            // check if the "connection count" is 0, if so then deselect and disable the button
                            if (tempNumber <= 0)
                            {
                                if (skillButtons[connectedButtons[i]].getAttribute("data-selected") === "1")
                                {
                                    skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                                    skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                                    DecrementCount()
                                }
                                else
                                {
                                    skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                                }
                            }
                        }
                    }

                    //then call the same function with the data of those connected buttons
                    //The data-connected-buttons array comes through as a single string, we need to covert it to a number array
                    //this is the array of connected buttons that are attached to our connected button
                    let connectedArray = skillButtons[connectedButtons[i]].getAttribute("data-connected-buttons")?.split(',').map(Number)

                    let connectedLineArray = skillButtons[connectedButtons[i]].getAttribute("data-connected-lines")?.split(',').map(Number)

                    if (connectedArray !== undefined && connectedLineArray !== undefined)
                        UpdateConnections(connectedButtons[i], connectedArray, connectedLineArray)
                }
            }

            UpdateLines(index, connectedLines)

            buttonMemoryArray[index] = 0
            feedMemoryFunction(index, buttonMemoryArray)
        }
    }

    function UpdateLines(index: number, connectionLines: number[])
    {
        let tempCount: number = 0

        // Button Pressed
        if (skillButtons[index].getAttribute("data-selected") === "1") {
            // Does this button have any connection lines?
            if (connectionLines.length > 0)
            {
                for (let i = 0; i < connectionLines.length; i++)
                {
                    if (lines[connectionLines[i]] === undefined)
                        return

                    if (lines[connectionLines[i]].getAttribute("data-multi") === "1")
                    {
                        tempCount = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))

                        ++tempCount

                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())
                    }

                    lines[connectionLines[i]].setAttribute("data-active", "1")
                        
                }
            }
        }
        // Deactivate the connection line
        // Button not Pressed
        else
        {
            // Button has connection lines assigned
            if (connectionLines.length > 0)
            {
                for (let i = 0; i < connectionLines.length; i++)
                {
                    // Does this line exist?
                    if (lines[connectionLines[i]] === undefined)
                        return

                    // Disable the line
                    if (lines[connectionLines[i]].getAttribute("data-multi") === "0")
                    {
                        lines[connectionLines[i]].setAttribute("data-active", "0")
                    }
                    else
                    {
                        tempCount = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))
                        --tempCount

                        if ( tempCount < 0)
                            tempCount = 0

                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())

                        if (tempCount <=0)
                            lines[connectionLines[i]].setAttribute("data-active", "0")
                    }
                }
            }
        }
    }

    function IncrementCount()
    {
        tempCount.current = tempCount.current + 1
        feedPointTrackerValue(index, 1)
        setCount(tempCount.current)
        
    }

    function DecrementCount()
    {
        tempCount.current = tempCount.current - 1
        feedPointTrackerValue(index, -1)
        setCount(tempCount.current)
        
    }

    return(
    <div className='weapon-skill-tree'>
        <div className='skill-tree' id='Greatsword-Skill-Tree' data-show="0">
            <div className='skill-tree-bg' />

            <weaponSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'greatsword-tree-skill-point-tracker'} maxPoints={43} parentName={'Weapon'} />
            </weaponSkillPointCount.Provider>

            <SkillButton tooltipSortClass={'skill-tree'} index={0} positionRow={'8'} positionColumn={'6'} buttonType={2} icon={'./icons/skill_Icons/Fighter/LethalBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Lethal Blow'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'10s'} tooltipCastTime={'1.1s'} tooltipDescription={'Deals damage based on the % amount of health the target is missing (up to 300% base damage)'} tooltipUseOrCast={'use'} tooltipResource={'Mana'}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={1} positionRow={'8'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Fighter/LethalBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Lethal Blow'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'10s'} tooltipCastTime={'1.1s'} tooltipDescription={'Deals damage based on the % amount of health the target is missing (up to 300% base damage)'} tooltipUseOrCast={'use'} tooltipResource={'Mana'}  />
        </div>
    </div>
    )
}