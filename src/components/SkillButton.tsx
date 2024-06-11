import "./SkillButton.css"

interface SkillButtonProps
{
    index: number,
    positionRow: string,
    positionColumn: string,
    buttonType: number, // 1 = basic, 2 = multi-path, 3 = choice
    icon: string,
    startsDisabled: string, // "0" || "1"
    connectedButtons: number[],
    handleClick: (index: number, connectedButtons: number[]) => void
}

export default function SkillButton({
     index, 
     positionRow, 
     positionColumn, 
     buttonType, 
     icon, 
     startsDisabled, 
     connectedButtons, 
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
    }, 100)

    function onClick()
    {
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
    
                handleClick(index, connectedButtons)
            }
        }
    }

    return (
        <div className="skill-button" data-index={index} data-row={positionRow} data-column={positionColumn} data-button-type={buttonType} data-connection-count={0} data-selected="0" data-disabled={startsDisabled} data-connected-buttons={connectedButtons} onClick={onClick}>
            <img className="skill-button-icon" src={icon} alt="icon" />
        </div>
    )
}