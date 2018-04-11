/****************************************************************************
 * Module Items Position
 * Description: To help standardize the module items in Canvas, this module
 * will set the position/ order of specific module items. So if the course is
 * an online course, it will put the Lesson Notes as the first item in its
 * module and will set the Notes from Instructor discussion topic as the 
 * second item in each module, so as to keep the ordering consistent
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

    /* Potential matches in LOWER case */
    var itemsToReorder = [{
        itemKeyWord: /\d*\s*lesson\s*\d*\s*notes/i,
        position: 1
    }, {
        itemKeyWord: /notes\s*from\s*instructor/i,
        position: 2
    }];

    /* If the item's title contains one of the keywords, then we need to change its position. 
     * If the find function doesn't find anything, we know there isn't a match. */
    var item = itemsToReorder.find(item => item.itemKeyWord.test(moduleItem.title) && !moduleItem.title.toLowerCase().includes('general'));

    /* This is the action that happens if the test is passed */
    function action() {
        moduleItem.position = item.position;
        moduleItem.techops.log('Module Item - Position Changed', {
            'Title': moduleItem.title,
            'ID': moduleItem.id,
            'Position': moduleItem.position
        });
        callback(null, course, moduleItem);
    }

    /* The test returns TRUE or FALSE - action() is called if true */
    if (item != undefined) {
        action();
    } else {
        callback(null, course, moduleItem);
    }

};