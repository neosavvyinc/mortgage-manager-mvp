exports.passwordJSONSchema = {
    'id': '/Password',
    'type': 'string',
    'pattern': '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#~$%^&]).{8,50}$'
};

exports.phoneJSONSchema = {
    'id': '/Phone',
    'type': 'string',
    'pattern': '^(([\+])?[0-9]([[\-]|\.|\ ])?)?[\(]?[0-9]{3}([\)|\.|[\-]|\ ])?[0-9]{3}([\.|[\-]|\ ])?[0-9]{4}$'
};

exports.emailJSONSchema = {
    'id': '/Email',
    'type': 'string',
    'pattern': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'
};

exports.userJSONSchema = {
    'id': '/User',
    'type': 'object',
    'properties': {
        '_id': {
            'type': 'string'
        },
        'email': {
            'type': 'string',
            'pattern': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'
        },
        'password': {
            'type': 'string',
            'pattern': '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#~$%^&]).{8,50}$'
        },
        'type': {
            'type': 'string'
        }

    }
};