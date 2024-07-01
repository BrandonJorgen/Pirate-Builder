import './SkillConnection.css'

interface SkillConnectionProps
{
    index: number,
    connectionType: number, // 0 = normal, 1 = multi-path, 2 = multi-requirement
    //useArrow: string, // "0" or "1" LEAVING THIS FOR FUTURE DEVELOPMENT
    styleLeft: string,
    styleTop: string,
    styleWidth: string,
    styleRotation: string,
}

export default function SkillConnection({ index, connectionType, styleLeft, styleTop, styleWidth, styleRotation }: SkillConnectionProps)
{
    const ConnectionStyle = {
        left: styleLeft,
        top: styleTop,
        width: styleWidth,
        height: 8,
        transform: "rotate(" + styleRotation + "deg)"
    }

    return(
            <div className="skill-connection" data-index={index} data-connection-type={connectionType} data-multi-count={0} style={ConnectionStyle} data-active="0" />
        )
}