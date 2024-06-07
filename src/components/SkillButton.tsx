import { useState } from "react"
import "./SkillButton.css"

//{ connected buttons: []}
interface SkillButtonProps
{
    updatePressed: (index: number, bool: number) => void
    index: number
    icon: string
    isDisabled: boolean
    isSelected: "true" | "false"
}

export default function SkillButton({ updatePressed = (index: number, bool: number) => {} , index, icon, isDisabled, isSelected}: SkillButtonProps)
{

    const [selected, setSelected] = useState(isSelected)
    const [disabled, setDisabled] = useState(isDisabled)
    
    function onHover()
    {
        console.log("Button Hovered")
    }

    function onPressed()
    {
        if (disabled == true)
            {
                return
            }

        if (selected == "false")
            {
                updatePressed(index, 1)
                setSelected("true")
            }
            else
            {
                updatePressed(index, 0)
                setSelected("false")
            }
        
    }

    return (
        <div className="skill-button" data-selected={selected} data-disabled={disabled} onClick={onPressed} onMouseOver={onHover}>
            <img className="skill-button-icon" src={icon} alt="Skill Button Icon" />
        </div>
    )
}