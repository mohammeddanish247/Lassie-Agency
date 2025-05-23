// constants/Colors.ts
const tintColorLight = '#5B94E2'; // Primary blue
const tintColorDark = '#5B94E2';  // Same primary in dark mode

export const Colors = {
  light: {
    // Core
    background: '#F5F9FF',       // New light blue background
    text: '#222222',             // High-contrast text
    textSecondary: '#5E5E5E',  
    white : '#fff',   // Secondary text (gray)
    
    // Primary/Secondary
    primary: '#5B94E2',          // Brand blue
    primaryLight: '#E1EDFC',     // Light blue (pressed states)
    secondary: '#FFFFFF',        // White surfaces (cards)
    secondaryDark: '#EAEDF2',    // 
    
    // Cards & Surfaces
    card: '#FFFFFF',             // Pure white cards
    cardElevated: '#F0F4FF',     // Subtle blue tint (elevated)
    cardBorder: '#D6E0FF',       // Soft blue border
    
    // UI Elements
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#D6E0FF',           // Blue-tinged borders
    separator: '#E6EDFF',        // Light blue dividers
    
    // States
    success: '#4CAF50',          // Green
    error: '#F44336',            // Red
    warning: '#FF9800',          // Orange
    disabled: '#f5f5f5',  
    disabledText: '#7d7d7d',        // Disabled gray
    
    // Tints
    tint: tintColorLight,
    tintBackground: '#E6F0FF',   // Lighter blue for accents
  },
  dark: {

     // Core
     background: '#F5F9FF',       // New light blue background
     text: '#222222',             // High-contrast text
     textSecondary: '#5E5E5E',  
     white : '#fff',   // Secondary text (gray)
     
     // Primary/Secondary
     primary: '#5B94E2',          // Brand blue
     primaryLight: '#E1EDFC',     // Light blue (pressed states)
     secondary: '#FFFFFF',        // White surfaces (cards)
     secondaryDark: '#EAEDF2',    // 
     
     // Cards & Surfaces
     card: '#FFFFFF',             // Pure white cards
     cardElevated: '#F0F4FF',     // Subtle blue tint (elevated)
     cardBorder: '#D6E0FF',       // Soft blue border
     
     // UI Elements
     icon: '#687076',
     tabIconDefault: '#687076',
     tabIconSelected: tintColorLight,
     border: '#D6E0FF',           // Blue-tinged borders
     separator: '#E6EDFF',        // Light blue dividers
     
     // States
     success: '#4CAF50',          // Green
     error: '#F44336',            // Red
     warning: '#FF9800',          // Orange
     disabled: '#f5f5f5',  
     disabledText: '#7d7d7d',     // Disabled gray
     
     // Tints
     tint: tintColorLight,
     tintBackground: '#E6F0FF',   // Lighter blue for accents


    // // DARK theme Tempororaly disabled
    // background: '#212121',       // New dark background
    // text: '#F5F5F5',             // Primary text (white)
    // textSecondary: '#A0A0A0',     // Secondary text (gray)
    // white : '#fff', 
    
    // // Primary/Secondary
    // primary: '#5B94E2',          // Brand blue
    // primaryLight: '#1E2C3D',     // Dark blue (pressed states)
    // secondary: '#303030',        // Dark surfaces (cards)
    // secondaryDark: '#2A2A2A',    // Borders/separators
    
    // // Cards & Surfaces
    // card: '#303030',             // Slightly lighter than bg
    // cardElevated: '#2A2A2A',     // Elevated cards
    // cardBorder: '#333333',       // Dark gray borders
    
    // // UI Elements
    // icon: '#9BA1A6',
    // tabIconDefault: '#9BA1A6',
    // tabIconSelected: tintColorDark,
    // border: '#333333',           // General borders
    // separator: '#2A2A2A',        // Dividers
    
    // // States
    // success: '#66BB6A',          // Light green
    // error: '#EF5350',            // Light red
    // warning: '#FFA726',          // Light orange
    // disabled: '#4A4A4A',         // Disabled state
    
    // // Tints
    // tint: tintColorDark,
    // tintBackground: '#0F1A2A',   // Very dark blue accents
  },
}