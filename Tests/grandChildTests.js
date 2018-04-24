/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, callback) => {
    tap.test('action-series-', (test) => {
        function _delete() {
            return;
        }

        /* An array of functions for each associated action in action-series- */
        var myFunctions = [
            _delete,
        ];

        /* Run each universal grandchilds' test in its own function, one at a time */
        asyncLib.eachSeries(myFunctions, (eachSeriesErr) => {
            if (eachSeriesErr) {
                course.error(eachSeriesErr);
            }
            test.end();
        });
    });

    callback(null, course);
};