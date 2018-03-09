module.exports = (course, moduleItem, callback) => {

    if (moduleItem.techops.delete == true) {
        callback(null, course, moduleItem);
        return;
    }

    /* Potential matches in LOWER case */
    var itemsToReorder = [{
        itemKeyWord: /lesson\s*\d*\s*notes/i,
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