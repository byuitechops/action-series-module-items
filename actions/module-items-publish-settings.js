/****************************************************************************
 * Module Items Publish Settings
 * Description: Certain module items need to be set to 'published' and others
 * need to be set to not be 'published'. This module will set the module item
 * to published/ not published if it is specified in the actionItems array
 ****************************************************************************/
module.exports = (course, moduleItem, callback) => {
    //only add the platforms your grandchild should run in
    var validPlatforms = ['online', 'pathway'];
    var validPlatform = validPlatforms.includes(course.settings.platform);

    /* If the item is marked for deletion or isn't a valid platform type, do nothing */
    if (moduleItem.techops.delete === true || validPlatform !== true) {
        callback(null, course, moduleItem);
        return;
    }

    /* moduleItems to be published, in LOWER case */
    var actionItems = [{
        reg: /\d*?\s*(lesson|week)\s*\d*?\s*notes?/gi,
        setting: false
    }];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = actionItems.find(item => item.reg.test(moduleItem.title));

    /* This is the action that happens if the test is passed */
    function action() {
        var oldSetting = moduleItem.published;
        moduleItem.published = found.setting;
        moduleItem.techops.log('Module Item - Publish Settings', {
            'Title': moduleItem.title,
            'Before': oldSetting,
            'After': moduleItem.published,
            'ID': moduleItem.id
        });
        callback(null, course, moduleItem);
    }

    if (found != undefined) {
        action();
    } else {
        callback(null, course, moduleItem);
    }
};