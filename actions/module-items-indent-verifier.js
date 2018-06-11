/****************************************************************************
 * Module Items Indent Verifier
 * Description: Set the module items to be indented properly. If they come 
 * after a SubHeader, indent them one space.
 ****************************************************************************/
var moduleId = ''; // The id of the last module item's parent module
var subHeadIndent = null; // The indent value of the last SubHeader

module.exports = (course, moduleItem, callback) => {
    try {




        /* If the item is marked for deletion, do nothing */
        if (moduleItem.techops.delete === true) {
            callback(null, course, moduleItem);
            return;
        }

        /* Once you reach a new module's module items, reset the indent
        value to null and set moduleId to the new module's ID */
        if (moduleItem.techops.parentModule.id !== moduleId) {
            moduleId = moduleItem.techops.parentModule.id;
            subHeadIndent = null;
        }

        /* If the module item is a subheader, save its indent value and indent 
        every module item that comes after it one more than the subheader itself */
        if (moduleItem.type === 'SubHeader') {
            subHeadIndent = moduleItem.indent;
            callback(null, course, moduleItem);
            return;
        }


        /* This is the action that happens if the test is passed */
        function action() {
            /* Indent the module item one more space than the SubHeader that came before it.
            If subHeadIndent is set to null, then there has not been a subHeader in the module yet
            and the module items should not be indented */
            if (subHeadIndent === null) {
                moduleItem.indent = 0;
            } else {
                moduleItem.indent = subHeadIndent + 1;
            }
            moduleItem.techops.log(`${moduleItem.techops.type} - Indent Changed`, {
                'Title': moduleItem.title,
                'ID': moduleItem.id,
                'Indent Amount': moduleItem.indent
            });
            callback(null, course, moduleItem);
        }

        /* The test returns TRUE or FALSE - action() is called if true */
        if (moduleItem.type !== 'SubHeader') {
            action();
        } else {
            callback(null, course, moduleItem);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, moduleItem);
    }
};

module.exports.details = {
    title: 'module-items-indent-verifier'
}