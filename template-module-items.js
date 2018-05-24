/* Dependencies */
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

/* Actions */
var actions = [
    require('./actions/module-items-position.js'),
    require('./actions/module-items-external-urls.js'),
    require('./actions/module-items-delete.js'),
    require('./actions/module-items-publish-settings.js'),
    require('./actions/module-items-naming-conventions.js'),
    require('./actions/module-items-indent-verifier.js'),
];

class TechOps {
    constructor(parentModule) {
        this.getHTML = getHTML;
        this.setHTML = setHTML;
        this.getPosition = getPosition;
        this.setPosition = setPosition;
        this.getTitle = getTitle;
        this.setTitle = setTitle;
        this.getID = getID;
        this.logs = [];
        this.delete = false;
        this.type = 'Module Item';
        this.parentModule = parentModule;
    }

    log(title, details) {
        this.logs.push({ title, details });
    }

    message(message) {
        this.logs.push({ title: 'message', details: { message: message }});
    }

    warning(warning) {
        this.logs.push({ title: 'warning', details: { warning: warning }});
    }

    error(error) {
        this.logs.push({ error: error });
    }
}

/* Retrieve all items of the type */
function getItems(course, callback) {
    var moduleItems = [];
    var moduleList = [];

    /* Get the module items for a module */
    function getModuleItems(module, eachCallback) {
        canvas.getModuleItems(course.info.canvasOU, module.id, (eachErr, items) => {
            if (eachErr) {
                course.error(eachErr);
                eachCallback(null);
                return;
            }
            /* Add on the module items to our growing list */
            moduleItems = moduleItems.concat(items);
            eachCallback(null);
        });
    }

    /* Get all of the modules */
    canvas.getModules(course.info.canvasOU, (err, modules) => {
        if (err) {
            callback(err);
            return;
        }

        moduleList = modules;

        /* For each module, get the module items */
        asyncLib.each(modules, getModuleItems, (err) => {
            if (err) {
                course.error(err);
            }

            /* Give each item the TechOps helper class */
            moduleItems.forEach(item => {
                var parentModule = moduleList.find(mod => {
                    return mod.id === item.module_id;
                });
                item.techops = new TechOps(parentModule);
            });

            callback(null, moduleItems);
        });
    });
}

/* Build the PUT object for an item */
function buildPutObj(item) {
    return {
        'module_item[title]': item.title,
        'module_item[position]': item.position,
        'module_item[indent]': item.indent,
        'module_item[external_url]': item.external_url,
        'module_item[new_tab]': item.new_tab,
        'module_item[published]': item.published,
        'module_item[module_id]': item.module_id,
        'module_item[completion_requirement]': item.completion_requirement,
    };
}

function deleteItem(course, moduleItem, callback) {
    canvas.delete(`/api/v1/courses/${course.info.canvasOU}/modules/${moduleItem.module_id}/items/${moduleItem.id}`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, null);
    });
}

/* PUT an item back into Canvas with updates */
function putItem(course, moduleItem, callback) {
    if (moduleItem.techops.delete === true) {
        deleteItem(course, moduleItem, callback);
        return;
    }
    var putObj = buildPutObj(moduleItem);
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/modules/${moduleItem.module_id}/items/${moduleItem.id}`, putObj, (err, newItem) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, newItem);
    });
}

function getHTML(item) {
    return null;
}

function setHTML(item, newHTML) {
    return null;
}

function getTitle(item) {
    return item.title;
}

function setTitle(item, newTitle) {
    item.title = newTitle;
}

function getPosition(item) {
    return item.position;
}

function setPosition(item, newPosition) {
    item.position = newPosition;
}

function getID(item) {
    return item.id;
}

module.exports = {
    prefix: 'module-items',
    actions: actions,
    getItems: getItems,
    putItem: putItem,
};