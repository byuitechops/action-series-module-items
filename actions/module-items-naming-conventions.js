module.exports = (course, item, callback) => {

    /************************************************************************************
     * Find the week number for each module item from its parent module's title. If the 
     * week number is only one digit long, append a zero to the beginning of the number.
     ************************************************************************************/
    function getWeekNum() {
        var weekNum = '';
        var moduleName = item.techops.parentModule.name;
        /* Get each word in the module title */
        var modTitleArray = moduleName.split(' ');

        /* Get the week number from the module title */
        /* Add 0 to week number if not present */
        modTitleArray.forEach((currWord, index) => {
            /* If the current word follows this convention: L14, W01, L2, W9, etc */
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

            /* Add 0 to the beginning of the number if weekNum is a single digit */
            if (weekNum.length === 1) {
                weekNum = weekNum.replace(/^/, '0');
            }
        });

        return weekNum;
    }

    /*******************************************************************
     * Check for already existing prefixes in each module item's title.
     * If one exists, delete it before creating a new one in modifyModuleItemTitle().
     * Ex: L1, W02, Lesson 03, Week 4 
     *******************************************************************/
    function checkForPrefix() {
        /* Get each word in the module item title */
        var itemTitleArray = item.title.split(' ');

        /* Check for already existing prefixes in the module item titles */
        itemTitleArray.forEach((currWord, index) => {
            /* Get rid of L02, W14:, L3, W4 etc. */
            if (/(L|W)(1[0-4]|0?\d)(\D|$)/gi.test(currWord)) {
                itemTitleArray.splice(index, 1);
            } else if (/week|lesson/gi.test(currWord)) {
                /* Get rid of the word 'week' or 'lesson' and the next word (hopefully a number) */
                itemTitleArray.splice(index, 2);
            }
        });

        /* Return the modified title, joining the array on each whitespace */
        return itemTitleArray.join(' ');
    }

    /*********************************************************
     * This is the function that happens if the test is passed 
     *********************************************************/
    function modifyModuleItemTitle() {
        var logCategory = `${item.techops.type} - Naming Conventions Added`;
        var weekNum = getWeekNum();
        var modifiedTitle = checkForPrefix();
        var oldTitle = item.title;
        var newTitle = `W${weekNum} ${item.type}: ${modifiedTitle}`;

        /* If the item title matches one of the items in the specialItems array, then name it differently */
        if (found) {
            newTitle = `W${weekNum} ${item.title}`;
        }

        /* If we're running a standards check and not doing any changes... */
        if (course.info.checkStandard === true) {
            logCategory = `${item.techops.type} - Add Naming Conventions`;
        } else {
            item.title = newTitle;
        }

        item.techops.log(logCategory, {
            'Old Title': oldTitle,
            'New Title': newTitle,
            'ID': item.id,
        });

        callback(null, course, item);
    }

    /**************************************************************
     *                      Start Here                            * 
     **************************************************************/
    /* If the item is marked for deletion, or if it already matches the naming convention, do nothing */
    if (item.techops.delete === true) {
        callback(null, course, item);
        return;
    }

    /* items with specific naming conventions, in LOWER case */
    var specialItems = [
        /lesson\s*notes/gi, // W[##] Lesson Notes  (Do NOT Publish)
        /notes\s*from\s*instructor/gi, // W[##] Notes from Instructor
    ];

    /* TRUE if the item is in a weekly module, FALSE otherwise - modifyModuleItemTitle() is called if true*/
    var weeklyModule = /(Week|Lesson|L|W)\s*(1[0-4]|0?\d(\D|$))/gi.test(item.techops.parentModule.name);

    /* If the item title matches one of the items in the specialItems array, then it has a special naming convention */
    var found = specialItems.find(special => special.test(item.title));

    /* if the item is in a weekly module, call modifyModuleItemTitle() */
    if (weeklyModule) {
        modifyModuleItemTitle();
    } else {
        callback(null, course, item);
    }
};