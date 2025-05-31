import './BuildMenu.css'
import BasicButton from "./BasicButton";

export default function BuildMenu()
{
    // A Text field to name builds?
    // Two buttons, import and export

    // Export
    // (After the user presses the Export button)
    // 1. Grab the selected archetype, if it's the default name then throw error/disable button
    // 2. Grab the memory array for the tree
    // 3. Grab the selected weapons for each tab, if the tab doesn't have a selected weapon, skip it
    // 4. Grab the memory array for each tree, if the tree doesn't have any skills selected, skip it
    // 5. Display each of these variables in a highlightable text box for the user to copy
    // EXAMPLE:
    // "Fighter"
    // [1, 0, 0, 1, 0, ...]
    // "Greatsword"
    // [1, 1, 1, 1, 0, ...]

    // Import
    // (After the user presses the Import button)
    // 1. A text input field reveals
    // 2. The user pastes an export code
    // 3. The user presses the confirm button on the menu
    // 4. The system decodes the string and changes the tabs names and the tree's memory
    // 5. The text input field then closes and the user can proceed with using the builder

    return(
        <div className="build-menu">
            <BasicButton index={0} id={""} icon={""} tooltipSortClass={""} tooltipSide={""} tooltipText={""} handleClick={function (event: any): void {
            throw new Error("Function not implemented.");
        } } />
            <BasicButton index={1} id={""} icon={""} tooltipSortClass={""} tooltipSide={""} tooltipText={""} handleClick={function (event: any): void {
                throw new Error("Function not implemented.");
            } } />
        </div>
    )
}