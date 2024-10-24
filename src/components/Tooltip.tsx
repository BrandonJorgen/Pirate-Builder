import './Tooltip.css'

interface TooltipProps
{
    sortClass: string,
    index: number,
    side: string,
    type: number, // 0 = skill, 1 = skill choice
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


    switch (useOrCast)
    {
        case "use":
            castTimeString = castTime + " Use"
            break;
        
        case "toggle":
            castTimeString = "Toggled"
            break;

        case "held":
            castTimeString = castTime + " Hold"
            break;

        case "channel":
            castTimeString = castTime + " Channel"
            break;

        default:
            castTimeString = castTime + " Cast"
            break;
    }

    if (castTime === "N/A" || castTime === "")
    {
        switch (useOrCast)
        {
            case "toggle":
                castTimeString = "Toggled"
                break;

            case "held":
                castTimeString = "Held"
                break;

            case "channel":
                castTimeString = "Channeled"
                break;

            default:
                castTimeString = ""
                break;
        }
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