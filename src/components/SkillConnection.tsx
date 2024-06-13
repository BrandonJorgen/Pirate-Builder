import './SkillConnection.css'

interface SkillConnectionProps
{
    index: number,
    isMulti: string,
    //useArrow: string, // "0" or "1" LEAVING THIS FOR FUTURE DEVELOPMENT
    styleLeft: string,
    styleTop: string,
    styleWidth: string,
    styleRotation: string,
}

export default function SkillConnection({ index, isMulti, styleLeft, styleTop, styleWidth, styleRotation }: SkillConnectionProps)
{
    const ConnectionStyle = {
        left: styleLeft,
        top: styleTop,
        width: styleWidth,
        height: 8,
        transform: "rotate(" + styleRotation + "deg)"
    }

    return(
            <div className="skill-connection" data-index={index} data-multi={isMulti} data-multi-count={0} style={ConnectionStyle} data-active="0" />
        )
}