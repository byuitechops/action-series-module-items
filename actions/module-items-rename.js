module.exports = (course, moduleItem, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (moduleItem.techops.delete == true) {
        callback(null, course, moduleItem);
        return;
    }

    /* moduleItems to be renamed, in LOWER case */
    var moduleItemsToRename = [{
        oldTitle: /setup\s*notes\s*for\s*development\s*team/gi,
        newTitle: '-Setup Notes & Course Settings'
    }, {
        oldTitle: /library\s*research\s*guide/gi,
        newTitle: 'Library Research Guides'
    }, {
        oldTitle: /copyright\s*(and|&)\s*source\s*/gi,
        newTitle: 'Copyright & Source Information'
    }, {
        oldTitle: /course\s*map/gi,
        newTitle: 'Design Workbook'
    }];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = moduleItemsToRename.find(item => item.oldTitle.test(moduleItem.title));

    /* This is the action that happens if the test is passed */
    function action() {
        var oldTitle = moduleItem.title;
        moduleItem.title = found.newTitle;
        course.log('Renamed Modules', {
            'Old Title': oldTitle,
            'New Title': moduleItem.title,
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