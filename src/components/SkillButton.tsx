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
    buttonType: number, // 1 = basic, 2 = multi-path, 3 = choice
    icon: string,
    startsDisabled: string, // "0" || "1"
    startsSelected: boolean,
    canBePressed: boolean,
    connectedButtons: number[],
    connectedLines: number[],
    choices: string[][], // Each array in this array is a singular option, each option needs (in this order): Icon, Name, Description, and then all the tooltip props
    choiceMemory: number,
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

    let tooltip: HTMLCollectionOf<Element>

    let choiceMenu: HTMLCollectionOf<Element>
    let [ choiceMade, setChoiceMade ] = useState(false)
    let choiceData = useRef<string[]>([])
    let [ choiceMenuOpen, setChoiceMenuOpen ] = useState(false)
    let clearChoiceButton: HTMLCollectionOf<Element>

    let localTooltipData = useRef<string[]>([icon, tooltipName, tooltipCost, tooltipRange, tooltipCooldown, tooltipUseOrCast, tooltipCastTime, tooltipResource, tooltipDescription])

    setTimeout(() => {

        skillButtons = document.getElementsByClassName("skill-button")

        tooltip = document.getElementsByClassName(tooltipSortClass + "-tooltip")

        choiceMenu = document.getElementsByClassName("skill-choice-menu")

        clearChoiceButton = document.getElementsByClassName("clear-choice-button")

        if (setup === false) {
            startup()
        }
    }, 100)

    function startup()
    {
        if (startsDisabled === "1")
            {
                skillButtons[index].setAttribute('data-disabled', "1")
            }
            else
            {
                skillButtons[index].setAttribute('data-disabled', "0")
            }
    
            if (startsSelected === true)
            {
                skillButtons[index].setAttribute('data-selected', "1")
            }

        if (buttonType === 2)
        {
            for (let i = 0; i < choices.length; i++)
            {
                if (i === choiceMemory)
                {
                    localTooltipData.current[0] = choices[choiceMemory][0]  // Icon
                    localTooltipData.current[1] = choices[choiceMemory][1]  // Name
                    localTooltipData.current[2] = choices[choiceMemory][4]  // Cost
                    localTooltipData.current[3] = choices[choiceMemory][5]  // Range
                    localTooltipData.current[4] = choices[choiceMemory][6]  // Cooldown
                    localTooltipData.current[5] = choices[choiceMemory][7]  // Use or Cast
                    localTooltipData.current[6] = choices[choiceMemory][8]  // cast time
                    localTooltipData.current[7] = choices[choiceMemory][9]  // Resource
                    localTooltipData.current[8] = choices[choiceMemory][10] // Description

                    setChoiceMade(true)
                    setChoiceMenuOpen(false)

                    break
                }
            }
        }

            setSetup(true)
    }

    function onClick()
    {
        if (canBePressed !== false) {
            //Basic and Multipath button
            if (buttonType === 0 || buttonType === 1) {
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
                }
                    
            }
        }
    }

    function onHover()
    {
        if ((buttonType === 0 || buttonType === 1) && (choiceMade === false))
            tooltip[index].setAttribute("data-show", "1")

        if (buttonType === 2 && choiceMade === true && choiceMenuOpen === false)
            tooltip[index].setAttribute("data-show", "1")
    }

    function onHoverLeave()
    {
        tooltip[index].setAttribute("data-show", "0")
    }

    function GetChoiceData(id: number, data: string[])
    {
        choiceData.current = data

        console.log(data)

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
    }

    function ClearChoice()
    {
        localTooltipData.current[0] = "./icons/skill_Icons/Plus.png"
        skillButtons[index].setAttribute('data-selected', "0")
        updateChoiceMemoryFunction(index, -1)
        setChoiceMade(false)
        handleClick(index, connectedButtons, connectedLines)
    }

    return (
        <div className="skill-button" id={index.toString()} data-index={index} data-row={positionRow} data-column={positionColumn} data-button-type={buttonType} data-connection-count={0} data-selected="0" data-disabled={startsDisabled} data-connected-buttons={connectedButtons} data-connected-lines={connectedLines} onClick={onClick} onMouseOver={onHover} onMouseLeave={onHoverLeave}>
            <img className="skill-button-icon" src={localTooltipData.current[0]} alt="icon" draggable="false" />
            <div className="clear-choice-button" data-show="0">
                <BasicButton index={0} id={'remove-button'} icon={'./icons/Cross.png'} tooltipSortClass={''} tooltipSide={''} tooltipText={''} handleClick={ClearChoice}/>
            </div>
            
            <SkillChoicesMenu choices={choices} choiceDataReturn={GetChoiceData} side={"top"} buttonIndex={index} />
            <Tooltip sortClass={tooltipSortClass} index={index} side={tooltipSide} type={0} title={localTooltipData.current[1]} Cost={localTooltipData.current[2]} range={localTooltipData.current[3]} cooldown={localTooltipData.current[4]} castTime={localTooltipData.current[6]} description={localTooltipData.current[8]} useOrCast={localTooltipData.current[5]} resource={localTooltipData.current[7]} />
        </div>
    )
}