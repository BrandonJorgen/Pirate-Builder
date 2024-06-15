import './Tooltip.css'

interface TooltipProps
{
    sortClass: string,
    index: number,
    side: string,
    type: number,
    title: string,
    Cost: string,
    range: string,
    cooldown: string,
    useOrCast: string,
    castTime: string,
    resource: string,
    description: string,
}

export default function Tooltip({ 
    sortClass,
    index, 
    side, 
    type = 0,
    title = "title", 
    Cost, 
    range, 
    cooldown, 
    useOrCast = "use", 
    castTime, 
    resource, 
    description = "description",
}: TooltipProps)
{
    // The intent is for this to appear on hover over certain elements
    // It needs to have a specific minimum size and then scale based on the content

    // The ideal structure for abilities (type 0):
    /*
            Ability Name
      [Upgrades: Ability Name]
      [Target Type (Targeted vs no target required)]
        Mana     | Cooldown
        Range    | Cast time

            Description

    */

    if (type === 0)
    {
        let manaString: string
        let rangeString: string
        let cooldownString: string
        let castTimeString: string
    
    
        if (Cost === "N/A" || Cost === "")
        {
            manaString = ""
        }
        else
        {
            manaString = resource + ": " + Cost
        }
    
    
        if (range === "N/A" || range === "")
        {
            rangeString = ""
        }
        else
        {
            rangeString = "Range: " + range
        }
    
    
        if (cooldown === "N/A" || cooldown === "")
        {
            cooldownString = ""
        }
        else
        {
            cooldownString = cooldown + " Cooldown"
        }
    
    
        if (useOrCast === "use")
        {
            castTimeString = castTime + " Use"
        }
        else
        {
            castTimeString = castTime + " Cast"
        }
    
        if (castTime === "N/A" || castTime === "")
        {
            castTimeString = ""
        }
    
        return(
            <div className={sortClass + "-tooltip tooltip"} id={index.toString()} data-show="0" data-side={side} data-type={type}>
                <span className="tooltip-title">{title}</span>
                <span className="tooltip-mana">{manaString}</span>
                <span className="tooltip-range">{rangeString}</span>
                <span className='tooltip-cooldown'>{cooldownString}</span>
                <span className='tooltip-cast-time'>{castTimeString}</span>
                <span className="tooltip-description">{description}</span>
            </div>
        )
    }

    if (type === 1)
    {
        return(
            <div className={sortClass + "-tooltip tooltip"} id={index.toString()} data-show="0" data-side={side} data-type={type}>
                <span className='tooltip-title'>test</span>
            </div>
        )
    }
}