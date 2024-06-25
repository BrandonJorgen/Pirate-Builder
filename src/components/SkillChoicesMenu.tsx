import { useRef, useState } from 'react'
import SkillChoice from './SkillChoice'
import './SkillChoicesMenu.css'

interface SkillChoicesMenuProps
{
    buttonIndex: number,
    side: string, // Mostly Bottom or Top, will need Bottom-Left/Right and Top-Left/Right
    choices: string[][],
    choiceDataReturn: (id:number, data: string[]) => void,
}

export default function SkillChoicesMenu({ buttonIndex, side = "bottom", choices, choiceDataReturn }: SkillChoicesMenuProps)
{

    let [ choicesArray, setChoicesArray ] = useState<string[][]>(choices)

    let show = "0"

    function handleChoiceClick(event: any)
    {
        let choiceID = event.target.id

        for (let i = 0; i < choices.length; i++)
        {

            if (i.toString() === choiceID)
            {
                // Send this information back up to the skill button
                choiceDataReturn(Number(choiceID), choices[i])
                show = "0"
                break
            }
        }
    }

    if (choices !== undefined) {
        return(
            <div className="skill-choice-menu" data-show={show} data-side={side}>
                
                <div className='skill-choices' data-choice-amount={choices.length}>
                    {choicesArray.map((choice, i) => (<SkillChoice key={i} index={i} buttonIndex={buttonIndex} icon={choices[i][0]} name={choices[i][1]} description={choices[i][2]} clickFunction={handleChoiceClick} tooltipSide={choices[i][3]} tooltipName={choices[i][1]} tooltipCost={choices[i][4]} tooltipRange={choices[i][5]} tooltipCooldown={choices[i][6]} tooltipUseOrCast={choices[i][7]} tooltipCastTime={choices[i][8]} tooltipResource={choices[i][9]} tooltipDescription={choices[i][10]}  />))}
                </div>
                
            </div>
        )
    }
}