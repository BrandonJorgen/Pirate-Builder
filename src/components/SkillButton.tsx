import { useRef, useState } from "react"
import "./SkillButton.css"
import Tooltip from "./Tooltip"
import SkillChoicesMenu from "./SkillChoicesMenu"
import BasicButton from "./BasicButton"

interface SkillButtonProps
{
    index: number,
    positionRow: string,
    positionColumn: string,
    buttonType: number, // 0 = basic, 1 = multi-path, 2 = choice, 3 = multi-requirement
    icon: string,
    startsDisabled: string, // "0" || "1"
    startsSelected: boolean,
    canBePressed: boolean,
    connectedButtons: number[],
    connectedLines: number[],
    choices: string[][], // Each array in this array is a singular option, each option needs (in this order): Icon, Name, Description, and then all the tooltip props
    choiceMemory: number,
    choiceMenuSide: string,
    updateChoiceMemoryFunction: (index: number, choice: number) => void,
    tooltipSortClass: string,
    tooltipSide: string,
    tooltipName: string,
    tooltipCost: string,
    tooltipRange: string,
    tooltipCooldown: string,
    tooltipUseOrCast: string,
    tooltipCastTime: string,
    tooltipResource: string,
    tooltipDescription: string,
    handleClick: (index: number, connectedButtons: number[], connectedLines: number[]) => void
}

