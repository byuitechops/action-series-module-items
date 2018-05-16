/****************************************************************************
 * Module Items Requirements
 * Description: To help standardize the module items in Canvas, this module
 * will set the requirements of the module items, according to their type.
 * 
 * Pages and links - Requirement will be to "View item"
 * Discussions - Requirement will be to "Contribute"
 * Quizzes and Assignments - Requirement will be to "Submit"
 ****************************************************************************/
var canvas = require('canvas-wrapper');

module.exports = (course, moduleItem, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (moduleItem.techops.delete === true || validPlatform !== true) {
            callback(null, course, moduleItem);
            return;
        }

        /* Potential matches in LOWER case */
        var typeRequirements = [{
            checkType: 'ExternalUrl',
            requirement: 'must_view',
        }, {
            checkType: 'File',
            requirement: 'must_view',
        }, {
            checkType: 'Page',
            requirement: 'must_view',
        }, {
            checkType: 'Discussion',
            requirement: 'must_contribute',
        }, {
            checkType: 'Assignment',
            requirement: 'must_submit',
        }, {
            checkType: 'Quiz',
            requirement: 'must_submit',
        }];

        /* If the module item type is the same as one in the typeRequirments object array, return the match */
        var requirementObj = typeRequirements.find(typeRequirement => typeRequirement.checkType === moduleItem.type);

        /* This is the action that happens if the test is passed */
        function action() {
            moduleItem.completion_requirement = { type: requirementObj.requirement };
            console.log(moduleItem.title);
            console.log(moduleItem.type);
            console.log(`requirementObj: ${JSON.stringify(requirementObj)}`);
            console.log(`moduleItem.completion_requirement.type: ${moduleItem.completion_requirement.type}\n`)
            moduleItem.techops.log(`${moduleItem.techops.type} - Requirements Set`, {
                'Title': moduleItem.title,
                'ID': moduleItem.id,
                'Requirement': moduleItem.completion_requirement.type,
            });
            callback(null, course, moduleItem);
        }

        /* The test returns TRUE or FALSE - action() is called if true */
        if (/(Week|Lesson|L|W)\s*(\d*(\D|$))/gi.test(moduleItem.techops.parentModule.name) && requirementObj !== undefined) {
            action();
        } else {
            callback(null, course, moduleItem);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, moduleItem);
    }
};