import Tooltip from "./Tooltip";
import './SkillChoice.css'

interface SkillChoiceProps
{
    index: number,
    buttonIndex: number,
    icon: string,
    name: string,
    description: string,
    clickFunction: (event: any) => void,
    tooltipSide: string,
    tooltipName: string,
    tooltipCost: string,
    tooltipRange: string,
    tooltipCooldown: string,
    tooltipUseOrCast: string,
    tooltipCastTime: string,
    tooltipResource: string,
    tooltipDescription: string,
}

export default function SkillChoice({ 
    index, 
    buttonIndex,
    icon, 
    name = "Placeholder", 
    description = "Placeholder", 
    clickFunction,
    tooltipSide,
    tooltipName,
    tooltipCost,
    tooltipRange,
    tooltipCooldown,
    tooltipUseOrCast = "use",
    tooltipCastTime,
    tooltipResource,
    tooltipDescription,
 }: SkillChoiceProps)
{

    let tooltip: HTMLCollectionOf<Element>

    setTimeout(() => {
        tooltip = document.getElementsByClassName("skill-choice-" + index + "-tooltip")
    }, 100)

    function onHover()
    {
        tooltip[buttonIndex].setAttribute("data-show", "1")
    }

    function onHoverLeave()
    {
        tooltip[buttonIndex].setAttribute("data-show", "0")
    }

    function HandleClick(event: any)
    {
        tooltip[buttonIndex].setAttribute("data-show", "0")
        clickFunction(event)
    }

    return(
        <div className="skill-choice" id={index.toString()} onClick={HandleClick} onMouseEnter={onHover} onMouseLeave={onHoverLeave}>
            <img id={index.toString()} src={icon} alt="Icon" data-row="0" data-column="1"/>
            <span className="skill-choice-name" id={index.toString()} data-row="1" data-column="2">{name}</span>
            <span className="skill-choice-description" id={index.toString()} data-row="2" data-column="2">{description}</span>
            <Tooltip sortClass={"skill-choice-" + index} index={index} side={tooltipSide} type={1} title={tooltipName} Cost={tooltipCost} range={tooltipRange} cooldown={tooltipCooldown} useOrCast={tooltipUseOrCast} castTime={tooltipCastTime} resource={tooltipResource} description={tooltipDescription} />
        </div>
    )
}