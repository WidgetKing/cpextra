module.exports = {
    "env": {
        "browser": true,
        "es6": true,
		"jasmine": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
		"_extra":"readonly",
		"unitTests":"readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
    }
};
