module.exports = (course, moduleItem, callback) => {

    /* Pages to be deleted, in LOWER case */
    var doomedItems = [
        /guidelines\s*for\s*button/gi,
        /course\s*search\s*tool/gi,
        /course\s*maintenance\s*request/gi,
        /copyright\s*permission/gi,
        /copyediting\s*style\s*sheet/gi,
        /discussion\sforums/gi,
    ];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = doomedItems.find(item => item.test(moduleItem.title));

    /* This is the action that happens if the test is passed */
    function action() {
        moduleItem.techops.delete = true;
        course.log('Module Items Deleted', {
            'Title': moduleItem.title,
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