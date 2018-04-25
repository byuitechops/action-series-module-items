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
                /^about\s*content$/gi,
                /^about\s*discussions$/gi,
                /^discussion\s*forums$/gi,
                /^about\s*assignments$/gi,
                /^about\s*quiz(zes)?$/gi,
                /^about\s*grades?$/gi,
                /^about\s*user\s*progress?$/gi,
                /^conclusion?$/gi,
                /course\s*maintenance\s*log/gi,
                /course\s*search\s*tool/gi,
                /weekly\s*patterns?\s*(and|&)\s*expectations?\s*/gi,
                /course\s*outline/gi,
            ];
        } else {
            doomedItems = [
                /guidelines\s*for\s*button/gi,
                /course\s*maintenance\s*request/gi,
                /copyright\s*permission/gi,
                /copyediting\s*style\s*sheet/gi,
                /discussion\sforums/gi,
                /how\s*to\s*understand\s*due\s*date(s)*/gi,
                /^schedule$/gi,
                /course\s*schedule\d*\D*archived/gi,
                /course\s*maintenance\s*log/gi,
                /course\s*search\s*tool/gi,
                /weekly\s*patterns?\s*(and|&)\s*expectations?\s*/gi,
                /course\s*outline/gi,
            ];
        }

        /* The test returns TRUE or FALSE - action() is called if true */
        var found = doomedItems.find(item => item.test(moduleItem.title));

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

        if (found != undefined) {
            action();
        } else {
            callback(null, course, moduleItem);
        }
    } catch (e) {
        course.error(e);
        callback(null, course, moduleItem);
    }
};