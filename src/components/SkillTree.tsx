import SkillButton from './SkillButton'

function SkillTree()
{
    //array of all the skillbuttons in this skill tree
    let skillButtonArray = document.querySelectorAll(".skill-button") //document.getElementsByClassName("skill-button")

    //array that tracks what buttons are pressed
    let pressedArray: number[] = []

    console.log(skillButtonArray)

    for (let i = 0; i < skillButtonArray.length; i++)
        {
            pressedArray.push(0)
            //console.log(pressedArray[i])
        }

    //function that takes in an index number and a state number (0 = false, 1 = true)
    //This is to determine the state of the button and the state is stored here rather than on the button
    const UpdatePressed = (index: number, bool: number) =>{
        pressedArray[index] = bool
        //console.log(array)
    }

    console.log(pressedArray)

    return(
    <div className='skill-tree'>
        <SkillButton  index={0} icon="src\assets\Placeholder_Icon.png" isDisabled={false} isSelected={"false"} updatePressed={UpdatePressed} />
        <SkillButton  index={1} icon="src\assets\Placeholder_Icon.png" isDisabled={false} isSelected={"false"} updatePressed={UpdatePressed}/>
        <SkillButton  index={2} icon="src\assets\Placeholder_Icon.png" isDisabled={true} isSelected={"false"} updatePressed={UpdatePressed}/>
        <SkillButton  index={3} icon="src\assets\Placeholder_Icon.png" isDisabled={false} isSelected={"false"} updatePressed={UpdatePressed}/>
        <SkillButton  index={4} icon="src\assets\Placeholder_Icon.png" isDisabled={false} isSelected={"false"} updatePressed={UpdatePressed}/>
    </div>
    )
}

export default SkillTree