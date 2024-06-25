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

                    console.log("current index in memory: " + i + ", the current button: " + o)

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

            <SkillConnection index={0} isMulti={'1'} styleLeft={"333px"} styleTop={"635px"} styleWidth={'70px'} styleRotation={'0'} />
            <SkillConnection index={1} isMulti={'1'} styleLeft={"268px"} styleTop={"640px"} styleWidth={'125px'} styleRotation={'90'} />
            <SkillConnection index={2} isMulti={'0'} styleLeft={"446px"} styleTop={"635px"} styleWidth={'70px'} styleRotation={'0'} />
            <SkillConnection index={3} isMulti={'0'} styleLeft={"475px"} styleTop={"675px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={4} isMulti={'0'} styleLeft={"50px"} styleTop={"545px"} styleWidth={'275px'} styleRotation={'0'} />
            <SkillConnection index={5} isMulti={'0'} styleLeft={"205px"} styleTop={"585px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={6} isMulti={'0'} styleLeft={"25px"} styleTop={"590px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={7} isMulti={'0'} styleLeft={"-62px"} styleTop={"430px"} styleWidth={'250px'} styleRotation={'90'} />
            <SkillConnection index={8} isMulti={'0'} styleLeft={"25px"} styleTop={"250px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={9} isMulti={'0'} styleLeft={"80px"} styleTop={"190px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={10} isMulti={'0'} styleLeft={"24px"} styleTop={"140px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={11} isMulti={'0'} styleLeft={"57px"} styleTop={"100px"} styleWidth={'350px'} styleRotation={'0'} />
            <SkillConnection index={12} isMulti={'0'} styleLeft={"358px"} styleTop={"545px"} styleWidth={'125px'} styleRotation={'90'} />
            <SkillConnection index={13} isMulti={'0'} styleLeft={"170px"} styleTop={"455px"} styleWidth={'220px'} styleRotation={'0'} />
            <SkillConnection index={14} isMulti={'0'} styleLeft={"205px"} styleTop={"420px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={15} isMulti={'0'} styleLeft={"170px"} styleTop={"370px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={16} isMulti={'0'} styleLeft={"240px"} styleTop={"370px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={17} isMulti={'0'} styleLeft={"205px"} styleTop={"330px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={18} isMulti={'0'} styleLeft={"170px"} styleTop={"275px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={19} isMulti={'0'} styleLeft={"240px"} styleTop={"275px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={20} isMulti={'0'} styleLeft={"205px"} styleTop={"230px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={21} isMulti={'0'} styleLeft={"238px"} styleTop={"195px"} styleWidth={'175px'} styleRotation={'0'} />
            <SkillConnection index={22} isMulti={'0'} styleLeft={"445px"} styleTop={"455px"} styleWidth={'161px'} styleRotation={'0'} />
            <SkillConnection index={23} isMulti={'0'} styleLeft={"565px"} styleTop={"420px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={24} isMulti={'0'} styleLeft={"500px"} styleTop={"370px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={25} isMulti={'0'} styleLeft={"600px"} styleTop={"370px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={26} isMulti={'0'} styleLeft={"654px"} styleTop={"330px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={27} isMulti={'0'} styleLeft={"654px"} styleTop={"430px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={28} isMulti={'0'} styleLeft={"565px"} styleTop={"330px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={29} isMulti={'0'} styleLeft={"565px"} styleTop={"230px"} styleWidth={'75px'} styleRotation={'90'} />
            <SkillConnection index={30} isMulti={'0'} styleLeft={"431px"} styleTop={"195px"} styleWidth={'175px'} styleRotation={'0'} />
            <SkillConnection index={31} isMulti={'0'} styleLeft={"540px"} styleTop={"545px"} styleWidth={'220px'} styleRotation={'0'} />
            <SkillConnection index={32} isMulti={'0'} styleLeft={"720px"} styleTop={"460px"} styleWidth={'125px'} styleRotation={'90'} />
            <SkillConnection index={33} isMulti={'0'} styleLeft={"720px"} styleTop={"275px"} styleWidth={'125px'} styleRotation={'90'} />
            <SkillConnection index={34} isMulti={'0'} styleLeft={"700px"} styleTop={"190px"} styleWidth={'75px'} styleRotation={'0'} />
            <SkillConnection index={35} isMulti={'0'} styleLeft={"730px"} styleTop={"146px"} styleWidth={'100px'} styleRotation={'90'} />
            <SkillConnection index={36} isMulti={'0'} styleLeft={"430px"} styleTop={"100px"} styleWidth={'350px'} styleRotation={'0'} />

            <SkillButton tooltipSortClass={'skill-tree'} index={0} positionRow={'8'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LethalBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 2, 10]} connectedLines={[0, 1, 2, 3, 12]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Lethal Blow'} tooltipCost={'15'} tooltipRange={'4m'} tooltipCooldown={'10s'} tooltipCastTime={'1.1s'} tooltipDescription={'Deals damage based on the % amount of health the target is missing (up to 300% base damage)'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={1} positionRow={'9'} positionColumn={'5'} buttonType={1} icon={'./icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Reinvigorating Lethal Blow'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Killing an enemy with Lethal Blow resets the cooldown of Blitz'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={2} positionRow={'9'} positionColumn={'7'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LethalBlow_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Consuming Lethal Blow'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Lethal Blow returns 50% of overkill damage as health and mana'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={3} positionRow={'7'} positionColumn={'5'} buttonType={0} icon={'./icons/skill_Icons/Fighter/Blitz_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 4, 5]} connectedLines={[0, 1, 4, 5]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Blitz'} tooltipCost={'10'} tooltipRange={'30m'} tooltipCooldown={'15s'} tooltipCastTime={''} tooltipDescription={'Charge directly towards your target and deal physical damage on impact'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={4} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'./icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Raging Blitz'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Blitz generates 20 momentum'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={5} positionRow={'7'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LungingAssault_Icon.png'} startsDisabled={"1"} connectedButtons={[6, 7]} connectedLines={[6, 7]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Lunging Assault'} tooltipCost={'15'} tooltipRange={'N/A'} tooltipCooldown={'5s'} tooltipCastTime={'0.6s'} tooltipDescription={'Lunge in a direction and perform an upward swing. Damages all enemies in front of you. Makes you immune to CC while using this attack.'} tooltipUseOrCast={'use'} tooltipResource={'Momentum'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={6} positionRow={'8'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LungingAssault_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Recharging Lunging Assault'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Lunging Assault gains an additional charge. Additionally, generates 5 more combat momentum when it damages an enemy'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={7} positionRow={'4'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/LeapStrike_Icon.png'} startsDisabled={"1"} connectedButtons={[8]} connectedLines={[8]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Leap Strike'} tooltipCost={'30'} tooltipRange={'30m'} tooltipCooldown={'20s'} tooltipCastTime={'1.8s'} tooltipDescription={'Leap to a location and deal damage around you. Snares hit targets for 3 seconds'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={8} positionRow={'3'} positionColumn={'2'} buttonType={0} icon={'./icons/skill_Icons/Fighter/FormofCelerity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 29]} connectedLines={[9, 10, 11]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'right'} tooltipName={'Form of Celerity'} tooltipCost={'10'} tooltipRange={'N/A'} tooltipCooldown={'???'} tooltipCastTime={'0.7s'} tooltipDescription={'While in this form: +2% Movement Speed (per 10 momentum) [20% max]'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={9} positionRow={'2'} positionColumn={'6'} buttonType={1} icon={'./icons/skill_Icons/Fighter/ArtofWar_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Art of War'} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={'Switching forms no longer triggers cooldowns or costs momentum'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={10} positionRow={'6'} positionColumn={'6'} buttonType={0} icon={'./icons/skill_Icons/Fighter/BrutalCleave_Icon.png'} startsDisabled={"1"} connectedButtons={[11, 12, 18]} connectedLines={[13, 14, 22, 23]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={'Brutal Cleave'} tooltipCost={'20'} tooltipRange={'Frontal'} tooltipCooldown={'18s'} tooltipCastTime={'1s'} tooltipDescription={'Cleaves all enemies in front of you. Shares a cooldown with Overpower. Hitting an enemy with a weapon combo finisher reduces the cooldown by 8 seconds. +10-20 momentum (based on number of hit enemies)'} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
            <SkillButton tooltipSortClass={'skill-tree'} index={11} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'./Placeholder_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true} tooltipSide={'bottom'} tooltipName={"We don't know this one yet..."} tooltipCost={'N/A'} tooltipRange={'N/A'} tooltipCooldown={'N/A'} tooltipCastTime={'N/A'} tooltipDescription={"We don't know this one yet. Come back after Alpha 2 release"} tooltipUseOrCast={'use'} tooltipResource={'Mana'} choices={[]} choiceMemory={0} updateChoiceMemoryFunction={UpdateChoiceMemory}  />
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
    </div>
        
    )
}