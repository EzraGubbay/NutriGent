import { ThemeType } from "@types";

const palette = {
    white: '#FFFFFF',
    black: '#000000',
    transparentBlack: 'rgba(0, 0, 0, 0.5)',
    offWhite: 'rgb(242, 242, 247)', // iOS System Gray 6 (Light)
    lightGreen: '#66BB6A',
    faintGreen: '#E8F5E9',
    darkGreen: '#388E3C',
    gray: '#555555',
    darkGray: '#333333',
    lightGray: '#dddddd',
    ultraFaintGray: '#eeeeee',
    devilGray: '#666666',

    // --- Dark Theme Additions ---
    // Level 0: The main background (User provided)
    backgroundGray: 'rgb(28, 28, 30)', 
    // Level 1: iOS System Gray 5 (For Cards/Modals) - Lighter than background
    cardGray: 'rgb(44, 44, 46)',     
    // Separators: iOS System Gray 3 (Dark variant)
    separatorDark: 'rgb(58, 58, 60)', 
    // Text: Softer white for long reading
    softWhite: 'rgb(229, 229, 234)',  
    // Utilities
    transparent: 'transparent',
    // Semi-transparent green for footer background
    transparentGreen: 'rgb(102,187,106, 0.15)'
};

export const lightTheme: ThemeType = {
    globalBackground: palette.offWhite,
    background: palette.white,
    headerBottomBorder: palette.ultraFaintGray,
    cardBorder: palette.faintGreen,
    crosshair: palette.lightGreen,
    shadow: palette.black,
    label: palette.darkGray,
    sublabel: palette.devilGray,
    modalShadow: palette.transparentBlack,
    footerBackground: palette.faintGreen,
    footerText: palette.gray,
    minusBorder: palette.lightGray,
    minusText: palette.gray,
    plusBackground: palette.darkGreen,
    filler: palette.darkGreen,
    separator: palette.lightGray,
    inputField: palette.lightGray,
    buttonBorder: palette.black,
};

export const darkTheme: ThemeType = {
    // 1. Elevation Rule: Background is dark, Cards are lighter
    globalBackground: palette.backgroundGray,
    background: palette.cardGray,

    // 2. Border Rule: Hide borders or make them very subtle in Dark Mode
    headerBottomBorder: palette.separatorDark,
    cardBorder: palette.transparent, // iOS prefers elevation (color diff) over borders in dark mode

    // 3. Desaturation Rule: Use lighter green for better contrast on dark
    crosshair: palette.lightGreen, 
    plusBackground: palette.lightGreen, 
    filler: palette.lightGreen,

    // 4. Shadow Rule: Shadows don't exist on dark backgrounds
    shadow: palette.transparent,
    modalShadow: palette.transparentBlack, // Keep backdrop dark

    // 5. Text Rule: Invert to white/softWhite
    label: palette.softWhite,
    sublabel: palette.lightGray, // Use lightGray instead of devilGray for contrast
    
    // 6. Context Rule: 'faintGreen' is too bright for dark mode footers
    footerBackground: palette.transparentGreen, // palette.backgroundGray, // Fallback to Level 0 to distinguish from Level 1 Card
    footerText: palette.lightGray,

    // Controls
    minusBorder: palette.transparent,
    minusText: palette.softWhite,
    separator: palette.separatorDark,
    inputField: palette.separatorDark, // Dark inputs are usually just a border or slightly lighter fill
    buttonBorder: palette.transparent,
};