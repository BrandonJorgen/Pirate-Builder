import { createContext, useRef, useState } from 'react'
import SkillButton from './SkillButton'
import SkillConnection from './SkillConnection'
import './SkillTree.css'
import SkillPointTracker from './SkillPointTracker'

export const skillPointCount = createContext(0)

export default function SkillTree()
{
    let skillButtons: HTMLCollectionOf<Element>

    let lines: HTMLCollectionOf<Element>

    const [ count, setCount] = useState(0)

    setTimeout(() => {

        skillButtons = document.getElementsByClassName("skill-button")
        lines = document.getElementsByClassName("skill-connection")

    }, 100)
    

    function handleClick(index:number, connectedButtons: number[], connectedLines: number[])
    {

        UpdateConnections(index, connectedButtons, connectedLines)
            
    }

    function UpdateConnections(index: number, connectedButtons: number[], connectedLines: number[])
    {
        //Button is pressed
        if (skillButtons[index].getAttribute("data-selected") === "1")
        {
            IncrementCount()

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
                            tempNumber++

                            // convert the variable back into a string and set the attribute
                            skillButtons[connectedButtons[i]].setAttribute("data-connection-count", tempNumber.toString())
                        }
                    }

                    UpdateLines(index, connectedLines)
                }
            }
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
                        skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                        skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                        DecrementCount()
                    }

                    UpdateLines(index, connectedLines)

                    //Multipath button type disable and deselect
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "1")
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-connection-count") != null) 
                        {
                            // convert the connection count attribute to a number
                            let tempNumber = Number(skillButtons[connectedButtons[i]].getAttribute("data-connection-count"))

                            // -- the variable
                            tempNumber--

                            if (tempNumber < 0)
                                tempNumber = 0

                            // convert the variable back into a string and set the attribute
                            skillButtons[connectedButtons[i]].setAttribute("data-connection-count", tempNumber.toString())

                            // check if the "connection count" is 0, if so then deselect and disable the button
                            if (tempNumber <= 0)
                            {
                                skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                                skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                                DecrementCount()
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
        }
    }

    function UpdateLines(index: number, connectionLines: number[])
    {
        let tempCount: number = 0

        // Button Pressed
        if (skillButtons[index].getAttribute("data-selected") === "1") {
            if (connectionLines.length > 0)
            {
                for (let i = 0; i < connectionLines.length; i++)
                {
                    if (lines[connectionLines[i]] === undefined)
                        return
                        
                    lines[connectionLines[i]].setAttribute("data-active", "1")

                    if (lines[connectionLines[i]].getAttribute("data-multi") === "1")
                        tempCount = Number(lines[connectionLines[i]].getAttribute("data-connection-count"))
                        tempCount++
                        lines[connectionLines[i]].setAttribute("data-connection-count", tempCount.toString())
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
                        tempCount--

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
        setCount(count + 1)
    }

    function DecrementCount()
    {
        setCount(count - 1)
    }

    return(
    <div className='skill-tree'>
        <div className='skill-tree-bg' />

        <skillPointCount.Provider value={count}>
            <SkillPointTracker id={'fighter-tree-skill-point-tracker'} maxPoints={31} />
        </skillPointCount.Provider>

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

        <SkillButton index={0} positionRow={'8'} positionColumn={'6'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LethalBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 2, 10]} connectedLines={[0, 1, 2, 3, 12]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={1} positionRow={'9'} positionColumn={'5'} buttonType={1} icon={'src/assets/icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={2} positionRow={'9'} positionColumn={'7'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LethalBlow_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={3} positionRow={'7'} positionColumn={'5'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Blitz_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 4, 5]} connectedLines={[0, 1, 4, 5]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={4} positionRow={'8'} positionColumn={'4'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={5} positionRow={'7'} positionColumn={'2'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LungingAssault_Icon.png'} startsDisabled={"1"} connectedButtons={[6, 7]} connectedLines={[6, 7]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={6} positionRow={'8'} positionColumn={'2'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LungingAssault_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={7} positionRow={'4'} positionColumn={'2'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LeapStrike_Icon.png'} startsDisabled={"1"} connectedButtons={[8]} connectedLines={[8]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={8} positionRow={'3'} positionColumn={'2'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofCelerity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 29]} connectedLines={[9, 10, 11]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={9} positionRow={'2'} positionColumn={'6'} buttonType={1} icon={'src/assets/icons/skill_Icons/Fighter/ArtofWar_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={10} positionRow={'6'} positionColumn={'6'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/BrutalCleave_Icon.png'} startsDisabled={"1"} connectedButtons={[11, 12, 18]} connectedLines={[13, 14, 22, 23]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={11} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'src/assets/Placeholder_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={12} positionRow={'5'} positionColumn={'4'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Whirlwind_Icon.png'} startsDisabled={"1"} connectedButtons={[13, 14, 15]} connectedLines={[15, 16, 17]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={13} positionRow={'5'} positionColumn={'3'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={14} positionRow={'5'} positionColumn={'5'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={15} positionRow={'4'} positionColumn={'4'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Exert_Icon.png'} startsDisabled={"1"} connectedButtons={[16, 17, 28]} connectedLines={[18, 19, 20, 21]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={16} positionRow={'4'} positionColumn={'3'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={17} positionRow={'4'} positionColumn={'5'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={18} positionRow={'5'} positionColumn={'8'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Maim_Icon.png'} startsDisabled={"1"} connectedButtons={[19, 20, 23]} connectedLines={[24, 25, 28]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={19} positionRow={'5'} positionColumn={'7'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Maim_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={20} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[21, 22]} connectedLines={[26, 27]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={21} positionRow={'6'} positionColumn={'9'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={22} positionRow={'4'} positionColumn={'9'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/BloodFusion_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={23} positionRow={'4'} positionColumn={'8'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Rupture_Icon.png'} startsDisabled={"1"} connectedButtons={[28]} connectedLines={[29, 30]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={24} positionRow={'7'} positionColumn={'7'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/CripplingBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[25]} connectedLines={[31]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={25} positionRow={'7'} positionColumn={'10'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/KnockOut_Icon.png'} startsDisabled={"1"} connectedButtons={[26]} connectedLines={[32]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={26} positionRow={'5'} positionColumn={'10'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/BattleCry_Icon.png'} startsDisabled={"1"} connectedButtons={[27]} connectedLines={[33]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={27} positionRow={'3'} positionColumn={'10'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofFluidity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 30]} connectedLines={[34, 35, 36]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={28} positionRow={'3'} positionColumn={'6'} buttonType={1} icon={'src/assets/icons/skill_Icons/Fighter/Cataclysm_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={29} positionRow={'3'} positionColumn={'3'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofCelerity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={30} positionRow={'3'} positionColumn={'9'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofFluidity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={false} canBePressed={true}  />
        <SkillButton index={31} positionRow={'10'} positionColumn={'11'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/CombatMomentum_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false}  />
        <SkillButton index={32} positionRow={'9'} positionColumn={'11'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormOfFerocity_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false}  />
        <SkillButton index={33} positionRow={'8'} positionColumn={'11'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Overpower_Icon.png'} startsDisabled={"0"} connectedButtons={[]} connectedLines={[]} handleClick={handleClick} startsSelected={true} canBePressed={false}  />
    </div>
    )
}