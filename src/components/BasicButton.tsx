import './BasicButton.css'

interface BasicButtonProps
{
    index: number,
    id: string,
    icon: string,
    tooltipSortClass: string,
    tooltipSide: string,
    tooltipText: string,
    handleClick: (event: any) => void,
}

export default function BasicButton({ index, id, icon, tooltipSortClass, tooltipSide = "top", tooltipText, handleClick }:BasicButtonProps)
{
    let tooltip: HTMLCollectionOf<Element>

    setTimeout(() => {

        tooltip = document.getElementsByClassName(tooltipSortClass + "-tooltip")

    }, 100)

    function click()
    {
        tooltip[index].setAttribute("data-show", "0")
        handleClick(event)
    }

    function onHover()
    {
        tooltip[index].setAttribute("data-show", "1")
    }

    function onHoverLeave()
    {
        tooltip[index].setAttribute("data-show", "0")
    }

    return(
        <div className="basic-button">
            <img className='basic-button-icon' id={id} data-disabled="0" onClick={click} onMouseOver={onHover} onMouseLeave={onHoverLeave} src={icon} alt={tooltipText}/>
            <div className={tooltipSortClass + "-tooltip tooltip"} id={index.toString()} data-show="0" data-side={tooltipSide}>
                <span className={tooltipSortClass + '-tooltip-title'}>{tooltipText}</span>
            </div>
        </div>
    )
}