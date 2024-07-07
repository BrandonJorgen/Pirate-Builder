import { createContext, useContext, useRef, useState } from 'react'
import SkillButton from './SkillButton'
import './WeaponSkillTree.css'
import SkillPointTracker from './SkillPointTracker'
import { WeaponSelected } from './WeaponSkillTreeSelector'
import SkillConnection from './SkillConnection'

interface SkillTreeProps
{
    index: number;
    buttonMemory: number[],
    feedMemoryFunction: (index: number, array: number[]) => void,
    pointTrackerValue: number,
    feedPointTrackerValue: (index: number, value: number) => void,
    choiceButtonMemory: number[],
    feedChoiceButtonMemoryFunction: (index: number, array: number[]) => void,
}

export const weaponSkillPointCount = createContext(0)

export default function WeaponSkillTree({ index, buttonMemory, feedMemoryFunction, pointTrackerValue, feedPointTrackerValue, choiceButtonMemory, feedChoiceButtonMemoryFunction }: SkillTreeProps)
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

                    // Choice button type disable and deselect
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "2")
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-selected") === "1")
                        {
                            skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                            skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                            // Clear it's choice if it has one
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

    function UpdateChoiceMemory(index: number, choice: number)
    {
        choiceButtonMemory[index] = choice
        feedChoiceButtonMemoryFunction(index, choiceButtonMemory)
    }

    return(
    <div className='weapon-skill-tree'>
        <div className='skill-tree' id='Greatsword-Skill-Tree' data-show="0">
            <div className='skill-tree-bg' />

            <div className='greatsword-skill-tree-buttons'>
                <div className='greatsword-skill-tree-buttons-bg'/>

                {/*<SkillConnection index={37} connectionType={0} styleLeft={'0px'} styleTop={'0px'} styleWidth={'75px'} styleRotation={'0'} />*/}
                <SkillConnection index={0} connectionType={0} styleLeft={'82px'} styleTop={'975px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={1} connectionType={0} styleLeft={'82px'} styleTop={'900px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={2} connectionType={0} styleLeft={'82px'} styleTop={'780px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={3} connectionType={0} styleLeft={'300px'} styleTop={'1105px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={4} connectionType={0} styleLeft={'261px'} styleTop={'1072px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={5} connectionType={0} styleLeft={'261px'} styleTop={'980px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={6} connectionType={0} styleLeft={'261px'} styleTop={'900px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={7} connectionType={0} styleLeft={'622px'} styleTop={'980px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={8} connectionType={0} styleLeft={'622px'} styleTop={'900px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={9} connectionType={0} styleLeft={'300px'} styleTop={'745px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={10} connectionType={0} styleLeft={'262px'} styleTop={'712px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={11} connectionType={0} styleLeft={'262px'} styleTop={'620px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={12} connectionType={0} styleLeft={'262px'} styleTop={'520px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={13} connectionType={0} styleLeft={'214px'} styleTop={'566px'} styleWidth={'350px'} styleRotation={'90'} />
                <SkillConnection index={14} connectionType={0} styleLeft={'300px'} styleTop={'385px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={15} connectionType={0} styleLeft={'262px'} styleTop={'352px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={16} connectionType={0} styleLeft={'262px'} styleTop={'270px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={17} connectionType={0} styleLeft={'262px'} styleTop={'170px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={18} connectionType={0} styleLeft={'480px'} styleTop={'750px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={19} connectionType={0} styleLeft={'442px'} styleTop={'717px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={20} connectionType={0} styleLeft={'532px'} styleTop={'700px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={21} connectionType={0} styleLeft={'580px'} styleTop={'750px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={22} connectionType={0} styleLeft={'622px'} styleTop={'717px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={23} connectionType={0} styleLeft={'442px'} styleTop={'600px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={24} connectionType={0} styleLeft={'442px'} styleTop={'500px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={25} connectionType={0} styleLeft={'532px'} styleTop={'600px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={26} connectionType={0} styleLeft={'532px'} styleTop={'500px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={27} connectionType={0} styleLeft={'622px'} styleTop={'600px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={28} connectionType={0} styleLeft={'622px'} styleTop={'500px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={29} connectionType={0} styleLeft={'480px'} styleTop={'389px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={30} connectionType={0} styleLeft={'442px'} styleTop={'356px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={31} connectionType={0} styleLeft={'532px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={32} connectionType={0} styleLeft={'580px'} styleTop={'389px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={33} connectionType={0} styleLeft={'621px'} styleTop={'356px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={34} connectionType={0} styleLeft={'442px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={35} connectionType={0} styleLeft={'442px'} styleTop={'150px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={36} connectionType={0} styleLeft={'532px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={37} connectionType={0} styleLeft={'532px'} styleTop={'150px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={38} connectionType={0} styleLeft={'621px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={39} connectionType={0} styleLeft={'621px'} styleTop={'150px'} styleWidth={'75px'} styleRotation={'90'} />

                {/*<SkillButton index={0} positionRow={'1'} positionColumn={'1'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'PLACEHOLDER'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'PLACEHOLDER'} handleClick={handleClick} />*/}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        {/* [ICON, NAME, SMALL DESC, TOOLTIP SIDE, COST, RANGE, COOLDOWN, USE OR CAST, CAST TIME, RESOURCE, LONG DESCRIPTION ] */}
                <SkillButton tooltipSortClass={'skill-tree'} index={0} positionRow={'12'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[1]} connectedLines={[0]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={1} positionRow={'11'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[2]} connectedLines={[1]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={2} positionRow={'10'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[3]} connectedLines={[2]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]}  />
                <SkillButton tooltipSortClass={'skill-tree'} index={3} positionRow={'9'} positionColumn={'2'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Deflection.png", "Weapon Training: Deflection", "+Evasion % (Passive)", "right", "", "", "", "use", "", "mana", "Increases your Evasion by 0.5%"], ["./icons/skill_Icons/Greatsword/FollowThrough.png", "Weapon Training: Followthrough", "+Mitigation Penetration % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Mitigation Penetration by 0.5%"], ["./icons/skill_Icons/Greatsword/Power.png", "Weapon Training: Power", "+Critical Damage % (Passive)", "right", "", "", "", "", "", "mana", "Increase your Critical Damage by 0.5%"], ["./icons/skill_Icons/Greatsword/Precision.png", "Weapon Training: Precision", "+Accuracy % (Passive)", "right", "", "", "", "", "", "mana", "Increases your Accuracy by 0.5%"]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]}  />
                <SkillButton index={4} positionRow={'13'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Greatsword.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[5]} connectedLines={[3, 4]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Weapon Combo Finisher. Has a 25% chance to proc. Deals increased damage.'} handleClick={handleClick} />
                <SkillButton index={5} positionRow={'12'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[6]} connectedLines={[5]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+: Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 3+ by 10%'} handleClick={handleClick} />
                <SkillButton index={6} positionRow={'11'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[7]} connectedLines={[6]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+: Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 3+ by 10%'} handleClick={handleClick} />
                <SkillButton index={7} positionRow={'10'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 3+: Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 3+ by 10%'} handleClick={handleClick} />
                <SkillButton index={8} positionRow={'12'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[9]} connectedLines={[7]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} />
                <SkillButton index={9} positionRow={'11'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[10]} connectedLines={[8]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} />
                <SkillButton index={10} positionRow={'10'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} />
                <SkillButton index={11} positionRow={'9'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Greatsword.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[12, 15]} connectedLines={[9, 10, 13]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Weapon Combo Extended Finisher. Deals increased damage.'} handleClick={handleClick} />
                <SkillButton index={12} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[13]} connectedLines={[11]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4: Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4 by 10%'} handleClick={handleClick} />
                <SkillButton index={13} positionRow={'7'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[14]} connectedLines={[12]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4: Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4 by 10%'} handleClick={handleClick} />
                <SkillButton index={14} positionRow={'6'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4: Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4 by 10%'} handleClick={handleClick} />
                <SkillButton index={15} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Greatsword.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[16]} connectedLines={[14, 15]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Weapon Combo Extended Finisher. Has a 25% chance to proc. Deals increased damage.'} handleClick={handleClick} />
                <SkillButton index={16} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[17]} connectedLines={[16]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+: Extra Damage 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4+ by 10%'} handleClick={handleClick} />
                <SkillButton index={17} positionRow={'3'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[18]} connectedLines={[17]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+: Extra Damage 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4+ by 10%'} handleClick={handleClick} />
                <SkillButton index={18} positionRow={'2'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Power.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Greatsword Hit 4+: Extra Damage 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases the damage of Greatsword Hit 4+ by 10%'} handleClick={handleClick} />
                <SkillButton tooltipSortClass={'skill-tree'} index={19} positionRow={'9'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[20, 23, 26]} connectedLines={[18, 19, 20, 21, 22]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/Swiftness.png", "Swordmaster: Swiftness", "+Attack Speed Proc chance (Passive)", "left", "", "", "", "use", "", "mana", "Adds Swordmaster: Swiftness proc to Greatsword Combo finisher procs & Extended Finisher procs: 25% chance to gain 25% attack speed for 1.5 secs. Stacks up to 2 times."], ["./icons/skill_Icons/Greatsword/Endurance.png", "Swordmaster: Endurance", "+HP recovery Proc chance (Passive)", "left", "", "", "", "", "", "mana", "Adds Swordmaster: Endurance proc to Greatsword Combo Finisher procs & Extended Finisher procs: 25% chance to recover 2-4% of your max HP."], ["./icons/skill_Icons/Greatsword/BladeTwist.png", "Blade Twist", "+Wound to Finishers (Passive)", "left", "", "", "", "", "", "mana", "Adds Wound to Greatsword Combo Finishers and Extended Finishers."]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]}  />
                <SkillButton index={20} positionRow={'8'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[21]} connectedLines={[23]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Consistent 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - Increases effect duration by 0.5s. Swordmaster: Endurance - Increases minimum possible health restored by 0.5% max HP.'} handleClick={handleClick} />
                <SkillButton index={21} positionRow={'7'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[22]} connectedLines={[24]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Consistent 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - Increases effect duration by 0.5s. Swordmaster: Endurance - Increases minimum possible health restored by 0.5% max HP.'} handleClick={handleClick} />
                <SkillButton index={22} positionRow={'6'} positionColumn={'6'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} />
                <SkillButton index={23} positionRow={'8'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[24]} connectedLines={[25]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Proc Rate 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases all Swordmaster effect proc rates by 25%'} handleClick={handleClick} />
                <SkillButton index={24} positionRow={'7'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[25]} connectedLines={[26]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Proc Rate 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases all Swordmaster effect proc rates by 25%'} handleClick={handleClick} />
                <SkillButton index={25} positionRow={'6'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Proc Rate 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases all Swordmaster effect proc rates by 25%'} handleClick={handleClick} />
                <SkillButton index={26} positionRow={'8'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Potential.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[27]} connectedLines={[27]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Potential 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - +5% attack speed from effect. Swordmaster: Endurance - Increases maximum possible health restored by 1% max HP.'} handleClick={handleClick} />
                <SkillButton index={27} positionRow={'7'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Potential.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[28]} connectedLines={[28]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Swordmaster: Potential 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Swordmaster: Swiftness - +5% attack speed from effect. Swordmaster: Endurance - Increases maximum possible health restored by 1% max HP.'} handleClick={handleClick} />
                <SkillButton index={28} positionRow={'6'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Come back after A2 launch"} handleClick={handleClick} />
                <SkillButton tooltipSortClass={'skill-tree'} index={29} positionRow={'5'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[30, 33, 36]} connectedLines={[29, 30, 31, 32, 33]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/SecondStrike.png", "Second Strike", "+Double Hit chance (Passive)", "left", "", "", "", "use", "", "mana", "Adds Second Strike proc to Greatsword Combo Finisher procs & Extended Finisher procs: When you strike a target for physical damage with an ability, it gets struck again."], ["./icons/skill_Icons/Greatsword/PerfectTiming.png", "Perfect Timing", "+Cooldown Reduction chance (Passive)", "left", "", "", "", "", "", "mana", "Adds the Perfect Timing proc to Greatsword Combo Finisher procs & Extended Finisher procs: Reduces the cooldown of the next ability you cast by 5 seconds."], ["./icons/skill_Icons/Greatsword/BurningBlade.png", "Burning Blade", "+Fire damage to Finishers (Passive)", "left", "", "", "", "", "", "mana", "Adds Burning to Greatsword Combo Finishers and Extended Finishers."]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]}  />
                <SkillButton index={30} positionRow={'4'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/SecondStrike.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[31]} connectedLines={[34]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extra Stacks 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike and Perfect Timing now stack up to 2 times.'} handleClick={handleClick} />
                <SkillButton index={31} positionRow={'3'} positionColumn={'6'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[32]} connectedLines={[35]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} />
                <SkillButton index={32} positionRow={'2'} positionColumn={'6'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} />
                <SkillButton index={33} positionRow={'4'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[34]} connectedLines={[36]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Potency 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike - Increases the damage of the Second Strike proc by 25%. Perfect Timing - Increases the cooldown reset by 1 second.'} handleClick={handleClick} />
                <SkillButton index={34} positionRow={'3'} positionColumn={'7'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[35]} connectedLines={[37]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} />
                <SkillButton index={35} positionRow={'2'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/ProcRate.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Potency 3'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Second Strike - Increases the damage of the Second Strike proc by 25%. Perfect Timing - Increases the cooldown reset by 1 second.'} handleClick={handleClick} />
                <SkillButton index={36} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[37]} connectedLines={[38]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extended Duration 1'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Second Strike and Perfect Timing proc effects by 2.5 seconds.'} handleClick={handleClick} />
                <SkillButton index={37} positionRow={'3'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[38]} connectedLines={[39]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extended Duration 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Second Strike and Perfect Timing proc effects by 2.5 seconds.'} handleClick={handleClick} />
                <SkillButton index={38} positionRow={'2'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Greatsword/Duration.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Extended Duration 2'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Extends the duration of the Second Strike and Perfect Timing proc effects by 2.5 seconds.'} handleClick={handleClick} />
                <SkillButton tooltipSortClass={'skill-tree'} index={39} positionRow={'1'} positionColumn={'7'} buttonType={2} icon={'./icons/skill_Icons/Plus.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={''} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipCastTime={''} tooltipDescription={''} tooltipUseOrCast={''} tooltipResource={''} choices={[["./icons/skill_Icons/Greatsword/KeenEdge.png", "Keen Edge", "+Keen Edge chance (Passive)", "left", "", "", "", "use", "", "mana", "Your abilities have a 30% chance to proc Keen Edge: Your next Weapon Combo Finisher has +100% chance to critically hit."], ["./icons/skill_Icons/Greatsword/Refreshing.png", "Refreshing Followthrough", "+Refreshing Followthrough chance (Passive)", "left", "", "", "", "", "", "mana", "Your abilities have a 30% chance to proc Refreshing Followthrough: Your next Weapon Combo Finisher restores 3-5% of your max Mana."], ["./icons/skill_Icons/Greatsword/Guard_Icon.png", "Guard", "+Guard chance (Passive)", "left", "", "", "", "", "", "mana", "Your abilities have a 30% chance to proc Guard: Your next Weapon Combo Finisher grants 6 seconds of temporary health equal to 1-3% of your max HP."]]} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMemory={choiceButtonMemory[0]}  />
            </div>

            <weaponSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'greatsword-tree-skill-point-tracker'} maxPoints={40} parentName={'Weapon'} />
            </weaponSkillPointCount.Provider>
            
        </div>
    </div>
    )
}