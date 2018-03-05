module.exports = (course, item, callback) => {

    /* If the item is marked for deletion, or if it already matches the naming convention, do nothing */
    if (item.techops.delete === true) {
        callback(null, course, item);
        return;
    }

    /* items with specific naming conventions, in LOWER case */
    var specialItems = [{
        name: /lesson\s*notes/gi, // W[##] Lesson Notes  (Do NOT Publish)
    }, {
        name: /notes\s*from\s*instructor/gi, // W[##] Notes from Instructor
    }];

    /* TRUE if the item is in a weekly module, FALSE otherwise - action() is called if true*/
    var weeklyModule = /(Week|Lesson|L|W)\s*(1[0-4]|0?\d(\D|$))/gi.test(item.techops.parentModule.name);

    /* This is the action that happens if the test is passed */
    function action() {
        /* If it is a special item, rename it a special way */
        if (specialItems.includes(item.name)) {
            item.title = `W${weekNum} ${item.name}`;
        } else {
            var weekNum = '';
            var oldName = item.title;
            var moduleName = item.techops.parentModule.name;
            /* Get each word in the module title and module item title */
            var modTitleArray = moduleName.split(' ');
            var itemTitleArray = item.title.split(' ');

            /* Get the week number from the module title*/
            /* Add 0 to week number if not present */
            modTitleArray.forEach((currWord, index) => {
                /* If the current word follows this convention: L14, W01, L2, W9, etc*/
                if (/(L|W)(1[0-4]|0?\d)(\D|$)/gi.test(currWord)) {
                    /* Spit the current word into a character array */
                    var eachChar = moduleName.split('');
                    eachChar.forEach(theChar => {
                        /* If the character is a number, append it to weekNum */
                        if (!isNaN(theChar) && theChar !== ' ') {
                            weekNum += theChar;
                        }
                    });
                    /* If the current word is 'week' or 'lesson' */
                } else if (/week|lesson/gi.test(currWord)) {
                    /* Replace each non-digit in the title with nothing */
                    /* index + 1 because the week number normally follows the word 'week' or 'lesson' */
                    weekNum = modTitleArray[index + 1].replace(/\D+/g, '');
                }
                if (weekNum.length === 1) {
                    /* Add 0 to the beginning of the number if single digit */
                    weekNum = weekNum.replace(/^/, '0');
                }
            });

            /* Check for already existing prefixes in the module item titles */
            itemTitleArray.forEach((currWord, index) => {
                if (/(L|W)(1[0-4]|0?\d)(\D|$)/gi.test(currWord)) {
                    /* Get rid of L02, W14:, L3, W4 etc. */
                    itemTitleArray.splice(index, 1);

                } else if (/week|lesson/gi.test(currWord)) {
                    /* Get rid of the word 'week' or 'lesson' and the next word (hopefully a number) */
                    itemTitleArray.splice(index, 2);
                }
            });

            /* Make the title array into one string, each element being separated by a blank space */
            modifiedTitle = itemTitleArray.join(' ');
            item.title = `W${weekNum} ${item.type}: ${modifiedTitle}`;
        }
        course.log(`${item.techops.type} - Naming Conventions`, {
            'Old Title': oldName,
            'New Title': item.title,
            'ID': item.id
        });
        callback(null, course, item);
    }

    /* if the item is in a weekly module, call action() */
    if (weeklyModule || specialItems.includes(item.name)) {
        action();
    } else {
        callback(null, course, item);
    }
};