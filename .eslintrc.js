module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "shared-node-browser": true,
        "amd": true
    },
    "parser": "babel-eslint",
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaversion": 8,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,

        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-unused-vars": [
          "warn"
        ],
        "strict": [
          2,
          "never"
        ],
        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "react/react-in-jsx-scope": 2
    }
};
