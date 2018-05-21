/******************************************************************************
 * Module Items Delete
 * Description: Create an array of module item titles and set their delete 
 * attribute on the TechOps class to true. If the delete attribute is set to 
 * true, the module item will be deleted in action-series-master main.js 
 ******************************************************************************/
module.exports = (course, moduleItem, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway', 'campus'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (moduleItem.techops.delete === true || validPlatform !== true) {
            callback(null, course, moduleItem);
            return;
        }

        /* Pages to be deleted, in LOWER case */
        var doomedItems = [];
        if (course.settings.platform === 'campus') {
            doomedItems = [
                /^about\s*content$/i,
                /^about\s*discussions$/i,
                /^discussion\s*forums$/i,
                /^about\s*assignments$/i,
                /^about\s*quiz(zes)?$/i,
                /^about\s*grades?$/i,
                /^about\s*user\s*progress?$/i,
                /^conclusion?$/i,
                /course\s*maintenance\s*log/i,
                /course\s*search\s*tool/i,
                /weekly\s*patterns?\s*(and|&)\s*expectations?\s*/i,
                /course\s*outline/i,
            ];
        } else {
            doomedItems = [
                /guidelines\s*for\s*button/i,
                /course\s*maintenance\s*request/i,
                /copyright\s*permission/i,
                /copyediting\s*style\s*sheet/i,
                /discussion\sforums/i,
                /how\s*to\s*understand\s*due\s*date(s)*/i,
                /^schedule$/i,
                /course\s*schedule\d*\D*archived/i,
                /course\s*maintenance\s*log/i,
                /course\s*search\s*tool/i,
                /weekly\s*patterns?\s*(and|&)\s*expectations?\s*/i,
                /course\s*outline/i,
                /course\s*schedule/i,
                /syllabus(?!\s*quiz)(?!\s*discussion)(?!\s*activity)/i,
                /setup\snotes\s&\scourse/i,
                /(mid)\s*\D?\s*(course|semester)\s*(feedback)/i,
            ];
        }

        /* A list of all valid headers in the modules Instructor Resources and Student Resources */
        var standardHeaders = [
            /standard\s*resources/i,
            /supplemental\s*resources/i,
        ];

        /* Check if the item is a standard header in Instructor Resources or Student Resources. Delete it otherwise. */
        var instructorResources = /instructor\s*resources?/i.test(moduleItem.techops.parentModule.name);
        var studentResources = /^\s*student\s*resources?/i.test(moduleItem.techops.parentModule.name);
        var standardHeader = standardHeaders.find(header => header.test(moduleItem.title));

        /* The test returns TRUE or FALSE - action() is called if true */
        if (moduleItem.type === 'SubHeader' && standardHeader === undefined && (instructorResources || studentResources)) {
            var found = true;
        } else {
            var found = doomedItems.find(item => item.test(moduleItem.title));
        }

        /* This is the action that happens if the test is passed */
        function action() {
            var logCategory = 'Module Item - Deleted';

            /* If we're running a standards check and not doing any changes... */
            if (course.info.checkStandard === true) {
                logCategory = 'Module Item - Deprecated';
            } else {
                moduleItem.techops.delete = true;
            }

            moduleItem.techops.log(logCategory, {
                'Title': moduleItem.title,
                'ID': moduleItem.id
            });
            callback(null, course, moduleItem);
        }

        /* Test */
        if (found != undefined) {
            action();
        } else {
            callback(null, course, moduleItem);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, moduleItem);
    }
};