import { createContext, useContext, useRef, useState } from 'react'
import SkillButton from './SkillButton'
import SkillConnection from './SkillConnection'
import './ArchetypeSkillTree.css'
import SkillPointTracker from './SkillPointTracker'
import { ArchetypeSelected } from './ArchetypeSkillTreeSelector'

interface SkillTreeProps
{
    buttonMemory: number[],
    feedMemoryFunction: (array: number[]) => void,
    pointTrackerValue: number,
    feedPointTrackerValue: (value: number) => void,
    choiceButtonMemory: number[],
    feedChoiceButtonMemoryFunction: (index: number, array: number[]) => void,
}

export const archetypeSkillPointCount = createContext(0)

export default function ArchetypeSkillTree({ buttonMemory, feedMemoryFunction, pointTrackerValue, feedPointTrackerValue, choiceButtonMemory, feedChoiceButtonMemoryFunction }: SkillTreeProps)
{
    let skillButtons: HTMLCollectionOf<Element>

    let lines: HTMLCollectionOf<Element>

    let tempCount = useRef(pointTrackerValue)

    const [ count, setCount] = useState(pointTrackerValue)

    let selectedArchetype = useContext(ArchetypeSelected)

    let buttonMemoryArray = buttonMemory

    let useMemory = useRef(1) //used to determine if we need to access the button memory or not

    setTimeout(() => {

        skillButtons = document.getElementsByClassName("skill-button")
        lines = document.getElementsByClassName("skill-connection")

        let treeToShow = document.getElementById(selectedArchetype)

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
            for (let o = 0; o < skillButtons.length; o++)
            {
                // Is this the same button assigned to this position in the memory array?
                if (i === o)
                {
                    if (buttonMemoryArray[i] === 0)
                        continue

                    console.log(skillButtons[o].getAttribute("data-disabled"))

                    skillButtons[o].setAttribute("data-selected", "1")
                    skillButtons[o].setAttribute("data-disabled", "0")

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

                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "0")
                    {
                        skillButtons[connectedButtons[i]].setAttribute("data-disabled", "0")
                    }

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

                            if (tempNumber > 0)
                            {
                                skillButtons[connectedButtons[i]].setAttribute("data-disabled", "0")
                            }
                        }
                    }

                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "3")
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-connection-count") != null) 
                        {
                            // convert the connection count attribute to a number
                            let tempNumber = Number(skillButtons[connectedButtons[i]].getAttribute("data-connection-count"))

                            // ++ the variable
                            ++tempNumber

                            // convert the variable back into a string and set the attribute
                            skillButtons[connectedButtons[i]].setAttribute("data-connection-count", tempNumber.toString())

                            if (tempNumber >= 2)
                            {
                                skillButtons[connectedButtons[i]].setAttribute("data-disabled", "0")
                            }
                        }
                    }

                }
                UpdateLines(index, connectedLines)
            }

            buttonMemoryArray[index] = 1
            feedMemoryFunction(buttonMemoryArray)
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
                            console.log("TYPE 0 BUTTON WASNT PRESSED AND WAS SET TO DISABLED AND NOT SELECTED")
                            DecrementCount()
                        }
                        else
                        {
                            skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                            console.log("TYPE 0 BUTTON WASNT PRESSED AND WAS SET TO DISABLED")
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
                                    console.log("TYPE 1 BUTTON WASNT PRESSED AND WAS SET TO DISABLED AND NOT SELECTED")
                                }
                                else
                                {
                                    skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                                    console.log("TYPE 1 BUTTON WASNT PRESSED AND WAS SET TO DISABLED")
                                }
                            }
                        }
                    }

                    // Multi-Requirement button
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "3")
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
                                if (tempNumber <= 1)
                                {
                                    if (skillButtons[connectedButtons[i]].getAttribute("data-selected") === "1")
                                    {
                                        skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                                        skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                                        DecrementCount()
                                        console.log("TYPE 3 BUTTON WASNT PRESSED AND WAS SET TO DISABLED AND NOT SELECTED")
                                    }
                                    else
                                    {
                                        skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                                        console.log("TYPE 3 BUTTON WASNT PRESSED AND WAS SET TO DISABLED")
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
            feedMemoryFunction(buttonMemoryArray)
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

                    if (lines[connectionLines[i]].getAttribute("data-connection-type") === "0")
                    {
                        lines[connectionLines[i]].setAttribute("data-active", "1")
                    }

                    if (lines[connectionLines[i]].getAttribute("data-connection-type") === "1")
                    {
                        tempCount = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))

                        ++tempCount

                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())

                        lines[connectionLines[i]].setAttribute("data-active", "1")
                    }

                    if (lines[connectionLines[i]].getAttribute("data-connection-type") === "2")
                    {
                        tempCount = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))

                        ++tempCount

                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())

                        if (tempCount >= 2) 
                        {
                            lines[connectionLines[i]].setAttribute("data-active", "1")
                        }
                    }
                        
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
                    if (lines[connectionLines[i]].getAttribute("data-connection-type") === "0")
                    {
                        lines[connectionLines[i]].setAttribute("data-active", "0")
                    }

                    if (lines[connectionLines[i]].getAttribute("data-connection-type") === "1")
                    {
                        tempCount = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))
                        --tempCount

                        if ( tempCount < 0)
                            tempCount = 0

                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())

                        if (tempCount <=0)
                            lines[connectionLines[i]].setAttribute("data-active", "0")
                    }
                    
                    if (lines[connectionLines[i]].getAttribute("data-connection-type") === "2")
                    {
                        tempCount = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))
                        --tempCount

                        if ( tempCount < 0)
                            tempCount = 0

                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())

                        if (tempCount <=2)
                            lines[connectionLines[i]].setAttribute("data-active", "0")
                    }
                }
            }
        }
    }

    function IncrementCount()
    {
        tempCount.current = tempCount.current + 1
        feedPointTrackerValue(1)
        setCount(tempCount.current)
        
    }

    function DecrementCount()
    {
        tempCount.current = tempCount.current - 1
        feedPointTrackerValue(-1)
        setCount(tempCount.current)
        
    }

    function UpdateChoiceMemory(index: number, choice: number)
    {
        choiceButtonMemory[index] = choice
        feedChoiceButtonMemoryFunction(index, choiceButtonMemory)
    }

    return(
    <div className='archetype-skill-tree'>
        <div className='skill-tree' id='Fighter-Skill-Tree' data-show="0">
            <div className='skill-tree-bg' />

            <archetypeSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'fighter-tree-skill-point-tracker'} maxPoints={31} parentName={'Archetype'} />
            </archetypeSkillPointCount.Provider>

            <SkillConnection index={0} connectionType={1} styleLeft={"333px"} styleTop={"675px"} styleWidth={'70px'} styleRotation={'0'} />
            <SkillConnection index={1} connectionType={1} styleLeft={"295px"} styleTop={"642px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={2} connectionType={0} styleLeft={"446px"} styleTop={"675px"} styleWidth={'70px'} styleRotation={'0'} />
            <SkillConnection index={3} connectionType={0} styleLeft={"475px"} styleTop={"710px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={4} connectionType={0} styleLeft={"50px"} styleTop={"585px"} styleWidth={'275px'} styleRotation={'0'} />
            <SkillConnection index={5} connectionType={0} styleLeft={"205px"} styleTop={"620px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={6} connectionType={0} styleLeft={"25px"} styleTop={"620px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={7} connectionType={0} styleLeft={"-62px"} styleTop={"430px"} styleWidth={'250px'} styleRotation={'90'} />
            <SkillConnection index={8} connectionType={0} styleLeft={"25px"} styleTop={"250px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={9} connectionType={0} styleLeft={"80px"} styleTop={"210px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={10} connectionType={0} styleLeft={"24px"} styleTop={"160px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={11} connectionType={0} styleLeft={"57px"} styleTop={"120px"} styleWidth={'350px'} styleRotation={'0'} />
            <SkillConnection index={12} connectionType={0} styleLeft={"358px"} styleTop={"585px"} styleWidth={'125px'} styleRotation={'90'} />
            <SkillConnection index={13} connectionType={0} styleLeft={"170px"} styleTop={"490px"} styleWidth={'220px'} styleRotation={'0'} />
            <SkillConnection index={14} connectionType={0} styleLeft={"205px"} styleTop={"450px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={15} connectionType={0} styleLeft={"170px"} styleTop={"400px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={16} connectionType={0} styleLeft={"240px"} styleTop={"400px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={17} connectionType={0} styleLeft={"205px"} styleTop={"330px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={18} connectionType={0} styleLeft={"170px"} styleTop={"305px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={19} connectionType={0} styleLeft={"240px"} styleTop={"305px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={20} connectionType={0} styleLeft={"205px"} styleTop={"250px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={21} connectionType={0} styleLeft={"238px"} styleTop={"210px"} styleWidth={'175px'} styleRotation={'0'} />
            <SkillConnection index={22} connectionType={0} styleLeft={"445px"} styleTop={"490px"} styleWidth={'161px'} styleRotation={'0'} />
            <SkillConnection index={23} connectionType={0} styleLeft={"565px"} styleTop={"450px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={24} connectionType={0} styleLeft={"500px"} styleTop={"400px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={25} connectionType={0} styleLeft={"600px"} styleTop={"400px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={26} connectionType={0} styleLeft={"654px"} styleTop={"340px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={27} connectionType={0} styleLeft={"654px"} styleTop={"430px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={28} connectionType={0} styleLeft={"565px"} styleTop={"330px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={29} connectionType={0} styleLeft={"565px"} styleTop={"250px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={30} connectionType={0} styleLeft={"431px"} styleTop={"210px"} styleWidth={'175px'} styleRotation={'0'} />
            <SkillConnection index={31} connectionType={0} styleLeft={"540px"} styleTop={"585px"} styleWidth={'220px'} styleRotation={'0'} />
            <SkillConnection index={32} connectionType={0} styleLeft={"720px"} styleTop={"490px"} styleWidth={'125px'} styleRotation={'90'} />
            <SkillConnection index={33} connectionType={0} styleLeft={"715px"} styleTop={"310px"} styleWidth={'130px'} styleRotation={'90'} />
            <SkillConnection index={34} connectionType={0} styleLeft={"700px"} styleTop={"210px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={35} connectionType={0} styleLeft={"730px"} styleTop={"166px"} styleWidth={'100px'} styleRotation={'90'} />
            <SkillConnection index={36} connectionType={0} styleLeft={"430px"} styleTop={"120px"} styleWidth={'350px'} styleRotation={'0'} />
            <SkillConnection index={37} connectionType={2} styleLeft={"295px"} styleTop={"715px"} styleWidth={'75px'} styleRotation={'90'} />

            <SkillButton tooltipSortClass={'skill-tree'} index={0} positionRow={'8'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LethalBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 2, 10]} connectedLines={[0, 2, 3, 12, 37]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Lethal Blow'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'10s'} tooltipCastTime={'1.1s'} tooltipDescription={"Deals 125% physical damage to your target plus additional damage based on the target's missing health, up to a max of 375% physical damage. Additional 15% crit chance for bleeding targets. 30% for Hemorraging targets."} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={1} positionRow={'9'} positionColumn={'5'} buttonType={3} icon={'./icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Reinvigorating Lethal Blow'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Killing an enemy with Lethal Blow resets the cooldown of Blitz'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={2} positionRow={'9'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LethalBlow_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Consuming Lethal Blow'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Lethal Blow returns 50% of overkill damage dealt as health and mana.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={3} positionRow={'7'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Blitz_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 4, 5]} connectedLines={[1, 4, 5, 37]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Blitz'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'15s'} tooltipCastTime={''} tooltipDescription={'Charge directly towards your target, dealing 100% physical damage on arrival'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={4} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Raging Blitz'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Blitz generates 20 Combat Momentum'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={5} positionRow={'7'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LungingAssault_Icon.png'} startsDisabled={"1"} connectedButtons={[6, 7]} connectedLines={[6, 7]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Lunging Assault'} tooltipCost={'15'} tooltipRange={'N/A'} tooltipCooldown={'5s'} tooltipCastTime={'0.6s'} tooltipDescription={"Spend 15 Combat Momentum to lunge in a direction a short distance and perform an upward swing upon arrival, dealing 125% physical damage and applying Snared to enemies in front of you. You're immune to hard crowd control effects while performing this ability."} tooltipUseOrCast={'use'} tooltipResource={'Momentum'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={6} positionRow={'8'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LungingAssault_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Recharging Lunging Assault'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Lunging Assault gains an additional charge and generates 5 additional Combat Momentum when dealing damage to one or more enemies.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={7} positionRow={'4'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LeapStrike_Icon.png'} startsDisabled={"1"} connectedButtons={[8]} connectedLines={[8]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Leap Strike'} tooltipCost={'30'} tooltipRange={'30m'} tooltipCooldown={'20s'} tooltipCastTime={'1.8s'} tooltipDescription={'Leap to a target location and deal 225% phyiscal damage around while applying Snared to targets hit. Apply 3 stacks of Snared to targets hit that were Shaken.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={8} positionRow={'3'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofCelerity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 29]} connectedLines={[9, 10, 11]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Form of Celerity'} tooltipCost={'10'} tooltipRange={'N/A'} tooltipCooldown={'???'} tooltipCastTime={'0.7s'} tooltipDescription={'While in this form, the caster receives +2% Movement Speed per 10 Combat Momentum, up to a max of 20%. Overpower and Brutal Cleave apply Staggered to targets hit. Shifting form costs 20% of current Combat Momentum and triggers cooldown for all Combat Forms.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={9} positionRow={'2'} positionColumn={'6'} buttonType={1} icon={'./icons/skill_Icons/Fighter/ArtofWar_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Art of War'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Switching forms no longer triggers cooldowns or costs Combat Momentum.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={10} positionRow={'6'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BrutalCleave_Icon.png'} startsDisabled={"1"} connectedButtons={[11, 12, 18]} connectedLines={[13, 14, 22, 23]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Brutal Cleave'} tooltipCost={'20'} tooltipRange={'Frontal'} tooltipCooldown={'18s'} tooltipCastTime={'1s'} tooltipDescription={"Perform a wide sweeping attack, dealing 175% physical damage to all enemies in front of you. This ability shares a cooldown with Overpower. Hitting an enemy with a weapon combo finisher refreshes Brutal Cleave's cooldown. Gives 10-20 Combat Momentum"} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={11} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Wallop_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={"Wallop? (Position Unknown)"} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={"Spend 10% of current Combat Momentum to deal 150% physical damage plus additional damage depending on how much Combat Momentum was spent, up to a maximum total of 300% physical damage. [Position in tree is assumed]"} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={12} positionRow={'5'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Whirlwind_Icon.png'} startsDisabled={"1"} connectedButtons={[13, 14, 15]} connectedLines={[15, 16, 17]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Whirlwind'} tooltipCost={'30'} tooltipRange={'3m'} tooltipCooldown={'20s'} tooltipCastTime={'2.7s'} tooltipDescription={"Deal 30% physical damage to all enemies around the caster with each spin while channeled, increasing the spin rate the longer it's channeled. The caster is iummune to hard disabling effects while spinning. Deals 20% additional damage to Weakened targets."} tooltipUseOrCast={'cast'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={13} positionRow={'5'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Whirlwind: Overdrive'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'After completing the final spin, you may continue spinning at maximum speed while rapidly depleting your Combat Momentum. Ends after all Combat Momentume is fully depleted or after stopping the channel.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={14} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Climactic Whirlwind'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={"Perform a final swing in an area in front of you after ending Whirlwind's channel, dealing 175% physical damage and generating 5-10 Combat Momentum based on number of targets hit."} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={15} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Exert_Icon.png'} startsDisabled={"1"} connectedButtons={[16, 17, 28]} connectedLines={[18, 19, 20, 21]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Beserk'} tooltipCost={'All'} tooltipRange={'N/A'} tooltipCooldown={'30s'} tooltipCastTime={'0.2s'} tooltipDescription={'Consume your Combat Momentum rapidly, gaining 30% more physical power and movement speed and immunity to disabling effects while active. Must have at least 20 Combat Momentum to activate and the effect ends when all Combat Momentum is fully depleted.'} tooltipUseOrCast={'use'} tooltipResource={'Momentum'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={16} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Reinvigorating Beserk'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Beserk reduces all ability cooldowns by 1% per point of momentum [!OLD INFO!]'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={17} positionRow={'4'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Unyielding Beserk'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Beserk breaks all disabling effects on the caster.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={18} positionRow={'5'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Maim_Icon.png'} startsDisabled={"1"} connectedButtons={[19, 20, 23]} connectedLines={[24, 25, 28]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Maim'} tooltipCost={'25'} tooltipRange={'Frontal'} tooltipCooldown={'12s'} tooltipCastTime={'1.4s'} tooltipDescription={'Perform a powerful melee strike in a short forward cone, dealing 250% physical damage to all targets hit. Deals 20% additional damage to recently Tripped targets.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={19} positionRow={'5'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Maim_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Slicing Maim'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Maim launches a piercing projectile that deals 100% physical damage, plus 50% additional damage to recently Tripped targets, to any enemies hit.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={20} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[21, 22]} connectedLines={[26, 27]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Brutality'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Overpower and Brutal Cleave apply 1 Wounded stack to enemies hit.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={21} positionRow={'6'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Savagery'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Weapon combo finishers apply 1 Wounded stack to target hit.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={22} positionRow={'4'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BloodFusion_Icon.png'} startsDisabled={"1"} connectedButtons={[34]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Blood Fusion'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'45s'} tooltipCastTime={'Instant'} tooltipDescription={'Return 100% of damage dealt as health and 50% of damage dealt as mana over the next 6 seconds. 25% additional damage returned as health from Bleeding targets. 50% for Hemorraging targets.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={23} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Rupture_Icon.png'} startsDisabled={"1"} connectedButtons={[28]} connectedLines={[29, 30]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Rupture'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'15s'} tooltipCastTime={'1.3s'} tooltipDescription={'Deal 50% physical damage and apply a debuff to the target. While the debuff is active, the target acquires 1 Wounded stack per second while moving. After 5 seconds, the target takes another 150% physical damage plus 10% additional damage for each stack of Wounded.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={24} positionRow={'7'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Fighter/CripplingBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[25]} connectedLines={[31]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Crippling Blow'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'N/A'} tooltipCastTime={'0.9s'} tooltipDescription={'Deal 75% physical damage and apply Snared to target. If the target is Staggered, the effect is consumed and the target becomes Tripped.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={25} positionRow={'7'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Fighter/KnockOut_Icon.png'} startsDisabled={"1"} connectedButtons={[26]} connectedLines={[32]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Knock Out'} tooltipCost={'N/A'} tooltipRange={'4m'} tooltipCooldown={'N/A'} tooltipCastTime={'0.9s'} tooltipDescription={'Knock out target enemy, putting them to sleep for 10 seconds. Any damage breaks the effect.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={26} positionRow={'5'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BattleCry_Icon.png'} startsDisabled={"1"} connectedButtons={[27]} connectedLines={[33]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Battle Cry'} tooltipCost={'30'} tooltipRange={'AoE'} tooltipCooldown={'30s'} tooltipCastTime={'0.7s'} tooltipDescription={'Apply Riled to the caster and all nearby party members while applying Weakened to all nearby enemies. Gain 5 Combat Momentum for each target Riled and each enemy target that was Shaken.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={27} positionRow={'3'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofFluidity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 30]} connectedLines={[34, 35, 36]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Form Of Fluidity'} tooltipCost={'10'} tooltipRange={'N/A'} tooltipCooldown={'???'} tooltipCastTime={'0.7s'} tooltipDescription={'While in this form, the caster receives +4% Disable Resistance Chance per 10 Combat Momentum, up to a max of +40%. Overpower and Brutal Cleave apply Shaken to targets hit.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={28} positionRow={'3'} positionColumn={'6'} buttonType={1} icon={'./icons/skill_Icons/Fighter/Cataclysm_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Cataclysm'} tooltipCost={'40'} tooltipRange={'Frontal'} tooltipCooldown={'45s'} tooltipCastTime={'2.1s'} tooltipDescription={'Deal 275% physical damage and apply Shaken to all enemies in a large area in front of you. If the target is Staggered, the effect is consumed and the target becomes Tripped. Deals 15% additional damage to Chilled targets. 30% for Frozen targets.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={29} positionRow={'3'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofCelerity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Regenerative Form of Celerity'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Form of Celerity regenerates 0.01% of your max health per second per point of Combat Momentum you have.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={30} positionRow={'3'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofFluidity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Meditative Form of the River'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Form of Fluidity regenerates 0.01% of your max mana per second per point of Combat Momentum you have.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={31} positionRow={'10'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Fighter/CombatMomentum_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false} tooltipSide={'left'} tooltipName={'Combat Momentum'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={"Generate 1 Combat Momentum when hitting targets. Weapon combo finishers genereate 3 Combat Momentum plus an additional 1 per 10 the fighter already has. Combat Momentum grants unique increasing stat bonuses based on the Combat Form you are currently in and how much momentum you have."} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={32} positionRow={'9'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormOfFerocity_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false} tooltipSide={'left'} tooltipName={'Form Of Ferocity'} tooltipCost={'10'} tooltipRange={'N/A'} tooltipCooldown={'???'} tooltipCastTime={'0.7s'} tooltipDescription={'While in this form, the caster receives 1.5% Attack Speed per 10 Combat Momentum, up to a maximum of 15%. Overpower and Brutal Cleave apply Bleeding to targets hit. Shifting form costs 20% of current Combat Momentum and triggers cooldown for all Combat Forms.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={33} positionRow={'8'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Overpower_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false} tooltipSide={'left'} tooltipName={'Overpower'} tooltipCost={'10'} tooltipRange={'4m'} tooltipCooldown={'8s'} tooltipCastTime={'1s'} tooltipDescription={"Deal 150% physical damage to target enemy. This ability shares a cooldown with Brutal Cleave. Hitting an enemy with a weapon combo finisher refreshes Overpower's cooldown."} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={34} positionRow={'9'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BloodFusion_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'left'} tooltipName={'Preservative Blood Fusion'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={"When Blood Fusion is activated while below 50% health, gain 25% increased damage mitigation and healing received over the duration."} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} choiceMenuSide={''}  />
        </div>

        <div className='skill-tree' id='Ranger-Skill-Tree' data-show="0">
            <div className='ranger-skill-tree-bg' />
            
            {/*<SkillConnection index={37} connectionType={'0'} styleLeft={'0px'} styleTop={'0px'} styleWidth={'75px'} styleRotation={'0'} />*/}
            {/*<SkillButton index={0} positionRow={'1'} positionColumn={'1'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'PLACEHOLDER'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'PLACEHOLDER'} handleClick={handleClick} />*/}
            <div className='ranger-skill-tree-buttons'>
                <div className='ranger-skill-tree-buttons-bg' />

                <SkillConnection index={38} connectionType={0} styleLeft={'472px'} styleTop={'600px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={39} connectionType={0} styleLeft={'440px'} styleTop={'575px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={40} connectionType={0} styleLeft={'505px'} styleTop={'575px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={41} connectionType={0} styleLeft={'420px'} styleTop={'665px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={42} connectionType={0} styleLeft={'383px'} styleTop={'699px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={43} connectionType={0} styleLeft={'530px'} styleTop={'665px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={44} connectionType={0} styleLeft={'565px'} styleTop={'699px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={45} connectionType={1} styleLeft={'449px'} styleTop={'755px'} styleWidth={'60px'} styleRotation={'0'} />
                <SkillConnection index={46} connectionType={2} styleLeft={'472px'} styleTop={'790px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={47} connectionType={0} styleLeft={'330px'} styleTop={'390px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={48} connectionType={0} styleLeft={'240px'} styleTop={'390px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={49} connectionType={0} styleLeft={'165px'} styleTop={'390px'} styleWidth={'150px'} styleRotation={'90'} />
                <SkillConnection index={50} connectionType={0} styleLeft={'180px'} styleTop={'483px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={51} connectionType={0} styleLeft={'112px'} styleTop={'520px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={52} connectionType={0} styleLeft={'80px'} styleTop={'482px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={53} connectionType={0} styleLeft={'150px'} styleTop={'300px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={54} connectionType={0} styleLeft={'113px'} styleTop={'245px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={55} connectionType={0} styleLeft={'146px'} styleTop={'208px'} styleWidth={'175px'} styleRotation={'0'} />
                <SkillConnection index={56} connectionType={0} styleLeft={'292px'} styleTop={'180px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={57} connectionType={0} styleLeft={'382px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={58} connectionType={0} styleLeft={'382px'} styleTop={'450px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={59} connectionType={0} styleLeft={'600px'} styleTop={'390px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={60} connectionType={0} styleLeft={'562px'} styleTop={'450px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={61} connectionType={0} styleLeft={'562px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={62} connectionType={0} styleLeft={'705px'} styleTop={'390px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={63} connectionType={0} styleLeft={'705px'} styleTop={'390px'} styleWidth={'150px'} styleRotation={'90'} />
                <SkillConnection index={64} connectionType={0} styleLeft={'780px'} styleTop={'482px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={65} connectionType={0} styleLeft={'832px'} styleTop={'520px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={66} connectionType={0} styleLeft={'900px'} styleTop={'482px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={67} connectionType={0} styleLeft={'800px'} styleTop={'300px'} styleWidth={'75px'} styleRotation={'0'} />
                <SkillConnection index={68} connectionType={0} styleLeft={'832px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={69} connectionType={0} styleLeft={'718px'} styleTop={'208px'} styleWidth={'155px'} styleRotation={'0'} />
                <SkillConnection index={70} connectionType={0} styleLeft={'652px'} styleTop={'150px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={71} connectionType={0} styleLeft={'472px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={72} connectionType={0} styleLeft={'360px'} styleTop={'208px'} styleWidth={'125px'} styleRotation={'0'} />
                <SkillConnection index={73} connectionType={0} styleLeft={'540px'} styleTop={'208px'} styleWidth={'125px'} styleRotation={'0'} />
                <SkillConnection index={74} connectionType={1} styleLeft={'509px'} styleTop={'755px'} styleWidth={'60px'} styleRotation={'0'} />

                <SkillButton index={35} positionRow={'7'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Disengage_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[35, 36, 37]} connectedLines={[38, 39, 40]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Disengage'} tooltipCost={'15'} tooltipRange={''} tooltipCooldown={'20s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Quickly strike enemies in front of you while backflipping in the opposite direction. Targets hit by the strike take 100% physical damage and acquire 1 stack of Snared for 10 seconds. Targets hit that are Weakened are knocked back.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={36} positionRow={'7'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/OmnidirectionalDisengage_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Reinvigorating Disengage'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'When you hit one or more enemies with Disengage, its cooldown is refreshed and can be used again. This can only occure once per cooldown period.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={37} positionRow={'7'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/OmnidirectionalDisengage_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Omnidirecitonal Disengage'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Disengage now moves you in the direction of your input instead of always backward.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={38} positionRow={'8'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/CalloftheWild_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[38, 39, 75]} connectedLines={[41, 42, 43, 44]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Call of the Wild'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Remove all Snared and Chilled statuses from the caster, and increase movement speed by 20% while beomcing ummune to all movement impairing effects for 8 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={39} positionRow={'9'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/HuntoftheBear_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[40]} connectedLines={[45, 46]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hunt of the Bear'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={'toggle'} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Call forth the spirit of the bear, imbuing yourself with increased physical mitigation. Only one Hunt may be active at a time.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={40} positionRow={'9'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Strider_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[40, 74]} connectedLines={[74, 46]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"Strider"} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Increases ground movement speed by 10%.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={41} positionRow={'10'} positionColumn={'7'} buttonType={3} icon={'./icons/skill_Icons/Ranger/AirStrike_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Air Strike'} tooltipCost={'45'} tooltipRange={''} tooltipCooldown={'45s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Leap a great distance forward and into the air while firing 3 projectiles in a long line along the path, each dealing 150% physical damage to targets hit. Targets hit that are Snared have become Rooted, and all Snared stacks on those targets get consumed.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={42} positionRow={'5'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ScatterShot_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[42, 43, 44]} connectedLines={[47, 57, 58]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Scatter Shot'} tooltipCost={'15'} tooltipRange={'20m'} tooltipCooldown={'10s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fires a spread of projectiles, dealing 125% physical damage to every enemy target in a cone area in front of the caster. Triggers Ammo Imbue effects, once per target.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={43} positionRow={'6'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ScatterShot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Multi-Scatter Shot'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Scatter Shot has an additional charge.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={44} positionRow={'4'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ScatterShot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Concentrated Scatter Shot'} tooltipCost={''} tooltipRange={'30m'} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Scatter Shot becomes a held ability. After being fully charged, you instead fire a single projectile in a forward line that pierces through enemies dealing 250% physical damage.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={45} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Ranger/HuntoftheTiger_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[45, 49]} connectedLines={[48, 49]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hunt of the Tiger'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={'toggle'} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Call forth the spirit of the tiger, imbuing yourself with 10% increased critical damage. Only one Hunt may be active at a time.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={46} positionRow={'6'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Ranger/MarkoftheTiger_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[46]} connectedLines={[50]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Mark of the Tiger'} tooltipCost={'10'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Marks the target, increasing critical chance versus the target by 25%.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={47} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Snipe_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[47, 48]} connectedLines={[51, 52]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Snipe'} tooltipCost={'15'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={'cast'} tooltipCastTime={'3s'} tooltipResource={'Mana'} tooltipDescription={'Deal 400% physical damage and apply Shaken to target enemy. If the target is Bleeding, 1 stack is consumed and that target becomes Hemorraging.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={48} positionRow={'7'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Snipe_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'right'} tooltipName={'Heartseeking Snipe'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Snipe has a 30% increased chance to critically hit against enemies hit beyond 20 meters.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={49} positionRow={'6'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Snipe_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'right'} tooltipName={'Hasting Snipe'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Gain 20% increased attack speed for 5 seconds after casting Snipe.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={50} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ImbueAmmoBarbed_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[50]} connectedLines={[53]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Imbue Ammo: Barbed'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={'toggle'} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Imbues your ammunition with barbed thorns. Enemies hit by your weapon combo finishers, Barrage, or Scattershot become Bleeding.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={51} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Thorns_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[51]} connectedLines={[54, 55]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"Thorns"} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Envelop target ally with thorns, dealing damage equal to 1/3 the ranger's level and a 10% chance of applying Bleeding to attackers each time that ally is struck. Can be maintained one ally at a time and can't be applied to targets already effected by Thorns."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={52} positionRow={'3'} positionColumn={'5'} buttonType={1} icon={'./icons/skill_Icons/Ranger/VineField_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[52]} connectedLines={[56]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Vine Field'} tooltipCost={'20'} tooltipRange={'40m'} tooltipCooldown={'3s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Summon a vine field at target location. Targets in the area take 125% physical damage and become Rooted. Each target can only be hit once per instance. For each target hit by the initial tick that is Bleeding, 1 stack is consumed and that target becomes Hemorraging.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={53} positionRow={'2'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Ranger/VineField_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Ensnaring Vine Field'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Enemies acquire 1 stack of Snared per second while within Vine Field's area of effect."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={54} positionRow={'5'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/BearTrap_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[54, 55, 56]} connectedLines={[59, 60, 61]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Bear Trap'} tooltipCost={'15'} tooltipRange={'30m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Spawn a Trap at the target location which arms 1 sec after. When triggered, the target takes damage and is Rooted for 2 secs.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={55} positionRow={'6'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/BearTrap_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Bear Trap: Trapslinger'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Bear Trap becomes a thrown projectile and arms itself instantly upon landing. Deals double damage when triggered.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={56} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/BearTrap_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Bear Trap: Multitrap'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Bear Trap now has 3 charges, but the cooldown is increased by 15 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={57} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Ranger/HuntoftheRaven_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[57, 61]} connectedLines={[62, 63]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hunt of the Raven'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={'toggle'} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Call forth the spirit of the raven, imbuing yourself with increased physical penetration. Only one Hunt may be active at a time.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={58} positionRow={'6'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Ranger/MarkoftheRaven_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[58]} connectedLines={[64]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Mark of the Raven'} tooltipCost={'10'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={"Marks the target, triggering up to 33% physical damage everytime the target is hit, scaling based on the targets missing health %."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={59} positionRow={'6'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Headshot_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[59, 60]} connectedLines={[65, 66]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Headshot'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'8s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Deal 200% physical damage to target enemy. Deals 25% more damage to targets below 50% of their max health and applies 1 stack of Wounded to each 25% missing health of the target.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={60} positionRow={'7'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Headshot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Refreshing Headshot'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Headshot refunds 4 seconds of its cooldown when it hits a marked target.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={61} positionRow={'6'} positionColumn={'12'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Headshot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Mortal Headshot'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Headshot deals another 50% more damage to targets below 50% of their max health.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={62} positionRow={'4'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ImbueAmmoConcussive_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[62]} connectedLines={[67]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Imbue Ammo: Concussive'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={'toggle'} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Imbues your ammunition with concussive force. Enemies hit by your weapon combo finishers, Barrage, or Scattershot have a 50% chance to become Dazed.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={63} positionRow={'4'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/LightningReload_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[63]} connectedLines={[68, 69]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Lightning Reload'} tooltipCost={'10'} tooltipRange={''} tooltipCooldown={'60s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Grants a charge of Lightning Reload, allowing you to fire one ability shot for free, ignoring its cooldown and other costs.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={64} positionRow={'3'} positionColumn={'9'} buttonType={1} icon={'./icons/skill_Icons/Ranger/ThunderingShot_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[64]} connectedLines={[70]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Thundering Shot'} tooltipCost={'20'} tooltipRange={'30m'} tooltipCooldown={'20s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fire a lightning-infused projectile at a target enemy, dealing 200% physical damage and applying 10 stacks of Shocked to the target. If the primary target is Dazed, the effect is consumed and the target becomes Silenced.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={65} positionRow={'2'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ThunderingShot_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"Explosive Thundering Shot"} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'The arrow transforms into an explosive shot that deals 25% more damage and also hits enemies in an area around the target, but the number of stacks of Shocked applied to targets hit is reduced by 5.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={66} positionRow={'4'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ImbueAmmoWeighted_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[66]} connectedLines={[71]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Imbue Ammo: Weighted'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={'toggle'} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Imbues your ammunition with weight. Enemies hit by your weapon combo finishers, Barrage, or Scattershot become Snared.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={67} positionRow={'3'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/RainingDeath_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[51, 63]} connectedLines={[72, 73]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Raining Death'} tooltipCost={'10'} tooltipRange={'40m'} tooltipCooldown={'60s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fire two consecutive volleys of arrows in a wide area in front of you, dealing 100% physical damage and applying 1 stack of Wounded to enemies with each hit.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={68} positionRow={'10'} positionColumn={'13'} buttonType={0} icon={'./icons/skill_Icons/Ranger/WeaponBow_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Weapon Mastery: Bows'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Reduce the cooldown of Barrage and Scattershot by 3 seconds upon hitting an enemy with a weapon combo finisher.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={69} positionRow={'9'} positionColumn={'13'} buttonType={0} icon={'./icons/skill_Icons/Ranger/MarkoftheBear_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Mark of the Bear'} tooltipCost={'10'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Marks the target, reducing their mitigation by 25%.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={70} positionRow={'8'} positionColumn={'13'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Barrage_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Barrage'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fires a continual barrage of arrows at your target for 1.5 seconds, dealing 15% physical damage per arrow. Triggers Ammo Imbue effects, once per target hit. Each hit against Bleeding targets reduces the cooldown of this ability by 0.1 seconds. 0.2 seconds for targets with Hemorraging.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={71} positionRow={'8'} positionColumn={'12'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Barrage_Round_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Expeditious Barrage'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Reduce Barrage's movement penalty while channeled"} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={72} positionRow={'9'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Camoflague_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Camouflage'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"You become harder to see and can't be directly targeted. The further you are from an enemy, the more difficult you are to spot. Any outgoing combat actions cancel this effect, as well as incoming damage or other negative effects."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={73} positionRow={'9'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Regeneration_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Regeneration'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Grants 10 Regeneration Rating per Ranger level to a target ally. Can be maintained on one ally at a time. If your target already has Regeneration, activating Regeneration again will toggle it off."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={74} positionRow={'10'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Ranger/PartyStride_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Party Stride'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Applies Strider to all group members within 30 meters."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={75} positionRow={'10'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/CalloftheWild_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Unyielding Call of the Wild'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Call of the Wild breaks all disabling effects on the caster."} handleClick={handleClick} choiceMenuSide={''} />
            </div>

            <archetypeSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'ranger-tree-skill-point-tracker'} maxPoints={34} parentName={'Archetype'} />
            </archetypeSkillPointCount.Provider>
        </div>

        <div className='skill-tree' id='Mage-Skill-Tree' data-show="0">
            <div className='ranger-skill-tree-bg' />

            {/*<SkillConnection index={37} connectionType={0} styleLeft={'0px'} styleTop={'0px'} styleWidth={'75px'} styleRotation={'0'} />*/}
            {/*<SkillButton index={0} positionRow={'1'} positionColumn={'1'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'PLACEHOLDER'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'PLACEHOLDER'} handleClick={handleClick} />*/}
            <div className='mage-skill-tree-buttons'>
                <div className='mage-skill-tree-buttons-bg' />

                <SkillConnection index={76} connectionType={0} styleLeft={'148px'} styleTop={'296px'} styleWidth={'300px'} styleRotation={'90'} />
                <SkillConnection index={77} connectionType={0} styleLeft={'210px'} styleTop={'385px'} styleWidth={'150px'} styleRotation={'0'} />
                <SkillConnection index={78} connectionType={0} styleLeft={'172px'} styleTop={'352px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={79} connectionType={0} styleLeft={'134px'} styleTop={'200px'} styleWidth={'150px'} styleRotation={'90'} />
                <SkillConnection index={80} connectionType={2} styleLeft={'360px'} styleTop={'355px'} styleWidth={'240px'} styleRotation={'90'} />
                <SkillConnection index={81} connectionType={0} styleLeft={'330px'} styleTop={'475px'} styleWidth={'150px'} styleRotation={'0'} />
                <SkillConnection index={82} connectionType={0} styleLeft={'480px'} styleTop={'475px'} styleWidth={'150px'} styleRotation={'0'} />
                <SkillConnection index={83} connectionType={0} styleLeft={'584px'} styleTop={'380px'} styleWidth={'150px'} styleRotation={'90'} />
                <SkillConnection index={84} connectionType={0} styleLeft={'565px'} styleTop={'385px'} styleWidth={'155px'} styleRotation={'0'} />
                <SkillConnection index={85} connectionType={0} styleLeft={'494px'} styleTop={'310px'} styleWidth={'150px'} styleRotation={'90'} />
                <SkillConnection index={86} connectionType={0} styleLeft={'625px'} styleTop={'250px'} styleWidth={'250px'} styleRotation={'90'} />
                <SkillConnection index={87} connectionType={2} styleLeft={'759px'} styleTop={'395px'} styleWidth={'160px'} styleRotation={'90'} />
                <SkillConnection index={88} connectionType={0} styleLeft={'690px'} styleTop={'475px'} styleWidth={'150px'} styleRotation={'0'} />
                <SkillConnection index={89} connectionType={0} styleLeft={'840px'} styleTop={'475px'} styleWidth={'150px'} styleRotation={'0'} />
                <SkillConnection index={90} connectionType={0} styleLeft={'870px'} styleTop={'296px'} styleWidth={'300px'} styleRotation={'90'} />
                <SkillConnection index={91} connectionType={0} styleLeft={'925px'} styleTop={'386px'} styleWidth={'155px'} styleRotation={'0'} />
                <SkillConnection index={92} connectionType={0} styleLeft={'892px'} styleTop={'350px'} styleWidth={'75px'} styleRotation={'90'} />
                <SkillConnection index={93} connectionType={0} styleLeft={'892px'} styleTop={'250px'} styleWidth={'75px'} styleRotation={'90'} />
                

                <SkillButton index={76} positionRow={'6'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Mage/Fireball_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[74, 76, 77, 78]} connectedLines={[76, 77, 78, 80, 81]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Fireball'} tooltipCost={'15'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.7s'} tooltipResource={'Mana'} tooltipDescription={'Hurl a ball of fire toward your target, dealing 250% fire damage and applying Burning for 100% fire damage.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={77} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Mage/MagmaField_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[75]} connectedLines={[79]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Magma Field'} tooltipCost={'40'} tooltipRange={'30m'} tooltipCooldown={'25s'} tooltipUseOrCast={'use'} tooltipCastTime={'2.4s'} tooltipResource={'Mana'} tooltipDescription={'Erupts the earth at target location, forming a boiling pool of lava that deals 50% fire damage and applies Burning at 50% fire damage power every 2 seconds to enemies within the area. Lasts 8 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={78} positionRow={'2'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Mage/Pyromania_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Pyromania'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Magma Field casts faster and ticks two additional times.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={79} positionRow={'2'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Mage/Meteor_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Meteor'} tooltipCost={'60'} tooltipRange={'35m'} tooltipCooldown={'45s'} tooltipUseOrCast={'use'} tooltipCastTime={'3.6s'} tooltipResource={'Mana'} tooltipDescription={'Sends a massive flaming rock at the target location. Upon impact, it deals 300% fire damage and applies Conflagrating to enemies with Burning.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={80} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Mage/Combust_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Combust'} tooltipCost={'15'} tooltipRange={'30m'} tooltipCooldown={'10s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={"Instantly combust your target, dealing 125% fire damage and applying conflagrating if they are burning."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={81} positionRow={'3'} positionColumn={'6'} buttonType={3} icon={'./icons/skill_Icons/Mage/Fuse_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Fuse'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Your applied Burning statuses are 50% more powerful when applied to targets with Shocked.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={82} positionRow={'6'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Mage/LightningStrike_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[78, 80, 81, 82, 84]} connectedLines={[80, 82, 83, 84, 85, 87, 88]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Lightning Strike'} tooltipCost={'25'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={'held'} tooltipCastTime={'2.6s'} tooltipResource={'Mana'} tooltipDescription={'Charge up a bolt of lightning to unleash upon your target, dealing 100-300% lightning damage based on how long it was charged. Applies 5 stacks of Shocked to target.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={83} positionRow={'3'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Mage/LightningStrike_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"Amplified Lightning Strike"} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Lightning Strike applies up to 10 additional stacks of Shocked based on its charge level when cast. Additionally, if cast at full charge, lightning strike will also hit other nearby targets at base power.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={84} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Mage/BallLightning_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Ball Lightning'} tooltipCost={'25'} tooltipRange={''} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'2.5s'} tooltipResource={'Mana'} tooltipDescription={'Create a large ball of charged electricity that travels slowly forward, rapidly dealing 50% lightning damage and applying Volatile to enemies it overlaps with.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={85} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Mage/ChainLightning_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[83]} connectedLines={[86]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Chain Lightning'} tooltipCost={'35'} tooltipRange={'30m'} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'1.5s'} tooltipResource={'Mana'} tooltipDescription={'Release a powerful streak of lightning that hits your primary target and then chains outward to up to 5 nearby enemies from that target, dealing 175% lightning damage to each and applies 10 stacks of Shocked to targets with Volatile.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={86} positionRow={'2'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Mage/ChainLightning_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Aftershock'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Casting Chain Lightning on a primary target with Staggered causes the attack to trigger twice.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={87} positionRow={'4'} positionColumn={'10'} buttonType={3} icon={'./icons/skill_Icons/Mage/Frostbolt_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"Shattering Shards"} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'If Frostbolt hits a Frozen target, frost shards will splinter off, hitting the original target and up to 3 additional nearby enemies for 150% ice damage.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={88} positionRow={'6'} positionColumn={'12'} buttonType={0} icon={'./icons/skill_Icons/Mage/Frostbolt_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[84, 86, 88, 89]} connectedLines={[87, 89, 90, 91, 92]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Frostbolt'} tooltipCost={'20'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={'use'} tooltipCastTime={'1.7s'} tooltipResource={'Mana'} tooltipDescription={'Launch a bolt of frost towards your target, dealing 250% ice damage and applying Chilled.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={89} positionRow={'4'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Mage/ConeOfCold_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[87]} connectedLines={[93]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Cone of Cold'} tooltipCost={'20'} tooltipRange={'Frontal Cone'} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={'Blast a vortex of freezing wind in a cone in front of you, dealing 125% ice damage and applying Frozen to targets with Chilled.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={90} positionRow={'3'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Mage/ConeOfCold_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"Tempestuous Cone of Cold"} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"We don't know the effect of this ability"} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={91} positionRow={'2'} positionColumn={'12'} buttonType={0} icon={'./icons/skill_Icons/Mage/Blizzard_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Blizzard'} tooltipCost={'50'} tooltipRange={'AoE'} tooltipCooldown={'90s'} tooltipUseOrCast={'cast'} tooltipCastTime={'8.8s'} tooltipResource={'Mana'} tooltipDescription={"Channel a massive blizzard around you, raining a barrage of hail shards upon your enemies. Periodically pulses Chilled to targets within the area. Each shard impact deals 50% ice damage in a small area around it and applies Frozen to targets with Chilled."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={92} positionRow={'5'} positionColumn={'13'} buttonType={0} icon={'./icons/skill_Icons/Mage/Hoarfrost_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hoarfrost'} tooltipCost={'30'} tooltipRange={'AoE'} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.7s'} tooltipResource={'Mana'} tooltipDescription={'Unleash a blast of icy wind at a target location, dealing 125% ice damage and applying Chilled.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={93} positionRow={'3'} positionColumn={'14'} buttonType={0} icon={'./icons/skill_Icons/Mage/PrismaticBeam_Icon_single.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[91]} connectedLines={[94]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Prismatic Beam'} tooltipCost={'30'} tooltipRange={'Frontal Beam'} tooltipCooldown={'45s'} tooltipUseOrCast={'cast'} tooltipCastTime={'6.3s'} tooltipResource={'Mana'} tooltipDescription={'Channel a powerful beam in front of you that periodically deals 50% magical damage and has additional effects based on your Elemental Empowerment.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={94} positionRow={'2'} positionColumn={'14'} buttonType={0} icon={'./icons/skill_Icons/Mage/ArcaneCircle_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Arcane Circle'} tooltipCost={'30'} tooltipRange={'AoE around caster'} tooltipCooldown={'60s'} tooltipUseOrCast={'cast'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={'Place a powerful rune of magic upon the ground beneath you that g rants you Arcane Might while standing within. Lasts 15 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={95} positionRow={'5'} positionColumn={'15'} buttonType={0} icon={'./icons/skill_Icons/Mage/Blink_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Blink'} tooltipCost={'30'} tooltipRange={''} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.7s'} tooltipResource={'Mana'} tooltipDescription={"Instantly teleport 20 meters in the direction you are moving. Breaks all rooting effects."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={96} positionRow={'4'} positionColumn={'15'} buttonType={0} icon={'./icons/skill_Icons/Mage/Shell_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Shell'} tooltipCost={'25'} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={'use'} tooltipCastTime={'0.5s'} tooltipResource={'Mana'} tooltipDescription={'Apply a Shell to yourself.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={97} positionRow={'3'} positionColumn={'15'} buttonType={0} icon={'./icons/skill_Icons/Mage/Slumber_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Slumber'} tooltipCost={'30'} tooltipRange={'30m'} tooltipCooldown={'30s'} tooltipUseOrCast={'cast'} tooltipCastTime={'2.2s'} tooltipResource={'Mana'} tooltipDescription={'Applies Incapacitated to targets in a small area around the primary target. Lasts 10 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={98} positionRow={'2'} positionColumn={'15'} buttonType={0} icon={'./icons/skill_Icons/Mage/ArcaneEye_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Arcane Eye'} tooltipCost={'25'} tooltipRange={'20m around caster'} tooltipCooldown={'30s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={'Conjure a magical eye above you that reveals any camouflaged enemies within a 20 meter radius to you and your party. Lasts 10 seconds.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={99} positionRow={'7'} positionColumn={'16'} buttonType={0} icon={'./icons/skill_Icons/Mage/ElementalEmpowerment_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Elemental Empowerment'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'You become empowered by the element of your last cast elemental ability, gaining an empowerment buff'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={100} positionRow={'6'} positionColumn={'16'} buttonType={0} icon={'./icons/skill_Icons/Mage/ArcaneVolley_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Arcane Volley'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'10s'} tooltipUseOrCast={'cast'} tooltipCastTime={'1.3s'} tooltipResource={'Mana'} tooltipDescription={'Fire a volley of 7 arcane missiles at your target, dealing 35% arcane damage.'} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={101} positionRow={'6'} positionColumn={'15'} buttonType={0} icon={'./icons/skill_Icons/Mage/Combust_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Illuminate'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Conjure a circle of light around you that lightens up your surroundings."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={102} positionRow={'7'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Mage/LightningStrike_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Shatter'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"When you deal lightning damage to a recently Frozen target, they are dealt a bonus 300% ice damage. Shattered can only be triggered once every 4 seconds per caster against the same target."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={103} positionRow={'7'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Mage/Fireball_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Firebolt'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Hurl a bolt of fire toward your target, dealing 125% fire damage and applying Burning for 75% fire damage. It has 3 charges."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={104} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Mage/Fireball_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Bombardment'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Fireball and Firebolt now also apply Staggered. Firebolt gains bonus 25% direct damage. Fireball gains bonus 100% Burning damage."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={105} positionRow={'4'} positionColumn={'14'} buttonType={0} icon={'./icons/skill_Icons/Mage/ElementalEmpowerment_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Enchant Weapon'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Enchant up to 1 ally's weapon to match your current elemental empowerment. The enchantment will favor the greater of their magical or physical power stat."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={106} positionRow={'5'} positionColumn={'14'} buttonType={0} icon={'./icons/skill_Icons/Mage/Blink_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Accelerative Blink'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"After casting Blink, your nex Fireball, Frostbolt, or Lightning Strike cast within 3 seconds casts instantly."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={107} positionRow={'6'} positionColumn={'14'} buttonType={0} icon={'./icons/skill_Icons/Mage/Blink_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Unyielding Blink'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Blink breaks all disabling effects on the caster."} handleClick={handleClick} choiceMenuSide={''} />
                <SkillButton index={108} positionRow={'8'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Mage/ThermalEqualibrium_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Thermal Equilibrium'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Whenever you apply Frozen to a target, refresh the duration of your applied Conflagrating statuses on that target."} handleClick={handleClick} choiceMenuSide={''} />
            </div>

            <archetypeSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'mage-tree-skill-point-tracker'} maxPoints={26} parentName={'Archetype'} />
            </archetypeSkillPointCount.Provider>
        </div>
    </div>
        
    )
}