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

            <SkillButton tooltipSortClass={'skill-tree'} index={0} positionRow={'8'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LethalBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 2, 10]} connectedLines={[0, 2, 3, 12, 37]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Lethal Blow'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'10s'} tooltipCastTime={'1.1s'} tooltipDescription={'Deals damage based on the % amount of health the target is missing (up to 300% base damage)'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={1} positionRow={'9'} positionColumn={'5'} buttonType={3} icon={'./icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Reinvigorating Lethal Blow'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Killing an enemy with Lethal Blow resets the cooldown of Blitz'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={2} positionRow={'9'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LethalBlow_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Consuming Lethal Blow'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Lethal Blow returns 50% of overkill damage as health and mana'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={3} positionRow={'7'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Blitz_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 4, 5]} connectedLines={[1, 4, 5, 37]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Blitz'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'15s'} tooltipCastTime={''} tooltipDescription={'Charge directly towards your target and deal physical damage on impact'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={4} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Raging Blitz'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Blitz generates 20 momentum'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={5} positionRow={'7'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LungingAssault_Icon.png'} startsDisabled={"1"} connectedButtons={[6, 7]} connectedLines={[6, 7]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Lunging Assault'} tooltipCost={'15'} tooltipRange={'N/A'} tooltipCooldown={'5s'} tooltipCastTime={'0.6s'} tooltipDescription={'Lunge in a direction and perform an upward swing. Damages all enemies in front of you. Makes you immune to CC while using this attack.'} tooltipUseOrCast={'use'} tooltipResource={'Momentum'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={6} positionRow={'8'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LungingAssault_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Recharging Lunging Assault'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Lunging Assault gains an additional charge. Additionally, generates 5 more combat momentum when it damages an enemy'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={7} positionRow={'4'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LeapStrike_Icon.png'} startsDisabled={"1"} connectedButtons={[8]} connectedLines={[8]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Leap Strike'} tooltipCost={'30'} tooltipRange={'30m'} tooltipCooldown={'20s'} tooltipCastTime={'1.8s'} tooltipDescription={'Leap to a location and deal damage around you. Snares hit targets for 3 seconds'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={8} positionRow={'3'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofCelerity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 29]} connectedLines={[9, 10, 11]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Form of Celerity'} tooltipCost={'10'} tooltipRange={'N/A'} tooltipCooldown={'???'} tooltipCastTime={'0.7s'} tooltipDescription={'While in this form: +2% Movement Speed (per 10 momentum) [20% max]'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={9} positionRow={'2'} positionColumn={'6'} buttonType={1} icon={'./icons/skill_Icons/Fighter/ArtofWar_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Art of War'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Switching forms no longer triggers cooldowns or costs momentum'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={10} positionRow={'6'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BrutalCleave_Icon.png'} startsDisabled={"1"} connectedButtons={[11, 12, 18]} connectedLines={[13, 14, 22, 23]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Brutal Cleave'} tooltipCost={'20'} tooltipRange={'Frontal'} tooltipCooldown={'18s'} tooltipCastTime={'1s'} tooltipDescription={'Cleaves all enemies in front of you. Shares a cooldown with Overpower. Hitting an enemy with a weapon combo finisher reduces the cooldown by 8 seconds. +10-20 momentum (based on number of hit enemies)'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={11} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={"Come back after Alpha 2 release"} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={12} positionRow={'5'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Whirlwind_Icon.png'} startsDisabled={"1"} connectedButtons={[13, 14, 15]} connectedLines={[15, 16, 17]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Whirlwind'} tooltipCost={'30'} tooltipRange={'3m'} tooltipCooldown={'20s'} tooltipCastTime={'2.7s'} tooltipDescription={'Deal physical damage to all enemies around the Fighter. Spin rate increases the longer Whirlwind is channeled. User is immune to CC while spinning.'} tooltipUseOrCast={'cast'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={13} positionRow={'5'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Overdrive'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'After Whirlwind stops channeling, you may continue spinning at max speed while using momentum. Stops once momentum reaches 0 or the user stops the channel'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={14} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Climactic Whirlwind'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Perform a final swing in front of you after Whirlwind stops channeling. Generates 5-10 momentum based on number of targets hit'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={15} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Exert_Icon.png'} startsDisabled={"1"} connectedButtons={[16, 17, 28]} connectedLines={[18, 19, 20, 21]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Exert'} tooltipCost={'All'} tooltipRange={'N/A'} tooltipCooldown={'30s'} tooltipCastTime={'0.2s'} tooltipDescription={'Consumes your momentum rapidly. Gives the user +20% Attack Speed, Movement Speed, and CC Resistance while active. Must have 20 momentum to activate. Ends when momentum reaches 0.'} tooltipUseOrCast={'use'} tooltipResource={'Momentum'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={16} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Reinvigorating Exert'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Exert reduces all ability cooldowns by 1% per point of momentum'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={17} positionRow={'4'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Unstoppable Exert'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Exert breaks all CC on user and can be used at any time while under CC'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={18} positionRow={'5'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Maim_Icon.png'} startsDisabled={"1"} connectedButtons={[19, 20, 23]} connectedLines={[24, 25, 28]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Maim'} tooltipCost={'25'} tooltipRange={'Frontal'} tooltipCooldown={'12s'} tooltipCastTime={'1.4s'} tooltipDescription={'Strike in a frontal cone. Deals physical damage to all enemies hit. Deals 100% increased damaged to recently tripped targets'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={19} positionRow={'5'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Maim_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Slicing Maim'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Maim launches a piercing projectile that deals damage to enemies in its path'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={20} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[21, 22]} connectedLines={[26, 27]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Brutality'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Weapon combo finishers and extended finishers apply 5 Wound stacks plus an additional Wound for every 10 stacks already on the target'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={21} positionRow={'6'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Greater Brutality'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Overpower and Brutal Cleave apply 10 Wound stacks to enemies hit'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={22} positionRow={'4'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BloodFusion_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Blood Fusion'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'45s'} tooltipCastTime={'Instant'} tooltipDescription={'During the duration of the buff (6 secs): Return 100% of damage dealt as Health and 50% of damage dealt as mana. When used while below 50% Health: Gain 25% increased damage mitigation and healing received'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={23} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Rupture_Icon.png'} startsDisabled={"1"} connectedButtons={[28]} connectedLines={[29, 30]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Rupture'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'15s'} tooltipCastTime={'1.3s'} tooltipDescription={'Deal physical damage and apply a debuff. Target receives 5 Wound stacks per second while moving. 5 seconds later, the target takes heavy damage plus additional damage per stack of Wound'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={24} positionRow={'7'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Fighter/CripplingBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[25]} connectedLines={[31]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Crippling Blow'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'N/A'} tooltipCastTime={'0.9s'} tooltipDescription={'Deal physical damage and apply Snare to target for 6 seconds'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={25} positionRow={'7'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Fighter/KnockOut_Icon.png'} startsDisabled={"1"} connectedButtons={[26]} connectedLines={[32]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Knock Out'} tooltipCost={'N/A'} tooltipRange={'4m'} tooltipCooldown={'N/A'} tooltipCastTime={'0.9s'} tooltipDescription={'CC your target, putting them to sleep for 10 seconds. Any damage breaks this effect.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={26} positionRow={'5'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BattleCry_Icon.png'} startsDisabled={"1"} connectedButtons={[27]} connectedLines={[33]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Battle Cry'} tooltipCost={'30'} tooltipRange={'AoE'} tooltipCooldown={'30s'} tooltipCastTime={'0.7s'} tooltipDescription={'Apply Riled to user and all nearby party members. +5 momentum per Riled target. Apply Shaken to all nearby enemies.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={27} positionRow={'3'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofFluidity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 30]} connectedLines={[34, 35, 36]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Form Of Fluidity'} tooltipCost={'10'} tooltipRange={'N/A'} tooltipCooldown={'???'} tooltipCastTime={'0.7s'} tooltipDescription={'While in this form: +4% CC resistance (per 10 momentum) [20% max]'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={28} positionRow={'3'} positionColumn={'6'} buttonType={1} icon={'./icons/skill_Icons/Fighter/Cataclysm_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Cataclysm'} tooltipCost={'40'} tooltipRange={'Frontal'} tooltipCooldown={'45s'} tooltipCastTime={'2.1s'} tooltipDescription={'Deal heavy damage and apply Shaken to all enemies in front of you'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={29} positionRow={'3'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofCelerity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Relentless Form of the Avalanche'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Causes your weapon combo attacks to apply: 3 stacks of Staggered and +1 additional stack per 30 momentum you have'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={30} positionRow={'3'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofFluidity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Meditative Form of the River'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Increases your mana regen rate by 0.01% per point of momentum while in Form of Fluidity'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={31} positionRow={'10'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Fighter/CombatMomentum_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false} tooltipSide={'left'} tooltipName={'Combat Momentum'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={"Grants unique increasing stat bonuses based on the character's combat form and accumulated momentum"} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={32} positionRow={'9'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormOfFerocity_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false} tooltipSide={'left'} tooltipName={'Form Of Ferocity'} tooltipCost={'10'} tooltipRange={'N/A'} tooltipCooldown={'???'} tooltipCastTime={'0.7s'} tooltipDescription={'While in this form: +2% Attack Speed (Per 10 momentum) [20% max]'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={33} positionRow={'8'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Overpower_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false} tooltipSide={'left'} tooltipName={'Overpower'} tooltipCost={'10'} tooltipRange={'4m'} tooltipCooldown={'8s'} tooltipCastTime={'1s'} tooltipDescription={'Deal direct damage and apply Shaken to target. Shares a cooldown with Brutal Cleave. Cooldown refreshes when an enemy is hit with a weapon combo finisher. Grants +10 momentum.'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
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

                <SkillButton index={34} positionRow={'7'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Disengage_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[35, 36, 37]} connectedLines={[38, 39, 40]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Disengage'} tooltipCost={'15'} tooltipRange={''} tooltipCooldown={'20s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Backflip backwards a distance. Nearby enemies will be Snared for 4 seconds.'} handleClick={handleClick} />
                <SkillButton index={35} positionRow={'7'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/OmnidirectionalDisengage_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Reinvigorating Disengage'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'When you hit one or more enemies with Disengage, its cooldown is refreshed. Can be used once per cooldown period. (20s)'} handleClick={handleClick} />
                <SkillButton index={36} positionRow={'7'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/OmnidirectionalDisengage_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Omnidirecitonal Disengage'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Disengage now moves you in the direction of your input instead of backwards'} handleClick={handleClick} />
                <SkillButton index={37} positionRow={'8'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/CalloftheWild_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[38, 39]} connectedLines={[41, 42, 43, 44]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Call of the Wild'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Remove all movement impairing effects and increase movement speed by 20% for 8 seconds. Snares and Roots are ignored during this.'} handleClick={handleClick} />
                <SkillButton index={38} positionRow={'9'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/HuntoftheBear_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[40]} connectedLines={[45, 46]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hunt of the Bear'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Call forth the spirit of the bear, imbuing yourself with increased physical mitigation'} handleClick={handleClick} />
                <SkillButton index={39} positionRow={'9'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[40]} connectedLines={[74, 46]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} />
                <SkillButton index={40} positionRow={'10'} positionColumn={'7'} buttonType={3} icon={'./icons/skill_Icons/Ranger/AirStrike_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'top'} tooltipName={'Air Strike'} tooltipCost={'45'} tooltipRange={''} tooltipCooldown={'45s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Leap forward and into the air while firing 3 projectiles in a line. Each shot deals damage and roots the target for 3 seconds.'} handleClick={handleClick} />
                <SkillButton index={41} positionRow={'5'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ScatterShot_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[42, 43, 44]} connectedLines={[47, 57, 58]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Scatter Shot'} tooltipCost={'15'} tooltipRange={'20m'} tooltipCooldown={'10s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fire a spread of projectiles in a 20m cone in front of the caster, dealing physical damage'} handleClick={handleClick} />
                <SkillButton index={42} positionRow={'6'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ScatterShot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Multi-Scatter Shot'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Scatter Shot now has 2 charges'} handleClick={handleClick} />
                <SkillButton index={43} positionRow={'4'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ScatterShot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Concentrated Scatter Shot'} tooltipCost={''} tooltipRange={'30m'} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Scatter Shot becomes a held ability. After being fully charged, you fire a single projectile in a forward line that pierces enemies and deals significantly more damage.'} handleClick={handleClick} />
                <SkillButton index={44} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Ranger/HuntoftheTiger_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[45, 49]} connectedLines={[48, 49]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hunt of the Tiger'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Call forth the spirit of the tiger, imbuing yourself with 10% increased critital damage'} handleClick={handleClick} />
                <SkillButton index={45} positionRow={'6'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Ranger/MarkoftheTiger_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[46]} connectedLines={[50]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Mark of the Tiger'} tooltipCost={'10'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Marks the target, increasing the critical chance versis the target by 50%'} handleClick={handleClick} />
                <SkillButton index={46} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Snipe_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[47, 48]} connectedLines={[51, 52]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Snipe'} tooltipCost={'15'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={'cast'} tooltipCastTime={'3s'} tooltipResource={'Mana'} tooltipDescription={'A powerful ranged attack. Deals 300% physical damage'} handleClick={handleClick} />
                <SkillButton index={47} positionRow={'7'} positionColumn={'3'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Snipe_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'right'} tooltipName={'Heartseeking Snipe'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Snipe has a 30% increased chance to critically hit against targets beyond 20m'} handleClick={handleClick} />
                <SkillButton index={48} positionRow={'6'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Snipe_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'right'} tooltipName={'Hasting Snipe'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Gain 20% increased attack speed for 5 seconds after casting Snipe'} handleClick={handleClick} />
                <SkillButton index={49} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ImbueAmmoBarbed_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[50]} connectedLines={[53]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Imbue Ammo: Barbed'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Imbues your ammo with barbed thorns. Enemies hit by your bow attacks suffer Bleed. Each hit applies 3 seconds of the duration to the target. (30 seconds max) [10 charges]'} handleClick={handleClick} />
                <SkillButton index={50} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[51]} connectedLines={[54, 55]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} />
                <SkillButton index={51} positionRow={'3'} positionColumn={'5'} buttonType={1} icon={'./icons/skill_Icons/Ranger/VineField_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[52]} connectedLines={[56]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Vine Field'} tooltipCost={'20'} tooltipRange={'40m'} tooltipCooldown={'3s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Summons 3 fields of grabbing vines, one at the target location every 0.5 secs for 1.5 secs. Targets hit are damaged for 10% physical damage and snared for 3 secs. Targets with 10 secs of snare duration are Rooted.'} handleClick={handleClick} />
                <SkillButton index={52} positionRow={'2'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Ranger/VineField_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Ensnaring Vine Field'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Enemies are Snared while within Vine Field's area of effect."} handleClick={handleClick} />
                <SkillButton index={53} positionRow={'5'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/BearTrap_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[54, 55, 56]} connectedLines={[59, 60, 61]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Bear Trap'} tooltipCost={'15'} tooltipRange={'30m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Spawn a Trap at the target location which arms 1 sec after. When triggered, the target takes damage and is Rooted for 2 secs.'} handleClick={handleClick} />
                <SkillButton index={54} positionRow={'6'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/BearTrap_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Trap Slinger'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Bear Trap becomes a thrown projectile and arms instantly on landing. Deals double damage when triggered.'} handleClick={handleClick} />
                <SkillButton index={55} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./icons/skill_Icons/Ranger/BearTrap_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Multi Trap'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Bear Trap now has 3 charges. Cooldown increased by 15 secs.'} handleClick={handleClick} />
                <SkillButton index={56} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'./icons/skill_Icons/Ranger/HuntoftheRaven_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[57, 61]} connectedLines={[62, 63]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hunt of the Raven'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Call forth the spirit of the raven, imbuing yourself with increased physical penetration.'} handleClick={handleClick} />
                <SkillButton index={57} positionRow={'6'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Ranger/MarkoftheRaven_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[58]} connectedLines={[64]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Mark of the Raven'} tooltipCost={'10'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={"Marks the target, triggering bonus damage every time the target is hit. The lower the target's health, the higher the damage."} handleClick={handleClick} />
                <SkillButton index={58} positionRow={'6'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Headshot_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[59, 60]} connectedLines={[65, 66]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Headshot'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'8s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Deals 175% physical damage to target enemy.'} handleClick={handleClick} />
                <SkillButton index={59} positionRow={'7'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Headshot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Refreshing Headshot'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Headshot refunds 4 secs of its cooldown when it hits a Marked target.'} handleClick={handleClick} />
                <SkillButton index={60} positionRow={'6'} positionColumn={'12'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Headshot_Round_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Mortal Headshot'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Headshot deals 50% increased damage to targets below 50% health.'} handleClick={handleClick} />
                <SkillButton index={61} positionRow={'4'} positionColumn={'10'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ImbueAmmoConcussive_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[62]} connectedLines={[67]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Imbue Ammo: Concussive'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Imbues your ammo with concussive force. Enemies hit by your bow attacks suffer 10 stacks of Staggered. [10 Charges]'} handleClick={handleClick} />
                <SkillButton index={62} positionRow={'4'} positionColumn={'11'} buttonType={0} icon={'./icons/skill_Icons/Ranger/LightningReload_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[63]} connectedLines={[68, 69]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Lightning Reload'} tooltipCost={'10'} tooltipRange={''} tooltipCooldown={'60s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Grants a charge of Lightning Reload. Allows you to fire one Shot ability for free, ignoring its cooldown and costs.'} handleClick={handleClick} />
                <SkillButton index={63} positionRow={'3'} positionColumn={'9'} buttonType={1} icon={'./icons/skill_Icons/Ranger/ThunderingShot_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[64]} connectedLines={[70]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Thundering Shot'} tooltipCost={'20'} tooltipRange={'30m'} tooltipCooldown={'20s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fires a lightning-infused projectile at your target, dealing 200% of your physical power as lightning damage.'} handleClick={handleClick} />
                <SkillButton index={64} positionRow={'2'} positionColumn={'9'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 release'} handleClick={handleClick} />
                <SkillButton index={65} positionRow={'4'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/ImbueAmmoWeighted_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[66]} connectedLines={[71]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Imbue Ammo: Weighted'} tooltipCost={'5'} tooltipRange={''} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Imbues your ammo with weight. Enemies hit by your bow attacks suffer Snared. Each application applies 3 seconds of duration to the target. (12 secs max) [10 charges]'} handleClick={handleClick} />
                <SkillButton index={66} positionRow={'3'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Ranger/RainingDeath_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[51, 63]} connectedLines={[72, 73]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Raining Death'} tooltipCost={'10'} tooltipRange={'40m'} tooltipCooldown={'60s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fires a dense rain of arrows 20m ahead, dealing high damage. Deals more damage to more distant targets.'} handleClick={handleClick} />
                <SkillButton index={67} positionRow={'10'} positionColumn={'13'} buttonType={0} icon={'./icons/skill_Icons/Ranger/WeaponBow_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Weapon Mastery: Bows'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Lowers the Cooldown of Barrage and Scatter Shot by 3 secs after completing a Bow Weapon Combo or firing a fully charged Longbow'} handleClick={handleClick} />
                <SkillButton index={68} positionRow={'9'} positionColumn={'13'} buttonType={0} icon={'./icons/skill_Icons/Ranger/MarkoftheBear_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Mark of the Bear'} tooltipCost={'10'} tooltipRange={'35m'} tooltipCooldown={'30s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Marks the target, reducing their mitigation by 25%.'} handleClick={handleClick} />
                <SkillButton index={69} positionRow={'8'} positionColumn={'13'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Barrage_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Barrage'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={'Mana'} tooltipDescription={'Fires a continual barrage of arrows at your target for 1.5 secs. Deals 12% physical damage per arrow.'} handleClick={handleClick} />
                <SkillButton index={70} positionRow={'8'} positionColumn={'12'} buttonType={0} icon={'./icons/skill_Icons/Ranger/Barrage_Round_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Expeditions Barrage'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={"Reduce Barrage's movement penalty while channeled"} handleClick={handleClick} />
            </div>

            <archetypeSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'ranger-tree-skill-point-tracker'} maxPoints={34} parentName={'Archetype'} />
            </archetypeSkillPointCount.Provider>
        </div>

        <div className='skill-tree' id='Mage-Skill-Tree' data-show="0">
            <div className='ranger-skill-tree-bg' />

            {/*<SkillConnection index={37} connectionType={'0'} styleLeft={'0px'} styleTop={'0px'} styleWidth={'75px'} styleRotation={'0'} />*/}
            {/*<SkillButton index={0} positionRow={'1'} positionColumn={'1'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'PLACEHOLDER'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'PLACEHOLDER'} handleClick={handleClick} />*/}
            <div className='mage-skill-tree-buttons'>
                <div className='mage-skill-tree-buttons-bg' />

                <SkillButton index={71} positionRow={'5'} positionColumn={'2'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[72]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'right'} tooltipName={'Fissure'} tooltipCost={'20'} tooltipRange={'Frontal Line'} tooltipCooldown={'12s'} tooltipUseOrCast={'use'} tooltipCastTime={'1.1s'} tooltipResource={'Mana'} tooltipDescription={'Call forth a line of earthen spikes in a line in front of you. Deals 175% pierce damage, applies Staggered, and launches any enemy hit.'} handleClick={handleClick} />
                <SkillButton index={72} positionRow={'3'} positionColumn={'2'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'right'} tooltipName={'Quake'} tooltipCost={'35'} tooltipRange={'AoE around caster'} tooltipCooldown={'60s'} tooltipUseOrCast={'use'} tooltipCastTime={'2.6s'} tooltipResource={'Mana'} tooltipDescription={'Slam down causing an earthquake around the caster dealing 200-500% bludgeon damage depending on how long the ability was held. Applies Staggered to all hit enemies unless fully charged in which it applies Tripped.'} handleClick={handleClick} />
                <SkillButton index={73} positionRow={'6'} positionColumn={'4'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[74, 76, 77, 78]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Fireball'} tooltipCost={'15'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.7s'} tooltipResource={'Mana'} tooltipDescription={'Hurl a ball of fire toward your target. Deals 100% fire damage and applies Burning. [3 charges]'} handleClick={handleClick} />
                <SkillButton index={74} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[75]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Magma Field'} tooltipCost={'40'} tooltipRange={'30m'} tooltipCooldown={'25s'} tooltipUseOrCast={'use'} tooltipCastTime={'2.4s'} tooltipResource={'Mana'} tooltipDescription={'Erupts the earth at target location. Deals 30% fire damage and applies Burning to enemies in the area. Lasts 8.1 seconds.'} handleClick={handleClick} />
                <SkillButton index={75} positionRow={'2'} positionColumn={'3'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Pyromania'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Upon cast completion, an additional Magma Field spawns under the caster. Caster can become afflicted with Burning if they stay in the field.'} handleClick={handleClick} />
                <SkillButton index={76} positionRow={'2'} positionColumn={'4'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Meteor'} tooltipCost={'60'} tooltipRange={'35m'} tooltipCooldown={'45s'} tooltipUseOrCast={'use'} tooltipCastTime={'3.6s'} tooltipResource={'Mana'} tooltipDescription={'Sends a massive flaming rock at the target location. Upon impact, it deals 300% fire damage and applies Conflagrating to enemies with Burning.'} handleClick={handleClick} />
                <SkillButton index={77} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Combust'} tooltipCost={'15'} tooltipRange={'30m'} tooltipCooldown={'10s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={"Combust your target, dealing 125% fire damage and apply Conflagrating if they're Burning"} handleClick={handleClick} />
                <SkillButton index={78} positionRow={'3'} positionColumn={'6'} buttonType={3} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Fuse'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Your applied Burning DoTs are 50% more powerful when applied to targets with Shocked.'} handleClick={handleClick} />
                <SkillButton index={79} positionRow={'6'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[78, 80, 81, 82, 84]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Lightning Strike'} tooltipCost={'25'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={'use'} tooltipCastTime={'2.6s'} tooltipResource={'Mana'} tooltipDescription={'Charge up a bolt of lightning, dealing 275% lightning damage based on how long it was charged. Applies 20 stacks of Shocked to target.'} handleClick={handleClick} />
                <SkillButton index={80} positionRow={'3'} positionColumn={'7'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} />
                <SkillButton index={81} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Ball Lightning'} tooltipCost={'25'} tooltipRange={''} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'2.5s'} tooltipResource={'Mana'} tooltipDescription={'Create a large electric ball that travels forward slowly. Rapidly deals 50% lightning damage and applies Volatile to struck enemies.'} handleClick={handleClick} />
                <SkillButton index={82} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[83]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Chain Lightning'} tooltipCost={'35'} tooltipRange={'30m'} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'1.5s'} tooltipResource={'Mana'} tooltipDescription={'Release a powerful streak of lightning that strikes your target and chains to 5 nearby enemies. Deals 175% lightning damage each and applies 20 stacks of Shocked to any hit targets with Volatile.'} handleClick={handleClick} />
                <SkillButton index={83} positionRow={'2'} positionColumn={'9'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Aftershock'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Casting Chain Lightning on a primary target with Staggered causes the attack to trigger twice'} handleClick={handleClick} />
                <SkillButton index={84} positionRow={'4'} positionColumn={'10'} buttonType={3} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launches'} handleClick={handleClick} />
                <SkillButton index={85} positionRow={'6'} positionColumn={'12'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[84, 86, 88, 89]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Frostbolt'} tooltipCost={'20'} tooltipRange={'30m'} tooltipCooldown={'12s'} tooltipUseOrCast={'use'} tooltipCastTime={'1.7s'} tooltipResource={'Mana'} tooltipDescription={'Launch a bolt of frost at a target. Deals 225% ice damage. Applies Frozen if the target is Chilled.'} handleClick={handleClick} />
                <SkillButton index={86} positionRow={'4'} positionColumn={'11'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[87]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Cone of Cold'} tooltipCost={'20'} tooltipRange={'Frontal Cone'} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={'Blasts a vortex of freezing wind in a cone in front of you. Deals 125% ice damage and applies Frozen to targets with Chilled.'} handleClick={handleClick} />
                <SkillButton index={87} positionRow={'3'} positionColumn={'11'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} />
                <SkillButton index={88} positionRow={'2'} positionColumn={'12'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Blizzard'} tooltipCost={'50'} tooltipRange={'AoE'} tooltipCooldown={'90s'} tooltipUseOrCast={'cast'} tooltipCastTime={'8.8s'} tooltipResource={'Mana'} tooltipDescription={"Channel a massive blizzard. Each shard's impact deals 50% ice damage in a small AoE around it and applies Frozen to targets with Chilled. Periodically pulses Chilled to targets inside the AoE."} handleClick={handleClick} />
                <SkillButton index={89} positionRow={'5'} positionColumn={'13'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Hoarfrost'} tooltipCost={'30'} tooltipRange={'AoE'} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.7s'} tooltipResource={'Mana'} tooltipDescription={'Unleash a blast of icy wind at a location. Deals 125% ice damage and applies Chilled.'} handleClick={handleClick} />
                <SkillButton index={90} positionRow={'5'} positionColumn={'14'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[91]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Prismatic Beam'} tooltipCost={'30'} tooltipRange={'Frontal Beam'} tooltipCooldown={'45s'} tooltipUseOrCast={'cast'} tooltipCastTime={'6.3s'} tooltipResource={'Mana'} tooltipDescription={'Channel a powerful beam attack that periodically deals 30% magical damage and has additional effects based on your Elemental Empowerment. Fire: 33% chance to apply Burning. Ice: 33% chance to apply Chilled. Lightning: 33% chance to apply Volatile. Arcane (no empowerment): Each hit drains 2 mana per target, and returns up to 8 mana to the caster.'} handleClick={handleClick} />
                <SkillButton index={91} positionRow={'3'} positionColumn={'14'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'1'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={"We don't know this is one yet..."} tooltipCost={''} tooltipRange={''} tooltipCooldown={'1s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.4s'} tooltipResource={''} tooltipDescription={'Come back after A2 launch'} handleClick={handleClick} />
                <SkillButton index={92} positionRow={'2'} positionColumn={'14'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Arcane Circle'} tooltipCost={'30'} tooltipRange={'AoE around caster'} tooltipCooldown={'60s'} tooltipUseOrCast={'cast'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={'Place a powerful rune of magic on the ground around you. Grants Arcane Might while standing within. Lasts 10 seconds.'} handleClick={handleClick} />
                <SkillButton index={93} positionRow={'5'} positionColumn={'15'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Blink'} tooltipCost={'30'} tooltipRange={''} tooltipCooldown={'20s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.7s'} tooltipResource={'Mana'} tooltipDescription={"Instantly teleport 20 meters in the direction you're moving."} handleClick={handleClick} />
                <SkillButton index={94} positionRow={'4'} positionColumn={'15'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Shell'} tooltipCost={'25'} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={'use'} tooltipCastTime={'0.5s'} tooltipResource={'Mana'} tooltipDescription={'Apply a protectiove magical shell around you. Absorbs 500% magical power in damage before breaking. Lasts 15 seconds.'} handleClick={handleClick} />
                <SkillButton index={95} positionRow={'3'} positionColumn={'15'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Slumber'} tooltipCost={'30'} tooltipRange={'30m'} tooltipCooldown={'30s'} tooltipUseOrCast={'cast'} tooltipCastTime={'2.2s'} tooltipResource={'Mana'} tooltipDescription={'Applies Incapacitated to targets in a small area around the primary target. Lasts 10 seconds.'} handleClick={handleClick} />
                <SkillButton index={96} positionRow={'2'} positionColumn={'15'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={false} canBePressed={true} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'bottom'} tooltipName={'Arcane Eye'} tooltipCost={'25'} tooltipRange={'20m around caster'} tooltipCooldown={'30s'} tooltipUseOrCast={'use'} tooltipCastTime={'0.9s'} tooltipResource={'Mana'} tooltipDescription={'Conjure a magical eye above you reavling Camouflaged enemies within a 20 meter readius. Lasts 10 seconds.'} handleClick={handleClick} />
                <SkillButton index={97} positionRow={'7'} positionColumn={'16'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Elemental Empowerment'} tooltipCost={''} tooltipRange={''} tooltipCooldown={''} tooltipUseOrCast={''} tooltipCastTime={''} tooltipResource={''} tooltipDescription={'Whenever you cast an elemental spell, your weapon combo finishers apply a stack of Burning, Chilled, or Volatile to targets hit based on the current empowered element. Casting a spell changes the empowered element to the element just cast.'} handleClick={handleClick} />
                <SkillButton index={98} positionRow={'6'} positionColumn={'16'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={'0'} startsSelected={true} canBePressed={false} connectedButtons={[]} connectedLines={[]} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory} tooltipSortClass={'skill-tree'} tooltipSide={'left'} tooltipName={'Arcane Volley'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'10s'} tooltipUseOrCast={'cast'} tooltipCastTime={'1.3s'} tooltipResource={'Mana'} tooltipDescription={'Files a volley of 7 arcane missles at your target. Each missle dealts 35% arcane damage.'} handleClick={handleClick} />
            </div>

            <archetypeSkillPointCount.Provider value={count}>
                <SkillPointTracker id={'mage-tree-skill-point-tracker'} maxPoints={26} parentName={'Archetype'} />
            </archetypeSkillPointCount.Provider>
        </div>
    </div>
        
    )
}