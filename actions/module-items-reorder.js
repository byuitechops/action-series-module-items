module.exports = (course, moduleItem, callback) => {

    if (moduleItem.techops.delete == true) {
        callback(null, course, moduleItem);
        return;
    }

    /* Potential matches in LOWER case */
    var itemsToReorder = [{
        itemKeyWord: 'lesson notes',
        position: 1
    }, {
        itemKeyWord: 'notes from instructor',
        position: 2
    }];

    /* If the item's title contains one of the keywords, then we need to change its position. 
     * If the find function doesn't find anything, we know there isn't a match. */
    var item = itemsToReorder.find(item => moduleItem.title.toLowerCase().includes(item.itemKeyWord));

    /* This is the action that happens if the test is passed */
    function action() {
        moduleItem.position = item.position;

        course.log('Module Item Positions Set', {
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