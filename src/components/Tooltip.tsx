export default function Tooltip()
{
    // The intent is for this to appear on hover over certain elements
    // It needs to have a specific minimum size and then scale based on the content

    // The ideal structure for abilities:
    /*
        Ability Name
        Mana  | Cooldown
        Range | Cast time

        Description

    */

    return(
        <div className="tooltip" data-show="0">
            <span className="tooltip-title">Name</span>
            <span>Mana</span>
            <span>Range</span>
            <span>Description Text</span>
        </div>
    )
}