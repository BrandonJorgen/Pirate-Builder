import { useContext } from 'react'
import { archetypeSkillPointCount } from './ArchetypeSkillTree'
import { weaponSkillPointCount } from './WeaponSkillTree'
import'./SkillPointTracker.css'

interface SkillPointTrackerProps
{
    id: string,
    parentName: string,
    maxPoints: number,
}

export default function SkillPointTracker({ id, parentName, maxPoints }: SkillPointTrackerProps)
{

    if (parentName === "Archetype")
    {
        const context = useContext(archetypeSkillPointCount)

        return(
        <div className="skill-point-tracker" id={id} data-maxed-out="0">
            <div className='skill-point-tracker-bg' />
            <div className='skill-point-tracker-text'>Skill Points: {context} / {maxPoints}</div>
        </div>
        )
    }

    if (parentName === "Weapon")
    {
        const context = useContext(weaponSkillPointCount)

        return(
        <div className="skill-point-tracker" id={id} data-maxed-out={context}>
            <div className='skill-point-tracker-bg' />
            <div className='skill-point-tracker-text'>Skill Points: {context} / {maxPoints}</div>
        </div>
        )
    }
}