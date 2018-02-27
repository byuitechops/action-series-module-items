module.exports = (course, item, callback) => {

    /* If the item is marked for deletion, or if it already matches the naming convention, do nothing */
    if (item.techops.delete === true) {
        callback(null, course, item);
        return;
    }

    /* items with specific naming conventions, in LOWER case */
    var specificItems = [{
        name: /lesson\s*notes/gi,   // W[##] Lesson Notes  (Do NOT Publish)
    }, {
        name: /notes\s*from\s*instructor/gi,    // W[##] Notes from Instructor
    }];

    /* TRUE if the item is in a weekly module, FALSE otherwise */
    var weeklyModule = /(Week|Lesson|L|W)\s*(1[0-4]|0?\d(\D|$))/gi.test(item.techops.parentModule.name);

    console.log(`item title: ${item.title}`);
    console.log(`module title: ${item.techops.parentModule.name}`);
    console.log(`weeklyModule: ${weeklyModule}`);
    /* The test returns TRUE or FALSE - action() is called if true */
    // var matchedSpecific = specificItems.find(modItem => modItem.name.test(item.title));

    /* This is the action that happens if the test is passed */
    function action() {
        var weekNum = '';
        var oldName = item.title;
        // var itemName = item.title;
        var moduleName = item.techops.parentModule.name;
        /* Get each word in the title */
        var titleArray = moduleName.split(' ');

        /* Get the week number */
        /* Add 0 to week number if not present */
        titleArray.forEach((currWord, index) => {
            if (/(L|W)(1[0-4]|0?\d)(\D|$)/gi.test(currWord)) {
                var eachChar = moduleName.split('');
                eachChar.forEach(theChar => {
                    if (!isNaN(theChar) && theChar !== ' ') {
                        weekNum += theChar;
                    }
                });

            } else if (/week/gi.test(currWord) || /lesson/gi.test(currWord)) {
                /* Replace each non-digit with nothing */
                weekNum = titleArray[index + 1].replace(/\D+/g, '');
            }
            if (weekNum.length === 1) {
                /* Add 0 to the beginning of the number if single digit */
                weekNum = weekNum.replace(/^/, '0');
            }
        });

        item.title = `W${weekNum}: ${oldName}`;
        
        console.log('weekNum: ' + weekNum);
        course.log(`${item.techops.type} - Naming Conventions`, {
            'Old Title': oldName,
            'New Title': item.title,
            'ID': item.id
        });
        callback(null, course, item);
    }

    /* if the item is in a weekly module, call action() */
    if (!weeklyModule) {
        action();
    } else {
        callback(null, course, item);
    }

};