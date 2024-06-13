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
     handleClick 
    }: SkillButtonProps)
{

    let skillButtons: HTMLCollectionOf<Element>

    setTimeout(() => {
        skillButtons = document.getElementsByClassName("skill-button")

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
    }, 100)

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
        // Tell tooltip to show
    }

    return (
        <div className="skill-button" data-index={index} data-row={positionRow} data-column={positionColumn} data-button-type={buttonType} data-connection-count={0} data-selected="0" data-disabled={startsDisabled} data-connected-buttons={connectedButtons} data-connected-lines={connectedLines} onClick={onClick} onMouseOver={onHover}>
            <img className="skill-button-icon" src={icon} alt="icon" />
        </div>
    )
}