function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function mock() {
    const indicies = {};
    const constraints = {};
    const documents = {};
    const api = {};
    // constraint
    api['constraint.add'] = () => {
        return {};
    };
    api['constraint.get'] = () => {
        return {};
    };
    api['constraint.list'] = () => {
        return {};
    };
    api['constraint.update'] = () => {
        return {};
    };
    // health
    api['health.check'] = () => {
        return {};
    };
    // index
    api['index.add'] = ({documentType, items}) => {
        if (indicies[documentType]) {
            throw new Error('Index already exists');
        }
        indicies[documentType] = items;
        return items;
    };
    api['index.get'] = ({documentType}) => {
        return indicies[documentType] || [];
    };
    api['index.update'] = ({documentType, items}) => {
        if (!indicies[documentType]) {
            throw new Error('Can\'t update non-existing index');
        }
        indicies[documentType] = items;
        return items;
    };
    api['record.add'] = ({type, data}) => {
        documents[guid()] = {
            type,
            data
        };
        return data;
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
        const records = [];

        for (let id in documents) {
            let document = documents[id];
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
                    records.push(document.data);
                }
            }
        }
        return records;
    };
    // record
    api['record.get'] = ({id}) => {
        return documents[id];
    };
    api['record.update'] = ({id, data}) => {
        if (!documents[id]) {
            throw new Error('Can\'t update non-existing record');
        }
        documents[id] = data;
        return data;
    };

    return api;
}

module.exports = mock;
