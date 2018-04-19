function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function mock(errors) {
    const indicies = {};
    const constraints = {};
    const records = {};
    const api = {};
    // constraint
    api['constraint.add'] = ({documentType, items}) => {
        if (constraints[documentType]) {
            throw errors['crypto.resourceAlreadyExists']({params: {
                resourceType: 'constraint'
            }});
        }
        constraints[documentType] = items;
        return {documentType, items};
    };
    api['constraint.get'] = ({documentType}) => {
        let items = constraints[documentType];
        if (items) {
            return {documentType, items};
        }
        throw errors['crypto.resourceNotFound']({params: {
            resourceType: 'constraint'
        }});
    };
    api['constraint.list'] = () => {
        return Object.keys(constraints).map(documentType => {
            return {
                documentType,
                items: constraints[documentType]
            };
        });
    };
    api['constraint.update'] = ({documentType, items}) => {
        if (!constraints[documentType]) {
            throw errors['crypto.resourceNotFound']({params: {
                resourceType: 'constraint'
            }});
        }
        constraints[documentType] = items;
        return {documentType, items};
    };
    // health
    api['health.check'] = () => {
        return {};
    };
    // index
    api['index.add'] = ({documentType, items}) => {
        if (indicies[documentType]) {
            throw errors['crypto.resourceAlreadyExists']({params: {
                resourceType: 'index'
            }});
        }
        indicies[documentType] = items;
        return {documentType, items};
    };
    api['index.get'] = ({documentType}) => {
        let items = indicies[documentType];
        if (items) {
            return {documentType, items};
        }
        throw errors['crypto.resourceNotFound']({params: {
            resourceType: 'index'
        }});
    };
    api['index.getModes'] = () => {
        return {
            'left': 'Left mode tokenizes the input from an edge into n-grams of given size(the length of the input string). Example: Input string: Johnatan Doe Result: \'Joh\', \'John\', \'John \', \'John D\', \'John Do\', \'John Doe\'',
            'split_left': 'Split left mode is the same as Left mode with the only difference - the input string is split by space before tokenization. Then n-grams are generated from each single word. Example: Input string: Johnatan Doe Result: \'Joh\', \'John\', \'Doe\'',
            'exact': 'Exact mode will return the exact value(no transformation). Example: Input string: Johnatan Doe Result: \'Johnatan Doe\'',
            'split_full': 'Split full mode works the same way as full mode with the only difference - the input string is split by space before tokenization. Then n-grams are generated from each single word.Example: Input string: Johnatan Doe Result: \'Joh\', \'John\', \'ohn\', \'Doe\'',
            'full': 'Full mode will create a collection of n-grams with minimum length of 3 and maximum equal to the length of the input string. Note this is the most complex pattern and the size of output index will become higher. Example: Input string: Johnatan Doe Result: \'Joh\', \'John\', \'John \', \'John D\', \'John Do\', \'John Doe\', \'ohn\', \'ohn \', \'ohn D\', \'ohn Do\', \'ohn Doe\', \'hn \', \'hn D\', \'hn Do\', \'hn Doe\', \'n D\', \'n Do\', \'n Doe\', \' Do\', \' Doe\', \'Doe\''
        };
    };
    api['index.list'] = () => {
        return Object.keys(indicies).map(documentType => {
            return {
                documentType,
                items: indicies[documentType]
            };
        });
    };
    api['index.update'] = ({documentType, items}) => {
        if (!indicies[documentType]) {
            throw errors['crypto.resourceNotFound']({params: {
                resourceType: 'index'
            }});
        }
        indicies[documentType] = items;
        return {documentType, items};
    };
    // record
    api['record.add'] = ({type, data}) => {
        let id = guid();
        let createdOn = Date.now();
        records[id] = {
            id,
            type,
            data,
            createdOn
        };
        return {
            id,
            type,
            createdOn
        };
    };
    api['record.fetch'] = (criteria = {}) => {
        if (!criteria.documentType) {
            throw new Error('Document type is required when searching for records');
        }
        const documentTypes = {};
        for (let key of [].concat(criteria.documentType)) {
            if (!indicies[key]) {
                throw new Error(`Unknown document type ${key}`);
            }
            documentTypes[key] = true;
        }
        delete criteria.documentTypes;
        const result = [];

        for (let id in records) {
            let document = records[id];
            if (documentTypes[document.type]) {
                let matched = false;
                for (let key in criteria) {
                    let index = indicies[document.type][key];
                    let data = Object.assign({}, document.data);
                    for (let token of index.path.split('.')) {
                        data = data[token];
                        if (!data) {
                            break;
                        }
                    }
                    if (index && data) {
                        if (index.type === 'string') {
                            if (Array.isArray(data)) {
                                if (data.find(record => {
                                    let field = record[index.field];
                                    return typeof field === 'string' && field.indexOf(criteria[key]) !== -1;
                                })) {
                                    matched = true;
                                } else {
                                    matched = false;
                                    break;
                                }
                            } else if (typeof data === 'object') {
                                let field = data[index.field];
                                if (typeof field === 'string' && field.indexOf(criteria[key]) !== -1) {
                                    matched = true;
                                } else {
                                    matched = false;
                                    break;
                                }
                            }
                        } else if (index.type === 'number') {
                            // to do
                        } else if (index.type === 'date') {
                            // to do
                        }
                    }
                };
                if (matched) {
                    result.push(document.data);
                }
            }
        }
        return result;
    };
    api['record.get'] = ({id}) => {
        if (!records[id]) {
            throw errors['crypto.resourceNotFound']({params: {
                resourceType: 'record'
            }});
        }
        return records[id];
    };
    api['record.update'] = ({id, data}) => {
        if (!records[id]) {
            throw errors['crypto.resourceNotFound']({params: {
                resourceType: 'record'
            }});
        }
        records[id].data = data;
        records[id].updatedOn = Date.now();
        return records[id];
    };

    return api;
}

module.exports = mock;
