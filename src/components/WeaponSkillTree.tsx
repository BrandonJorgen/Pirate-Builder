import { createContext, useContext, useRef, useState } from 'react'
import SkillButton from './SkillButton'
import './WeaponSkillTree.css'
import SkillPointTracker from './SkillPointTracker'
import { WeaponSelected } from './WeaponSkillTreeSelector'
import SkillConnection from './SkillConnection'
import BasicButton from './BasicButton'

interface SkillTreeProps
{
    index: number;
    buttonMemory: number[],
    feedMemoryFunction: (index: number, array: number[]) => void,
    pointTrackerValue: number,
    feedPointTrackerValue: (index: number, value: number) => void,
    choiceButtonMemory: number[],
    feedChoiceButtonMemoryFunction: (index: number, array: number[]) => void,
    backButtonFunction: () => void,
}

export const weaponSkillPointCount = createContext(0)

export default function WeaponSkillTree({ index, buttonMemory, feedMemoryFunction, pointTrackerValue, feedPointTrackerValue, choiceButtonMemory, feedChoiceButtonMemoryFunction, backButtonFunction }: SkillTreeProps)
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
    

    function handleClick(index: number, connectedButtons: number[], connectedLines: number[])
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

                    // Choice button type disable and deselect
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "2")
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-selected") === "1")
                        {
                            skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                            skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                            // Clear it's choice if it has one
                            choiceButtonMemory[connectedButtons[i]] = -1
                            DecrementCount()
                        }
                        else
                        {
                            skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                            // Clear it's choice if it has one
                        }
                    }

                    //then call the same function with the data of those connected buttons
                    //The data-connected-buttons array comes through as a single string, we need to covert it to a number array
                    //this is the array of connected buttons that are attached to our connected button
                    let connectedArray = skillButtons[connectedButtons[i]].getAttribute("data-connected-buttons")?.split(',').map(Number)

                    let connectedLineArray = skillButtons[connectedButtons[i]].getAttribute("data-connected-lines")?.split(',').map(Number)

                    if (connectedArray !== undefined && connectedLineArray !== undefined)
                    {
                        UpdateConnections(connectedButtons[i], connectedArray, connectedLineArray)
                    }
                }
            }

            UpdateLines(index, connectedLines)

            buttonMemoryArray[index] = 0
            feedMemoryFunction(index, buttonMemoryArray)
        }

        if (tempCount.current >= 24)
        {
            for (let i = 0; i < skillButtons.length; i++)
            {
                //skillButtons[i].setAttribute("data-was-disabled", "0")

                if ((skillButtons[i].getAttribute("data-selected") === "0") && (skillButtons[i].getAttribute("data-disabled") === "0"))
                {
                    // disable the button
                    skillButtons[i].setAttribute("data-disabled", "1")
                    skillButtons[i].setAttribute("data-was-disabled", "1")
                }
            }
        }
        else
        {
            for (let i = 0; i < skillButtons.length; i++) 
            {

                if (skillButtons[i].getAttribute("data-was-disabled") === "1")
                {
                    skillButtons[i].setAttribute("data-disabled", "0")
                    skillButtons[i].setAttribute("data-was-disabled", "0")

                    for (let o = 0; o < connectedButtons.length; o++)
                    {
                        skillButtons[connectedButtons[o]].setAttribute("data-disabled", "1")
                    }
                }
            }
        }
    }

    function UpdateLines(index: number, connectionLines: number[])
    {
        let tempNumber: number = 0

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
                        tempNumber = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))

                        ++tempNumber

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
                        tempNumber = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))
                        --tempNumber

                        if ( tempNumber < 0)
                            tempNumber = 0

                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())

                        if (tempNumber <=0)
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

    function UpdateChoiceMemory(index: number, choice: number)
    {
        choiceButtonMemory[index] = choice
        feedChoiceButtonMemoryFunction(index, choiceButtonMemory)
    }

    function ResetTree(event: any)
    {

        // Reset every button in the tree that should be reset
        for (let i = 0; i < skillButtons.length; i++)
        {
            if (skillButtons[i].getAttribute("data-selected") === "1")
            {
                skillButtons[i].setAttribute("data-selected", "0")

                feedPointTrackerValue(index, -1)

                let connectedArray = skillButtons[i].getAttribute("data-connected-buttons")?.split(',').map(Number)

                let connectedLineArray = skillButtons[i].getAttribute("data-connected-lines")?.split(',').map(Number)

                if (connectedArray !== undefined && connectedLineArray !== undefined)
                {
                    UpdateConnections(i, connectedArray, connectedLineArray)
                }
            }
        }

        // Reset the skill point tracker value
        tempCount.current = 0
        setCount(tempCount.current)

        // Reset every connection line in the tree
        for (let i = 0; i < lines.length; i++)
        {
            if (lines[i].getAttribute("data-active") === "1")
            {
                lines[i].setAttribute("data-active", "0")
            }
        }

        // Reset the tree's memory
        for (let i = 0; i < skillButtons.length; i++) 
        {
            buttonMemoryArray[i] = 0
            feedMemoryFunction(i, buttonMemoryArray)
        }

        // Reset the tree's choice memory
        for (let i = 0; i < skillButtons.length; i++)
        {
            choiceButtonMemory[i] = -1
        }
    }

    function BackButton()
    {
        // Reset every button in the tree that should be reset
        for (let i = 0; i < skillButtons.length; i++)
        {
            if (skillButtons[i].getAttribute("data-selected") === "1")
            {
                skillButtons[i].setAttribute("data-selected", "0")

                feedPointTrackerValue(index, -1)

                let connectedArray = skillButtons[i].getAttribute("data-connected-buttons")?.split(',').map(Number)

                let connectedLineArray = skillButtons[i].getAttribute("data-connected-lines")?.split(',').map(Number)

                if (connectedArray !== undefined && connectedLineArray !== undefined)
                {
                    UpdateConnections(i, connectedArray, connectedLineArray)
                }
            }
        }

        // Reset the skill point tracker value
        tempCount.current = 0
        setCount(tempCount.current)

        // Reset every connection line in the tree
        for (let i = 0; i < lines.length; i++)
        {
            if (lines[i].getAttribute("data-active") === "1")
            {
                lines[i].setAttribute("data-active", "0")
            }
        }

        // Reset the tree's memory
        for (let i = 0; i < skillButtons.length; i++) 
        {
            buttonMemoryArray[i] = 0
            feedMemoryFunction(i, buttonMemoryArray)
        }

        // Reset the tree's choice memory
        for (let i = 0; i < skillButtons.length; i++)
        {
            choiceButtonMemory[i] = -1
        }

        let treeToShow = document.getElementById(selectedWeapon)

        if (treeToShow === null)
            return

        treeToShow?.setAttribute("data-show", "0")
        backButtonFunction()
        
    }

    return(
    <div className='weapon-skill-tree'>
        <div className='skill-tree' id='Greatsword-Skill-Tree' data-show="0">
            <div className='skill-tree-bg' />

            <div className='greatsword-skill-tree-buttons'>
                <div className='greatsword-skill-tree-buttons-bg'/>

                {/*<SkillConnection index={37} connectionType={0} styleLeft={'0px'} styleTop={'0px'} styleWidth={'75px'} styleRotation={'0'} />*/}
                <SkillConnection index={0} connectionType={0} styleLeft={'82px'} styleTop={'1050px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={1} connectionType={0} styleLeft={'82px'} styleTop={'950px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={2} connectionType={0} styleLeft={'82px'} styleTop={'880px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={3} connectionType={0} styleLeft={'300px'} styleTop={'1200px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={4} connectionType={0} styleLeft={'263px'} styleTop={'1167px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={5} connectionType={0} styleLeft={'263px'} styleTop={'1080px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={6} connectionType={0} styleLeft={'263px'} styleTop={'950px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={7} connectionType={0} styleLeft={'622px'} styleTop={'1080px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={8} connectionType={0} styleLeft={'622px'} styleTop={'950px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={9} connectionType={0} styleLeft={'300px'} styleTop={'840px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={10} connectionType={0} styleLeft={'263px'} styleTop={'807px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={11} connectionType={0} styleLeft={'263px'} styleTop={'720px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={12} connectionType={0} styleLeft={'263px'} styleTop={'620px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={13} connectionType={0} styleLeft={'214px'} styleTop={'666px'} styleWidth={'350px'} styleRotation={'90'} />
                <SkillConnection index={14} connectionType={0} styleLeft={'300px'} styleTop={'480px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={15} connectionType={0} styleLeft={'263px'} styleTop={'447px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={16} connectionType={0} styleLeft={'263px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={17} connectionType={0} styleLeft={'263px'} styleTop={'270px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={18} connectionType={0} styleLeft={'480px'} styleTop={'840px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={19} connectionType={0} styleLeft={'442px'} styleTop={'807px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={20} connectionType={0} styleLeft={'532px'} styleTop={'800px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={21} connectionType={0} styleLeft={'585px'} styleTop={'840px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={22} connectionType={0} styleLeft={'625px'} styleTop={'807px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={23} connectionType={0} styleLeft={'442px'} styleTop={'700px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={24} connectionType={0} styleLeft={'442px'} styleTop={'600px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={25} connectionType={0} styleLeft={'532px'} styleTop={'700px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={26} connectionType={0} styleLeft={'532px'} styleTop={'600px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={27} connectionType={0} styleLeft={'622px'} styleTop={'700px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={28} connectionType={0} styleLeft={'622px'} styleTop={'600px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={29} connectionType={0} styleLeft={'480px'} styleTop={'480px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={30} connectionType={0} styleLeft={'442px'} styleTop={'447px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={31} connectionType={0} styleLeft={'532px'} styleTop={'450px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={32} connectionType={0} styleLeft={'580px'} styleTop={'480px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={33} connectionType={0} styleLeft={'621px'} styleTop={'447px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={34} connectionType={0} styleLeft={'442px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={35} connectionType={0} styleLeft={'442px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={36} connectionType={0} styleLeft={'532px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={37} connectionType={0} styleLeft={'532px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={38} connectionType={0} styleLeft={'621px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={39} connectionType={0} styleLeft={'621px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />

                {/*<SkillButton index={0} positionRow={'1'} positionColumn={'1'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'PLACEHOLDER'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'PLACEHOLDER'} handleClick={handleClick} />*/}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        {/* [ICON, NAME, SMALL DESC, TOOLTIP SIDE, COST, RANGE, COOLDOWN, USE OR CAST, CAST TIME, RESOURCE, LONG DESCRIPTION ] */}
                <SkillButton tooltipSortClass={'skill-tree'} index={0} positionRow={'13'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[1]} connectedLines={[0]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]} choiceMenuSide={'top-right'}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={1} positionRow={'12'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[2]} connectedLines={[1]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[1]} choiceMenuSide={'top-right'}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={2} positionRow={'11'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[3]} connectedLines={[2]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[2]} choiceMenuSide={'top-right'}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={3} positionRow={'10'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[3]} choiceMenuSide={'top-right'}  />
                <SkillButton index={4} positionRow={'14'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Greatsword.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[5]} connectedLines={[3, 4]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Weapon Combo Finisher. Has a 25% chance to proc. Deals increased damage.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={5} positionRow={'13'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[6]} connectedLines={[5]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+: Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 3+ by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={6} positionRow={'12'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[7]} connectedLines={[6]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+: Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 3+ by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={7} positionRow={'11'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+: Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 3+ by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={8} positionRow={'13'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[9]} connectedLines={[7]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={9} positionRow={'12'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[10]} connectedLines={[8]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={10} positionRow={'11'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={11} positionRow={'10'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Greatsword.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[12, 15]} connectedLines={[9, 10, 13]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Weapon Combo Extended Finisher. Deals increased damage.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={12} positionRow={'9'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[13]} connectedLines={[11]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4: Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4 by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={13} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[14]} connectedLines={[12]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4: Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4 by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={14} positionRow={'7'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4: Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4 by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={15} positionRow={'6'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Greatsword.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[16]} connectedLines={[14, 15]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Weapon Combo Extended Finisher. Has a 25% chance to proc. Deals increased damage.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={16} positionRow={'5'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[17]} connectedLines={[16]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+: Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4+ by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={17} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[18]} connectedLines={[17]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+: Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4+ by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={18} positionRow={'3'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+: Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4+ by 10%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton tooltipSortClass={'skill-tree'} index={19} positionRow={'10'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[20, 23, 26]} connectedLines={[18, 19, 20, 21, 22]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Swiftness.png", "Swordmaster: Swiftness", "+Attack Speed Proc chance (Passive)", "left", "", "", "", "use", "", "mana", "Adds Swordmaster: Swiftness proc to Greatsword Combo finisher procs & Extended Finisher procs: 25% chance to gain 25% attack speed for 1.5 secs. Stacks up to 2 times."], ["./icons/skill_Icons/Greatsword/Endurance.png", "Swordmaster: Endurance", "+HP recovery Proc chance (Passive)", "left", "", "", "", "", "", "mana", "Adds Swordmaster: Endurance proc to Greatsword Combo Finisher procs & Extended Finisher procs: 25% chance to recover 2-4% of your max HP."], ["./icons/skill_Icons/Greatsword/BladeTwist.png", "Blade Twist", "+Wound to Finishers (Passive)", "left", "", "", "", "", "", "mana", "Adds Wound to Greatsword Combo Finishers and Extended Finishers."]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[19]} choiceMenuSide={'top'}  />
                <SkillButton index={20} positionRow={'9'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[21]} connectedLines={[23]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Consistent 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - Increases effect duration by 0.5s. Swordmaster: Endurance - Increases minimum possible health restored by 0.5% max HP.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={21} positionRow={'8'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[22]} connectedLines={[24]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Consistent 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - Increases effect duration by 0.5s. Swordmaster: Endurance - Increases minimum possible health restored by 0.5% max HP.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={22} positionRow={'7'} positionColumn={'6'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={23} positionRow={'9'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[24]} connectedLines={[25]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Proc Rate 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases all Swordmaster effect proc rates by 25%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={24} positionRow={'8'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[25]} connectedLines={[26]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Proc Rate 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases all Swordmaster effect proc rates by 25%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={25} positionRow={'7'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Proc Rate 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases all Swordmaster effect proc rates by 25%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={26} positionRow={'9'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Potential.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[27]} connectedLines={[27]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Potential 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - +5% attack speed from effect. Swordmaster: Endurance - Increases maximum possible health restored by 1% max HP.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={27} positionRow={'8'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Potential.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[28]} connectedLines={[28]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Potential 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - +5% attack speed from effect. Swordmaster: Endurance - Increases maximum possible health restored by 1% max HP.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={28} positionRow={'7'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Come back after A2 launch"} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton tooltipSortClass={'skill-tree'} index={29} positionRow={'6'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[30, 33, 36]} connectedLines={[29, 30, 31, 32, 33]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/SecondStrike.png", "Second Strike", "+Double Hit chance (Passive)", "left", "", "", "", "use", "", "mana", "Adds Second Strike proc to Greatsword Combo Finisher procs & Extended Finisher procs: When you strike a target for physical damage with an ability, it gets struck again."], ["./icons/skill_Icons/Greatsword/PerfectTiming.png", "Perfect Timing", "+Cooldown Reduction chance (Passive)", "left", "", "", "", "", "", "mana", "Adds the Perfect Timing proc to Greatsword Combo Finisher procs & Extended Finisher procs: Reduces the cooldown of the next ability you cast by 5 seconds."], ["./icons/skill_Icons/Greatsword/BurningBlade.png", "Burning Blade", "+Fire damage to Finishers (Passive)", "left", "", "", "", "", "", "mana", "Adds Burning to Greatsword Combo Finishers and Extended Finishers."]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[29]} choiceMenuSide={'top'}  />
                <SkillButton index={30} positionRow={'5'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/SecondStrike.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[31]} connectedLines={[34]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extra Stacks 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike and Perfect Timing now stack up to 2 times.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={31} positionRow={'4'} positionColumn={'6'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[32]} connectedLines={[35]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={32} positionRow={'3'} positionColumn={'6'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={33} positionRow={'5'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[34]} connectedLines={[36]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Potency 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike - Increases the damage of the Second Strike proc by 25%. Perfect Timing - Increases the cooldown reset by 1 second.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={34} positionRow={'4'} positionColumn={'7'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[35]} connectedLines={[37]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={35} positionRow={'3'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Potency 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike - Increases the damage of the Second Strike proc by 25%. Perfect Timing - Increases the cooldown reset by 1 second.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={36} positionRow={'5'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[37]} connectedLines={[38]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extended Duration 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Second Strike and Perfect Timing proc effects by 2.5 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={37} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[38]} connectedLines={[39]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extended Duration 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Second Strike and Perfect Timing proc effects by 2.5 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={38} positionRow={'3'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extended Duration 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Second Strike and Perfect Timing proc effects by 2.5 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton tooltipSortClass={'skill-tree'} index={39} positionRow={'2'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/KeenEdge.png", "Keen Edge", "+Keen Edge chance (Passive)", "left", "", "", "", "use", "", "mana", "Your abilities have a 30% chance to proc Keen Edge: Your next Weapon Combo Finisher has +100% chance to critically hit."], ["./icons/skill_Icons/Greatsword/Refreshing.png", "Refreshing Followthrough", "+Refreshing Followthrough chance (Passive)", "left", "", "", "", "", "", "mana", "Your abilities have a 30% chance to proc Refreshing Followthrough: Your next Weapon Combo Finisher restores 3-5% of your max Mana."], ["./icons/skill_Icons/Greatsword/Guard_Icon.png", "Guard", "+Guard chance (Passive)", "left", "", "", "", "", "", "mana", "Your abilities have a 30% chance to proc Guard: Your next Weapon Combo Finisher grants 6 seconds of temporary health equal to 1-3% of your max HP."]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[39]} choiceMenuSide={'bottom'}  />
            </div>

            <BasicButton index={0} id={'reset'} icon={'./icons/Cross.png'} tooltipSortClass={''} tooltipSide={''} tooltipText={''} handleClick={ResetTree} />
            <BasicButton index={0} id={'back'} icon={'./Placeholder_Icon.png'} tooltipSortClass={''} tooltipSide={''} tooltipText={''} handleClick={BackButton} />

            <weaponSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'greatsword-tree-skill-point-tracker'} maxPoints={24} parentName={'Weapon'} />
            </weaponSkillPointCount.Provider>
            
        </div>

        <div className='skill-tree' id='Wand-Skill-Tree' data-show="0">
            <div className='skill-tree-bg' />

            <div className='wand-skill-tree-buttons'>
                <div className='wand-skill-tree-buttons-bg'/>

                {/*<SkillConnection index={37} connectionType={0} styleLeft={'0px'} styleTop={'0px'} styleWidth={'75px'} styleRotation={'0'} />*/}
                <SkillConnection index={40} connectionType={0} styleLeft={'140px'} styleTop={'926px'} styleWidth={'253px'} styleRotation={'0'} />
                <SkillConnection index={41} connectionType={0} styleLeft={'262px'} styleTop={'890px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={42} connectionType={0} styleLeft={'352px'} styleTop={'890px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={43} connectionType={0} styleLeft={'262px'} styleTop={'800px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={44} connectionType={0} styleLeft={'262px'} styleTop={'700px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={45} connectionType={0} styleLeft={'352px'} styleTop={'800px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={46} connectionType={0} styleLeft={'352px'} styleTop={'700px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={47} connectionType={0} styleLeft={'172px'} styleTop={'800px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={48} connectionType={0} styleLeft={'172px'} styleTop={'700px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={49} connectionType={0} styleLeft={'-41px'} styleTop={'740px'} styleWidth={'320px'} styleRotation={'90'} />
                <SkillConnection index={50} connectionType={0} styleLeft={'-41px'} styleTop={'390px'} styleWidth={'320px'} styleRotation={'90'} />
                <SkillConnection index={51} connectionType={0} styleLeft={'140px'} styleTop={'205px'} styleWidth={'253px'} styleRotation={'0'} />
                <SkillConnection index={52} connectionType={0} styleLeft={'262px'} styleTop={'240px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={53} connectionType={0} styleLeft={'352px'} styleTop={'240px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={54} connectionType={0} styleLeft={'262px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={55} connectionType={0} styleLeft={'262px'} styleTop={'450px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={56} connectionType={0} styleLeft={'352px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={57} connectionType={0} styleLeft={'352px'} styleTop={'450px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={58} connectionType={0} styleLeft={'172px'} styleTop={'450px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={59} connectionType={0} styleLeft={'172px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={60} connectionType={0} styleLeft={'510px'} styleTop={'926px'} styleWidth={'310px'} styleRotation={'0'} />
                <SkillConnection index={61} connectionType={0} styleLeft={'532px'} styleTop={'890px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={62} connectionType={0} styleLeft={'622px'} styleTop={'890px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={63} connectionType={0} styleLeft={'532px'} styleTop={'790px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={64} connectionType={0} styleLeft={'532px'} styleTop={'690px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={65} connectionType={0} styleLeft={'622px'} styleTop={'790px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={66} connectionType={0} styleLeft={'622px'} styleTop={'690px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={67} connectionType={0} styleLeft={'712px'} styleTop={'790px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={68} connectionType={0} styleLeft={'712px'} styleTop={'690px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={69} connectionType={0} styleLeft={'680px'} styleTop={'750px'} styleWidth={'320px'} styleRotation={'90'} />
                <SkillConnection index={70} connectionType={0} styleLeft={'319px'} styleTop={'390px'} styleWidth={'320px'} styleRotation={'90'} />
                <SkillConnection index={71} connectionType={0} styleLeft={'500px'} styleTop={'205px'} styleWidth={'320px'} styleRotation={'0'} />
                <SkillConnection index={72} connectionType={0} styleLeft={'532px'} styleTop={'245px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={73} connectionType={0} styleLeft={'622px'} styleTop={'245px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={74} connectionType={0} styleLeft={'532px'} styleTop={'345px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={75} connectionType={0} styleLeft={'532px'} styleTop={'445px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={76} connectionType={0} styleLeft={'622px'} styleTop={'345px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={77} connectionType={0} styleLeft={'622px'} styleTop={'445px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={78} connectionType={0} styleLeft={'712px'} styleTop={'445px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={79} connectionType={0} styleLeft={'712px'} styleTop={'345px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={80} connectionType={0} styleLeft={'680px'} styleTop={'390px'} styleWidth={'320px'} styleRotation={'90'} />

                {/*<SkillButton index={0} positionRow={'1'} positionColumn={'1'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'PLACEHOLDER'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'PLACEHOLDER'} handleClick={handleClick} choiceMenuSide={''} />*/}
                <SkillButton tooltipSortClass={'skill-tree'} index={40} positionRow={'11'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[41, 44, 50]} connectedLines={[40, 41, 42, 49]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom-right'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Wand/ElectrifyingProjectiles_Icon.png", "Electrifying Projectiles", "+Chance to Electrify on hit (Passive)", "right", "", "", "", "use", "", "mana", "Wand projectiles and beams have a 10% chance to Electrify the target"], ["./icons/skill_Icons/Wand/BurningProjectiles_Icon.png", "Burning Projectiles", "+Chance to Burn on hit (Passive)", "right", "", "", "", "", "", "mana", "Wand projectiles and beams have a 10% chance to Burn the target"], ["./icons/skill_Icons/Wand/ChillingProjectiles_Icon.png", "Chilling Projectiles", "+Chance to Chill on hit (Passive)", "right", "", "", "", "", "", "mana", "Wand projectiles and beams have a 10% chance to Chill the target"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[40]} choiceMenuSide={'top-right'}  />
                <SkillButton index={41} positionRow={'10'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Wand/ElementalLure_1_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[42]} connectedLines={[43]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Elemental Lure 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand damage is increased by 3% per application of Burning, Chilled, or Volatile on the target, up to 9%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={42} positionRow={'9'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Wand/ElementalLure_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[43]} connectedLines={[44]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Elemental Lure 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand damage is increased by 3% per application of Burning, Chilled, or Volatile on the target, up to 9%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={43} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Wand/ElementalLure_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Elemental Lure 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand damage is increased by 3% per application of Burning, Chilled, or Volatile on the target, up to 9%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={44} positionRow={'10'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Wand/ElementalAttunement_1_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[45]} connectedLines={[45]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Elemental Attunement 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the trigger chance of Elemental status effect wand procs by 5%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={45} positionRow={'9'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Wand/ElementalAttunement_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[46]} connectedLines={[46]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Elemental Attunement 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the trigger chance of Elemental status effect wand procs by 5%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={46} positionRow={'8'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Wand/ElementalAttunement_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Elemental Attunement 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the trigger chance of Elemental status effect wand procs by 5%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={47} positionRow={'10'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_1_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[48]} connectedLines={[47]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 5 Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand hit 5 does 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={48} positionRow={'9'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[49]} connectedLines={[48]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 5 Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand hit 5 does 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={49} positionRow={'8'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 5 Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand hit 5 does 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={50} positionRow={'7'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Wand/EssenceHarvest_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[51]} connectedLines={[50]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'right'} tooltipName={'Essence Harvest'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Every time you trigger a wand proc, you have a 50% chance to increase magical power by 3% for 10 seconds. Stacks up to 5 times'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton tooltipSortClass={'skill-tree'} index={51} positionRow={'3'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[52, 55]} connectedLines={[51, 52, 53]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'top-right'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Wand/Echo_Icon.png", "Echo", "+Echo chance (Passive)", "right", "", "", "", "use", "", "mana", "Adds a 25% chance to gain the Echo proc when using Wand Combo Finishers and Extended Finishers. 100% chance for beam finishers. When you strike a target with direct damage, it gets struck again for magical damage."], ["./icons/skill_Icons/Wand/PerfectTiming_Icon.png", "Perfect Timing", "+Perfect Timing chance (Passive)", "right", "", "", "", "", "", "mana", "Adds a 25% chance to gain the Perfect Timing proc when using Wand Combo Finishers and Extended Finishers. 100% for beam finishers. Reduces the cooldown of the next ability you cast by 5 seconds."]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[51]} choiceMenuSide={'bottom-right'}  />
                <SkillButton index={52} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Wand/ExtendedDuration_1_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[53]} connectedLines={[54]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Extended Duration 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Echo and Perfect Timing proc effects by 2.5 seconds'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={53} positionRow={'5'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Wand/ExtendedDuration_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[54]} connectedLines={[55]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Extended Duration 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Echo and Perfect Timing proc effects by 2.5 seconds'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={54} positionRow={'6'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Wand/ExtendedDuration_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Extended Duration 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends t he duration of the Echo and Perfect Timing proc effects by 2.5 seconds'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={55} positionRow={'4'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Wand/ExtraStacks_1_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[56]} connectedLines={[56]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Extra Stacks 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike and Perfect Timing now stack up to 2 times'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={56} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Wand/ExtraStacks_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[57]} connectedLines={[57]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Extra Stacks 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike and Perfect Timing now stack up to 3 times'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={57} positionRow={'6'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Wand/ExtraStacks_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Extra Stacks 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike and Perfect Timing now stack up to 4 times'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={58} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandProjectileDamage_1_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[59]} connectedLines={[58]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Projectile Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of all wand projectiles by 8%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={59} positionRow={'5'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandProjectileDamage_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[60]} connectedLines={[59]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Projectile Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of all wand projectiles by 8%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={60} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandProjectileDamage_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Projectile Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of all wand projectiles by 8%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={61} positionRow={'11'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHit_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[62, 65, 71]} connectedLines={[60, 61, 62]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 5+'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand hit 5+ unlocked. You have a 25% chance on the 5th hit to instead fire a beam at the target. Triggers weapon finisher effects.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={62} positionRow={'10'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitProcChance_1_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[63]} connectedLines={[63]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hit 5+ Proc Chance 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the base trigger chance of Hit 5+ to 50%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={63} positionRow={'9'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitProcChance_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[64]} connectedLines={[64]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hit 5+ Proc Chance 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the base trigger chance of Hit 5+ to 75%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={64} positionRow={'8'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitProcChance_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hit 5+ Proc Chance 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the base trigger chance of Hit 5+ to 100%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={65} positionRow={'10'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_4_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[66]} connectedLines={[65]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 5+ Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 5+ deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={66} positionRow={'9'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_5_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[67]} connectedLines={[66]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 5+ Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 5+ deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={67} positionRow={'8'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_6_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 5+ Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 5+ deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={68} positionRow={'10'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandDamageFocus_1_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[69]} connectedLines={[67]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Damage Focus 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of all wand projectiles and beams by 5%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={69} positionRow={'9'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandDamageFocus_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[70]} connectedLines={[68]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Damage Focus 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of all wand projectiles and beams by 5%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={70} positionRow={'8'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandDamageFocus_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Damage Focus 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of all wand projectiles and beams by 5%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton tooltipSortClass={'skill-tree'} index={71} positionRow={'11'} positionColumn={'10'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[72]} connectedLines={[69]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom-left'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Wand/WeaponTrainingDeflection_Icon.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "left", "", "", "", "use", "", "mana", "Increases your Evasion by 2%"], ["./icons/skill_Icons/Wand/WeaponTrainingFollowthrough_Icon.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "left", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 2%"], ["./icons/skill_Icons/Wand/WeaponTrainingPower_Icon.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "left", "", "", "", "", "", "mana", "Increases your Critical Damage by 2%"], ["./icons/skill_Icons/Wand/WeaponTrainingPrecision_Icon.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "left", "", "", "", "", "", "mana", "Increases your Accuracy by 2%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[71]} choiceMenuSide={'top-left'}  />
                <SkillButton index={72} positionRow={'7'} positionColumn={'10'} buttonType={1} icon={'./icons/skill_Icons/Wand/BeamAmplifier_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Beam Amplifier'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6+ now deals 50% more damage if the previous wand combo hit was also a beam attack'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={73} positionRow={'7'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHit6_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[74]} connectedLines={[70]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 6'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6 unlocked. Triggers Weapon Finisher Effects'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={74} positionRow={'3'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHit_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[75, 78, 84]} connectedLines={[71, 72, 73]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 6+'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6+ unlocked. You have a 25% chance on the 6th hit to instead fire a beam. Deals 50% more damage if the previous wand combo hit was also a beam. Triggers weapon finisher effects'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={75} positionRow={'4'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitProcChance_1_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[76]} connectedLines={[74]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Hit 6+ Proc Chance 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the base trigger chance of Hit 6+ to 50%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={76} positionRow={'5'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitProcChance_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[77]} connectedLines={[75]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Hit 6+ Proc Chance 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the base trigger chance of Hit 6+ to 75%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={77} positionRow={'6'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitProcChance_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Hit 6+ Proc Chance 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the base trigger chance of Hit 6+ to 100%'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={78} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_4_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[79]} connectedLines={[76]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Wand Hit 6+ Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6+ deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={79} positionRow={'5'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_5_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[80]} connectedLines={[77]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Wand Hit 6+ Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6+ deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={80} positionRow={'6'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_6_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Wand Hit 6+ Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6+ deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={81} positionRow={'6'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_1_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[82]} connectedLines={[78]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 6 Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6 deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={82} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_2_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[83]} connectedLines={[79]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 6 Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6 deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={83} positionRow={'4'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Wand/WandHitExtraDamage_3_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Wand Hit 6 Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Wand Hit 6 deals 15% more base damage'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton tooltipSortClass={'skill-tree'} index={84} positionRow={'3'} positionColumn={'10'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[72]} connectedLines={[80]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'top-left'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Wand/WeaponTrainingDeflection_Icon.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "left", "", "", "", "use", "", "mana", "Increases your Evasion by 2%"], ["./icons/skill_Icons/Wand/WeaponTrainingFollowthrough_Icon.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "left", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 2%"], ["./icons/skill_Icons/Wand/WeaponTrainingPower_Icon.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "left", "", "", "", "", "", "mana", "Increases your Critical Damage by 2%"], ["./icons/skill_Icons/Wand/WeaponTrainingPrecision_Icon.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "left", "", "", "", "", "", "mana", "Increases your Accuracy by 2%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[84]} choiceMenuSide={'bottom-left'}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={85} positionRow={'2'} positionColumn={'5'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'left'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/KeenEdge.png", "Keen Edge", "+Keen Edge Chance (Passive)", "right", "", "", "", "use", "", "mana", "Your abilities have a 30% chance to proc Keen Edge: Your next Weapon Combo Finisher has +100% chance to critically hit"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Refreshing Followthrough", "+Refreshing Followthrough Chance (Passive)", "left", "", "", "", "", "", "mana", "Your abilities have a 30% chance to proc Refreshing Followthrough: Your next Weapon Combo Finisher restores 3-5% of your max Mana"], ["./icons/skill_Icons/Greatsword/Guard_Icon.png", "Guard", "+Guard Chance (Passive)", "left", "", "", "", "", "", "mana", "Your abilities have a 30% chance to proc Guard: Your next Weapon Combo Finisher grants 6 secsonds of temp Health equal to 1-3% of your max Health"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[85]} choiceMenuSide={'bottom-left'}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={86} positionRow={'2'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Wand/CatalyticProjectiles_Icon.png", "Catalytic Projectiles", "+Conditional Crit Chance (Passive)", "right", "", "", "", "use", "", "mana", "After a standard Wand Hit 5, your next Hit 6 and 6+ has a 15% increased damage and 10% increased chance to Crit. These bonuses double against Burning, Conflagrating, and Shocked targets"], ["./icons/skill_Icons/Wand/Prism_Icon.png", "Prism", "+Conditional Beam Chance (Passive)", "left", "", "", "", "", "", "mana", "After proccing a Hit 5+ beam, your chance to proc a Hit 6+ beam is increased by 10%, and the base damage of your next Hit 6 or Hit 6+ beam is increased about an additional 10%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[86]} choiceMenuSide={'bottom-right'}  />
            </div>

            <BasicButton index={0} id={'reset'} icon={'./icons/Cross.png'} tooltipSortClass={''} tooltipSide={''} tooltipText={''} handleClick={ResetTree} />
            <BasicButton index={0} id={'back'} icon={'./Placeholder_Icon.png'} tooltipSortClass={''} tooltipSide={''} tooltipText={''} handleClick={BackButton} />

            <weaponSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'wand-tree-skill-point-tracker'} maxPoints={24} parentName={'Weapon'} />
            </weaponSkillPointCount.Provider>
        </div>
    </div>
    )
}