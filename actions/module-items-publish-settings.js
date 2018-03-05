module.exports = (course, moduleItem, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (moduleItem.techops.delete == true) {
        callback(null, course, moduleItem);
        return;
    }

    /* moduleItems to be renamed, in LOWER case */
    var actionItems = [{
        reg: /(lesson|week)\s*\d*?\s*notes?/gi,
        setting: false
    }];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = actionItems.find(item => item.reg.test(moduleItem.title));

    /* This is the action that happens if the test is passed */
    function action() {
        var oldSetting = moduleItem.published;
        moduleItem.published = found.setting;
        course.log('Module Items - Publish Settings', {
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