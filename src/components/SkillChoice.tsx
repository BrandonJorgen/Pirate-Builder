import Tooltip from "./Tooltip";

interface SkillChoiceProps
{
    icon: string,
    name: string,
    description: string,
}

export default function SkillChoice({ icon, name, description }: SkillChoiceProps)
{
    // NEEDS
    // Icon
    // Title Text
    // Description

    return(
        <div className="skill-choice">
            <img src={icon} alt="Icon" data-row="0" data-column="1"/>
            <span data-row="1" data-column="2">{name}</span>
            <span data-row="2" data-column="2">{description}</span>
            <Tooltip sortClass={"skill-choice"} index={0} side={""} type={0} title={""} Cost={""} range={""} cooldown={""} useOrCast={""} castTime={""} resource={""} description={""} />
        </div>
    )
}