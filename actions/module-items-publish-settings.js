/****************************************************************************
 * Module Items Publish Settings
 * Description: Certain module items need to be set to 'published' and others
 * need to be set to not be 'published'. This module will set the module item
 * to published/ not published if it is specified in the actionItems array
 ****************************************************************************/
var canvas = require('canvas-wrapper');

module.exports = (course, moduleItem, callback) => {
    try {


        /*************************************************
         * A function to unpublish files 
         *************************************************/
        function unpublishFile() {
            /* Get the fileId from the moduleItem url attribute (i.e. 1025654 from https://byui.instructure.com/api/v1/courses/12018/files/1025654" */
            var fileId = moduleItem.url.split('/');
            fileId = fileId.slice(-1);
            fileId = fileId.join('');
            /* Get the file, then change its 'locked' attribute to 'true' */
            canvas.get(`/api/v1/files/${fileId}`, (err, file) => {
                if (err) {
                    course.error(new Error(err));
                    callback(null, course, moduleItem);
                    return;
                }
                var oldLocked = file.locked;
                canvas.put(`/api/v1/files/${fileId}`, {
                    'locked': true
                }, (err) => {
                    if (err) {
                        course.error(new Error(err));
                    }
                    moduleItem.techops.log('Module Item - Publish Settings', {
                        'Title': moduleItem.title,
                        'ID': moduleItem.id,
                        'Type': moduleItem.type,
                        'Locked Before': oldLocked,
                        'Locked After': moduleItem.locked,
                    });
                    callback(null, course, moduleItem);
                    return;
                });
            });
        }

        /***********************************************************
         * This is the action that happens if the test is passed 
         ***********************************************************/
        function action() {
            var oldSetting = moduleItem.published;
            moduleItem.published = found.setting;
            moduleItem.techops.log('Module Item - Publish Settings', {
                'Title': moduleItem.title,
                'ID': moduleItem.id,
                'Before': oldSetting,
                'After': moduleItem.published,
                'Type': moduleItem.type,
            });
            callback(null, course, moduleItem);
        }

        /***************************************************************************
         *                             START HERE
         * If the item is in Instructor Resources and is a file, unpublish it here.
         * Also, run the tests to see if action() or unpublishFile() should run. 
         ***************************************************************************/
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (moduleItem.techops.delete === true || validPlatform !== true) {
            callback(null, course, moduleItem);
            return;
        }

        /* moduleItems to be published, in LOWER case */
        var actionItems = [{
            reg: /\d*?\s*(teaching|lesson|week)\s*\d*?\s*notes?/gi,
            setting: false
        }];

        /* The test returns TRUE or FALSE - action() is called if true */
        var found = actionItems.find(item => item.reg.test(moduleItem.title));
        if (/instructor\s*resources?/i.test(moduleItem.techops.parentModule.name)) {
            /* Module Items that are files must be unpublished in their own put requests */
            if (moduleItem.type === 'File') {
                unpublishFile();
            } else {
                /* Unpublish all items in Instructor Resources Module */
                found = {
                    setting: false
                };
                action();
            }
        } else if (found != undefined) {
            action();
        } else {
            callback(null, course, moduleItem);
        }

    } catch (e) {
        course.error(new Error(e));
        callback(null, course, moduleItem);
    }
};