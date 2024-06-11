import SkillButton from './SkillButton'
import './SkillTree.css'

function SkillTree()
{
    let skillButtons: HTMLCollectionOf<Element>

    setTimeout(() => {

    skillButtons = document.getElementsByClassName("skill-button")

    //console.log(pressedButtons)
    }, 100)
    

    function handleClick(index:number, connectedButtons: number[])
    {
        UpdateConnections(index, connectedButtons)
    }

    function UpdateConnections(index: number, connectedButtons: number[])
    {
        //Button is pressed
        if (skillButtons[index].getAttribute("data-selected") === "1")
        {
            // Enable connected buttons
            if (connectedButtons.length > 0)
            {
                //Loop through the connected buttons array and enabled every button
                for (let i = 0; i < connectedButtons.length; i++)
                {
                    if (skillButtons[connectedButtons[i]] === undefined)
                        return

                    skillButtons[connectedButtons[i]].setAttribute("data-disabled", "0")

                    //Multipath button type increment connecting count
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "1")
                        {
                            if (skillButtons[connectedButtons[i]].getAttribute("data-connection-count") != null) 
                            {
                                // convert the connection count attribute to a number
                                let tempNumber = Number(skillButtons[connectedButtons[i]].getAttribute("data-connection-count"))
    
                                // -- the variable
                                tempNumber++
    
                                // convert the variable back into a string and set the attribute
                                skillButtons[connectedButtons[i]].setAttribute("data-connection-count", tempNumber.toString())
                            }
                        }
                }
            }
        }
        //Button isn't pressed
        else
        {
            // Disable and Deselect connected buttons
            if (connectedButtons.length > 0)
            {
                //This exists to fix an issue of skill buttons not having a connecting button (usually represented with "") but causing an infinite loop
                if(skillButtons[index].getAttribute("data-connected-buttons") === "")
                    return

                //Loop through the connected buttons array and enabled every button
                for (let i = 0; i < connectedButtons.length; i++)
                {
                    if (skillButtons[connectedButtons[i]] === undefined)
                        return

                    //Basic button type disable and deselect
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "0") 
                    {
                        skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                        skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                    }

                    //Multipath button type disable and deselect
                    if (skillButtons[connectedButtons[i]].getAttribute("data-button-type") === "1")
                    {
                        if (skillButtons[connectedButtons[i]].getAttribute("data-connection-count") != null) 
                        {
                            // convert the connection count attribute to a number
                            let tempNumber = Number(skillButtons[connectedButtons[i]].getAttribute("data-connection-count"))

                            // -- the variable
                            tempNumber--

                            if (tempNumber < 0)
                                tempNumber = 0

                            // convert the variable back into a string and set the attribute
                            skillButtons[connectedButtons[i]].setAttribute("data-connection-count", tempNumber.toString())

                            // check if the "connection count" is 0, if so then deselect and disable the button
                            if (tempNumber <= 0)
                            {
                                skillButtons[connectedButtons[i]].setAttribute("data-selected", "0")
                                skillButtons[connectedButtons[i]].setAttribute("data-disabled", "1")
                            }
                        }
                    }

                    //then call the same function with the data of those connected buttons
                    //The data-connected-buttons array comes through as a single string, we need to covert it to a number array
                    //this is the array of connected buttons that are attached to our connected button
                    let connectedArray = skillButtons[connectedButtons[i]].getAttribute("data-connected-buttons")?.split(',').map(Number)

                    if (connectedArray != undefined) {
                        UpdateConnections(connectedButtons[i], connectedArray)
                    }    
                }
            }
        }
    }

    return(
    <div className='skill-tree'>
        <SkillButton index={0} positionRow={'9'} positionColumn={'6'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LethalBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 2, 10]} handleClick={handleClick}  />
        <SkillButton index={1} positionRow={'10'} positionColumn={'5'} buttonType={1} icon={'src/assets/icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={2} positionRow={'10'} positionColumn={'7'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LethalBlow_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={3} positionRow={'8'} positionColumn={'5'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Blitz_Icon.png'} startsDisabled={"0"} connectedButtons={[1, 4, 5]} handleClick={handleClick}  />
        <SkillButton index={4} positionRow={'9'} positionColumn={'3'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/RagingBlitz_icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={5} positionRow={'8'} positionColumn={'1'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LungingAssault_Icon.png'} startsDisabled={"1"} connectedButtons={[6, 7]} handleClick={handleClick}  />
        <SkillButton index={6} positionRow={'9'} positionColumn={'1'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LungingAssault_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={7} positionRow={'5'} positionColumn={'1'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/LeapStrike_Icon.png'} startsDisabled={"1"} connectedButtons={[8]} handleClick={handleClick}  />
        <SkillButton index={8} positionRow={'4'} positionColumn={'1'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofCelerity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 29]} handleClick={handleClick}  />
        <SkillButton index={9} positionRow={'3'} positionColumn={'6'} buttonType={1} icon={'src/assets/icons/skill_Icons/Fighter/ArtofWar_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={10} positionRow={'7'} positionColumn={'6'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/BrutalCleave_Icon.png'} startsDisabled={"1"} connectedButtons={[11, 12, 18]} handleClick={handleClick}  />
        <SkillButton index={11} positionRow={'7'} positionColumn={'2'} buttonType={0} icon={'src/assets/Placeholder_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={12} positionRow={'6'} positionColumn={'3'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Whirlwind_Icon.png'} startsDisabled={"1"} connectedButtons={[13, 14, 15]} handleClick={handleClick}  />
        <SkillButton index={13} positionRow={'6'} positionColumn={'2'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={14} positionRow={'6'} positionColumn={'4'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Whirlwind_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={15} positionRow={'5'} positionColumn={'3'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Exert_Icon.png'} startsDisabled={"1"} connectedButtons={[16, 17, 28]} handleClick={handleClick}  />
        <SkillButton index={16} positionRow={'5'} positionColumn={'2'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={17} positionRow={'5'} positionColumn={'4'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Exert_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={18} positionRow={'6'} positionColumn={'9'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Maim_Icon.png'} startsDisabled={"1"} connectedButtons={[19, 20, 23]} handleClick={handleClick}  />
        <SkillButton index={19} positionRow={'6'} positionColumn={'8'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Maim_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={20} positionRow={'6'} positionColumn={'10'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[21, 22]} handleClick={handleClick}  />
        <SkillButton index={21} positionRow={'7'} positionColumn={'10'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Brutality_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={22} positionRow={'5'} positionColumn={'10'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/BloodFusion_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={23} positionRow={'5'} positionColumn={'9'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/Rupture_Icon.png'} startsDisabled={"1"} connectedButtons={[28]} handleClick={handleClick}  />
        <SkillButton index={24} positionRow={'8'} positionColumn={'7'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/CripplingBlow_Icon.png'} startsDisabled={"0"} connectedButtons={[25]} handleClick={handleClick}  />
        <SkillButton index={25} positionRow={'8'} positionColumn={'11'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/KnockOut_Icon.png'} startsDisabled={"1"} connectedButtons={[26]} handleClick={handleClick}  />
        <SkillButton index={26} positionRow={'6'} positionColumn={'11'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/BattleCry_Icon.png'} startsDisabled={"1"} connectedButtons={[27]} handleClick={handleClick}  />
        <SkillButton index={27} positionRow={'4'} positionColumn={'11'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofFluidity_Icon.png'} startsDisabled={"1"} connectedButtons={[9, 30]} handleClick={handleClick}  />
        <SkillButton index={28} positionRow={'4'} positionColumn={'6'} buttonType={1} icon={'src/assets/icons/skill_Icons/Fighter/Cataclysm_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={29} positionRow={'4'} positionColumn={'2'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofCelerity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
        <SkillButton index={30} positionRow={'4'} positionColumn={'10'} buttonType={0} icon={'src/assets/icons/skill_Icons/Fighter/FormofFluidity_Round_Icon.png'} startsDisabled={"1"} connectedButtons={[]} handleClick={handleClick}  />
    </div>
    )
}

export default SkillTree