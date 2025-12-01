// src/theme.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    fonts: {
        heading: "'Oswald', sans-serif", // Tall, bold font (Industrial)
        body: "'Inter', sans-serif",     // Clean tech font
    },
    styles: {
        global: {
            body: {
                bg: '#050505', // Not pure black, but "Carbon" black
                color: 'gray.100',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: '0px', // SHARP CORNERS (The CYC look)
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
            },
            variants: {
                solid: {
                    bg: '#E53E3E',
                    color: 'white',
                    _hover: { bg: '#F56565' },
                },
                outline: {
                    border: '1px solid',
                    borderColor: 'gray.600',
                    _hover: { bg: 'whiteAlpha.100', borderColor: 'white' },
                },
            },
        },
        Input: {
            baseStyle: {
                field: {
                    borderRadius: '0px', // Sharp inputs
                    borderBottom: '2px solid', // Underline style instead of box
                    borderTop: '0',
                    borderLeft: '0',
                    borderRight: '0',
                    bg: 'transparent',
                    _focus: {
                        borderColor: '#E53E3E', // Red glow on focus
                        boxShadow: 'none',
                    },
                },
            },
            defaultProps: { variant: 'flushed' }, // "Flushed" means underline style
        },
        Select: {
            baseStyle: {
                field: {
                    borderRadius: '0px',
                    borderBottom: '2px solid',
                    bg: 'transparent',
                },
            },
            defaultProps: { variant: 'flushed' },
        },
        Alert: {
            baseStyle: {
                container: {
                    borderRadius: '0px', // Sharp alerts
                },
            },
        },
    },
});

export default theme;