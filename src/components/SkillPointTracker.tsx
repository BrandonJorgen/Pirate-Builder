import { useContext } from 'react'
import { skillPointCount } from './SkillTree'
import'./SkillPointTracker.css'

interface SkillPointTrackerProps
{
    id: string,
    maxPoints: number,
}

export default function SkillPointTracker({ id, maxPoints }: SkillPointTrackerProps)
{
    const context = useContext(skillPointCount)

    return(
        <div className="skill-point-tracker" id={id}>
            <p>Skill Points: {context} / {maxPoints}</p>
        </div>
    )
}