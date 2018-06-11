module.exports = (course, moduleItem, callback) => {
    try {




        /* Potential matches in LOWER case */
        var urlsToChange = [{
            title: /University\s*Polic/i,
            newUrl: 'https://content.byui.edu/integ/gen/d24f576f-d34b-47be-a466-d00bd4792fb6/0/universitypolicies.html'
        }, {
            title: /online\s*support\s*center/i,
            newUrl: 'https://content.byui.edu/integ/gen/8872d2b2-91d5-4953-a357-3097ef2aa5d0/0/?.vi=file&attachment.uuid=e509c91c-e500-4d6d-9a20-b8ff1b0186f9'
        }, {
            title: /library\s*research\s*guide/i,
            newUrl: 'https://content.byui.edu/integ/gen/8872d2b2-91d5-4953-a357-3097ef2aa5d0/0/?.vi=file&attachment.uuid=3b1239c4-a857-431b-b633-94d3fdbe396e'
        }, {
            title: /academic\s*support\s*center/i,
            newUrl: 'https://content.byui.edu/integ/gen/8872d2b2-91d5-4953-a357-3097ef2aa5d0/0/?.vi=file&attachment.uuid=91d9ec86-03ef-4c49-805f-65d488a1085c'
        }, {
            title: /copyright\s*(and|&)\s*source\s*/i,
            newUrl: 'https://docs.google.com/a/byui.edu/spreadsheets/d/156Y7L6XbeWHpNvK4h1oVpAOTAr141IonyKT_qLeSUZg/edit?usp=sharing'
        }, {
            title: /teaching\s*group\s*directory/i,
            newUrl: 'https://content.byui.edu/integ/gen/8872d2b2-91d5-4953-a357-3097ef2aa5d0/0/?.vi=file&attachment.uuid=3ad2dddf-7d44-4b54-8441-5fba4186758b'
        }, {
            title: /online\s*instructor\s*community/i,
            newUrl: 'https://content.byui.edu/integ/gen/8872d2b2-91d5-4953-a357-3097ef2aa5d0/0/?.vi=file&attachment.uuid=fc735ad6-708a-413d-b14d-90e18e1aaf45'
        }, {
            title: /course\s*map|design\s*workbook/i,
            newUrl: course.info.designWorkbookURL
        }];

        /* If the item's title contains one of the keywords, then we need to change its position. 
         * If the find function doesn't find anything, we know there isn't a match. */

        var item = urlsToChange.find(item => item.title.test(moduleItem.title));

        /* This is the action that happens if the test is passed */
        function action() {
            var logCategory = 'Module Item - External URLs Set';

            /* If we're running a standards check and not doing any changes... */
            if (course.info.checkStandard === true) {
                logCategory = 'Module Item - External URLs to Set';
            } else {
                moduleItem.external_url = item.newUrl;
                moduleItem.new_tab = true;
            }

            moduleItem.techops.log(logCategory, {
                'Title': moduleItem.title,
                'ID': moduleItem.id,
                'New URL': item.newUrl,
            });

            callback(null, course, moduleItem);
        }

        /* The test returns TRUE or FALSE - action() is called if true */
        if (item === undefined || moduleItem.techops.delete === true) {
            callback(null, course, moduleItem);
        } else {
            action();
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, moduleItem);
    }
};

module.exports.details = {
    title: 'module-items-external-urls'
}