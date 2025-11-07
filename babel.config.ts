module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        'react-native-reanimated/plugin',
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    "@": "./",
                    "@components": "./src/components",
                    "@utils": "./src/utils",
                    "@screens": "./src/screens",
                    "@styles": "./src/styles",
                    "@types": "./src/types",
                    "@constants": "./src/constants",
                }
            },
        ],
    ]
}