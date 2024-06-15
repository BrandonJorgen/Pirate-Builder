import { useState } from "react"
import "./SkillButton.css"
import Tooltip from "./Tooltip"

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

    setTimeout(() => {

        skillButtons = document.getElementsByClassName("skill-button")

        tooltip = document.getElementsByClassName(tooltipSortClass + "-tooltip")

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

            setSetup(true)
    }

    function onClick()
    {
        if (canBePressed !== false) {
            //Basic and Multipath button
            if (buttonType === 0 || 1) {
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
        }
    }

    function onHover()
    {
        tooltip[index].setAttribute("data-show", "1")
    }

    function onHoverLeave()
    {
        tooltip[index].setAttribute("data-show", "0")
    }

    return (
        <div className="skill-button" id={index.toString()} data-index={index} data-row={positionRow} data-column={positionColumn} data-button-type={buttonType} data-connection-count={0} data-selected="0" data-disabled={startsDisabled} data-connected-buttons={connectedButtons} data-connected-lines={connectedLines} onClick={onClick} onMouseOver={onHover} onMouseLeave={onHoverLeave}>
            <img className="skill-button-icon" src={icon} alt="icon" draggable="false" />
            <Tooltip sortClass={tooltipSortClass} index={index} side={tooltipSide} type={0} title={tooltipName} Cost={tooltipCost} range={tooltipRange} cooldown={tooltipCooldown} castTime={tooltipCastTime} description={tooltipDescription} useOrCast={tooltipUseOrCast} resource={tooltipResource} />
        </div>
    )
}