export default function SkillButton({
     index, 
     positionRow, 
     positionColumn, 
     buttonType, 
     icon, 
     startsDisabled, 
     startsSelected,
     canBePressed,
     connectedButtons, 
     connectedLines,
     choices,
     choiceMemory,
     choiceMenuSide = "top",
     updateChoiceMemoryFunction,
     tooltipSortClass,
     tooltipSide,
     tooltipName,
     tooltipCost,
     tooltipRange,
     tooltipCooldown,
     tooltipUseOrCast = "use",
     tooltipCastTime,
     tooltipResource,
     tooltipDescription,
     handleClick 
    }: SkillButtonProps)
{
    const [setup, setSetup] = useState(false)
    let skillButtons: HTMLCollectionOf<Element>

    let tooltip = document.getElementsByClassName(tooltipSortClass + "-" + index + "-tooltip")

    let choiceMenu: HTMLCollectionOf<Element>
    let [ choiceMade, setChoiceMade ] = useState(false)
    let choiceData = useRef<string[]>([])
    let [ choiceMenuOpen, setChoiceMenuOpen ] = useState(false)
    let clearChoiceButton: HTMLCollectionOf<Element>
    let showMenu = useRef("0")
    
    let focused = useRef("0")

    let localTooltipData = useRef<string[]>([icon, tooltipName, tooltipCost, tooltipRange, tooltipCooldown, tooltipUseOrCast, tooltipCastTime, tooltipResource, tooltipDescription])

    let hoverTimer: number | undefined = undefined


    setTimeout(() => {

        skillButtons = document.getElementsByClassName("skill-button")

        choiceMenu = document.getElementsByClassName("skill-choice-menu")

        clearChoiceButton = document.getElementsByClassName("clear-choice-button")

        if (setup === false) 
        {
            startup()
        }

        if (choiceMemory === -1)
        {
            console.log("CHOICE SHOULD BE RESET")

            localTooltipData.current[0] = "./icons/skill_Icons/Plus.png"
            skillButtons[index].setAttribute('data-selected', "0")
            setChoiceMade(false)
        }
    }, 50)

    function startup()
    {

        if (startsDisabled === "1")
        {
            skillButtons[index].setAttribute('data-disabled', "1")
            //console.log("DISABLED THIS BITCH: " + index)
        }
        else
        {
            skillButtons[index].setAttribute('data-disabled', "0")
        }

        if (startsSelected === true)
        {
            skillButtons[index].setAttribute('data-selected', "1")
        }

        // Choice Button
        if (buttonType === 2)
        {
            if (choiceMemory !== undefined) 
            {

                if (choiceMemory !== -1) 
                {
                    localTooltipData.current[1] = choices[choiceMemory][1]  // Name
                    localTooltipData.current[0] = choices[choiceMemory][0]  // Icon
                    localTooltipData.current[2] = choices[choiceMemory][4]  // Cost
                    localTooltipData.current[3] = choices[choiceMemory][5]  // Range
                    localTooltipData.current[4] = choices[choiceMemory][6]  // Cooldown
                    localTooltipData.current[5] = choices[choiceMemory][7]  // Use or Cast
                    localTooltipData.current[6] = choices[choiceMemory][8]  // cast time
                    localTooltipData.current[7] = choices[choiceMemory][9]  // Resource
                    localTooltipData.current[8] = choices[choiceMemory][10] // Description
    
                    setChoiceMade(true)
                    setChoiceMenuOpen(false)
                    focused.current = "0"
                }
            }
        }

            setSetup(true)
    }

    function onClick()
    {
        if (canBePressed !== false) {
            //Basic, Multipath, or Multirequirement button
            if (buttonType === 0 || buttonType === 1 || buttonType === 3) {
                //Button isn't disabled
                if (skillButtons[index].getAttribute("data-disabled") === "0")
                {
                    if (skillButtons[index].getAttribute("data-selected") === "0")
                    {
                        skillButtons[index].setAttribute('data-selected', "1")
                    }
                    else
                    {
                        skillButtons[index].setAttribute('data-selected', "0")
                    }
        
                    handleClick(index, connectedButtons, connectedLines)
                }
            }

            // Choice button
            if (buttonType === 2)
            {
                if (tooltip === undefined || tooltip[index] === undefined)
                    return
        
                tooltip[index].setAttribute("data-show", "0")

                if (skillButtons[index].getAttribute("data-disabled") === "0")
                {
                    if (choiceMenu[index].getAttribute("data-show") === "0")
                    {
                        // Display the child choice component
                        choiceMenu[index].setAttribute("data-show", "1")
                        setChoiceMenuOpen(true)

                        if (choiceMade === true)
                            {
                                // show the clear button
                                clearChoiceButton[index].setAttribute("data-show", "1")
                            }
                            
                    }
                    else
                    {
                        choiceMenu[index].setAttribute("data-show", "0")
                        clearChoiceButton[index].setAttribute("data-show", "0")
                        setChoiceMenuOpen(false)
                        focused.current = "0"
                    }
                }  
            }
        }
    }

    function onHover()
    {
        if (buttonType === 2) 
        {
            clearTimeout(hoverTimer)
            focused.current = "1"
        }

        if (tooltip === undefined || tooltip[0] === undefined)
            return

        if ((buttonType === 0 || buttonType === 1 || buttonType === 3) && (choiceMade === false))
            tooltip[0].setAttribute("data-show", "1")

        if (buttonType === 2 && choiceMade === true && choiceMenuOpen === false)
            tooltip[0].setAttribute("data-show", "1")
    }

    function onHoverLeave()
    {
        tooltip[0].setAttribute("data-show", "0")
        
        if (buttonType === 2) {
            hoverTimer = setTimeout(() => {
    
                if (choiceMenuOpen === true)
                {
                    choiceMenu[index].setAttribute("data-show", "0")
                    clearChoiceButton[index].setAttribute("data-show", "0")
                    setChoiceMenuOpen(false)
                }
                    
                    focused.current = "0"
            }, 500);
        }
    }

    function GetChoiceData(id: number, data: string[])
    {
        choiceData.current = data

        // Feed data
        localTooltipData.current[0] = data[0]  // Icon
        localTooltipData.current[1] = data[1]  // Name
        localTooltipData.current[2] = data[4]  // Cost
        localTooltipData.current[3] = data[5]  // Range
        localTooltipData.current[4] = data[6]  // Cooldown
        localTooltipData.current[5] = data[7]  // Use or Cast
        localTooltipData.current[6] = data[8]  // cast time
        localTooltipData.current[7] = data[9]  // Resource
        localTooltipData.current[8] = data[10] // Description

        if (skillButtons[index].getAttribute("data-selected") === "0")
        {
            skillButtons[index].setAttribute('data-selected', "1")

            handleClick(index, connectedButtons, connectedLines)
        }

        updateChoiceMemoryFunction(index, id)

        setChoiceMade(true)
        setChoiceMenuOpen(false)
        focused.current = "0"
    }

    function ClearChoice()
    {
        localTooltipData.current[0] = "./icons/skill_Icons/Plus.png"
        skillButtons[index].setAttribute('data-selected', "0")
        updateChoiceMemoryFunction(index, -1)
        setChoiceMade(false)
        focused.current = "0"
        handleClick(index, connectedButtons, connectedLines)
    }

    return (
        <div className="skill-button" id={index.toString()} data-index={index} data-row={positionRow} data-column={positionColumn} data-button-type={buttonType} data-connection-count={0} data-selected="0" data-disabled={startsDisabled} data-starts-disabled={startsDisabled} data-was-disabled={"0"} data-connected-buttons={connectedButtons} data-connected-lines={connectedLines} data-focused={focused.current} onClick={onClick} onMouseOver={onHover} onMouseLeave={onHoverLeave}>
            <img className="skill-button-icon" src={localTooltipData.current[0]} alt="icon" draggable="false" />
            <div className="clear-choice-button" data-show="0">
                <BasicButton index={0} id={'remove-button'} icon={'./icons/Cross.png'} tooltipSortClass={''} tooltipSide={''} tooltipText={''} handleClick={ClearChoice}/>
            </div>
            
            <SkillChoicesMenu choices={choices} choiceDataReturn={GetChoiceData} side={choiceMenuSide} buttonIndex={index} showMenu={showMenu.current} />
            <Tooltip sortClass={tooltipSortClass + "-" + index} index={index} side={tooltipSide} type={0} title={localTooltipData.current[1]} Cost={localTooltipData.current[2]} range={localTooltipData.current[3]} cooldown={localTooltipData.current[4]} castTime={localTooltipData.current[6]} description={localTooltipData.current[8]} useOrCast={localTooltipData.current[5]} resource={localTooltipData.current[7]} />
        </div>
    )
}