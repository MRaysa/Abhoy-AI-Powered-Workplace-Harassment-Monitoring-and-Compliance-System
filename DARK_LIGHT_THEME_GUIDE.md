# 🌓 Dark/Light Theme Implementation Guide

## ✅ What's Been Implemented

### 1. **Theme Context Created**
**File:** `src/contexts/ThemeContext.jsx`

Features:
- ✅ Theme state management (light/dark/system)
- ✅ LocalStorage persistence
- ✅ Automatic theme switching
- ✅ Custom hook: `useTheme()`

### 2. **App Wrapped with ThemeProvider**
**File:** `src/App.jsx`

The entire app is now wrapped with ThemeProvider to enable theme throughout the application.

### 3. **Navbar Updated with Theme Support**
**File:** `src/components/Navbar/Navbar.jsx`

Features Added:
- ✅ Dynamic background color (light/dark)
- ✅ Theme-aware hover states
- ✅ Working theme toggle buttons in dropdown:
  - 🌞 Light Mode button
  - 🌙 Dark Mode button
  - 💻 System Theme button (follows OS preference)
- ✅ Active theme button highlighted in indigo

### 4. **Tailwind Config Created**
**File:** `tailwind.config.js`

Configured with `darkMode: 'class'` for class-based dark mode switching.

---

## 🎨 How to Use

### For Users:
1. Click on your profile picture in the navbar
2. Scroll down to the "Theme Toggle" section
3. Click one of three buttons:
   - **☀️ Sun Icon** - Light theme
   - **🌙 Moon Icon** - Dark theme  
   - **💻 Desktop Icon** - System theme (auto)

### For Developers:
Use the `useTheme` hook in any component:

```jsx
import { useTheme } from '../../contexts/ThemeContext';

const MyComponent = () => {
  const { isDark, theme, setLightTheme, setDarkTheme, toggleTheme } = useTheme();

  return (
    <div className={isDark ? 'bg-[#1a2332] text-white' : 'bg-white text-gray-900'}>
      Current theme: {theme}
    </div>
  );
};
```

---

## 🎨 Theme Colors

### Dark Theme:
- **Background**: `#0f1824` (darkest)
- **Cards/Panels**: `#1a2332` (dark blue)
- **Borders**: `#2d3748` (medium gray-blue)
- **Hover**: `#2d3748`
- **Text**: `white` / `gray-400`

### Light Theme:
- **Background**: `gradient-to-br from-gray-50 to-gray-100`
- **Cards/Panels**: `white`
- **Borders**: `border-transparent`
- **Hover**: `hover:border-indigo-300`
- **Text**: `gray-800` / `gray-600`

---

## 📋 Components That Need Theme Support

To add dark mode to other components, follow this pattern:

### Step 1: Import useTheme
```jsx
import { useTheme } from '../../contexts/ThemeContext';
```

### Step 2: Get isDark
```jsx
const { isDark } = useTheme();
```

### Step 3: Apply Conditional Classes
```jsx
<div className={`${isDark ? 'bg-[#1a2332] text-white' : 'bg-white text-gray-900'} p-4`}>
  Content
</div>
```

---

## 🔧 Components to Update

### ✅ Already Updated:
- [x] Navbar (with dropdown)
- [x] Employee Home page (partial)

### 📝 Need Updates:
- [ ] PublicForum.jsx
- [ ] AnonymousComplaint.jsx  
- [ ] TrackComplaint.jsx
- [ ] Admin pages
- [ ] Settings pages
- [ ] Footer
- [ ] Sidebar

---

## 🚀 Quick Implementation for Other Pages

### Example: PublicForum.jsx

```jsx
import { useTheme } from '../../contexts/ThemeContext';

const PublicForum = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0f1824]' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-[#1a2332]' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h1 className={isDark ? 'text-white' : 'text-gray-800'}>Public Forum</h1>
      </div>

      {/* Post Cards */}
      <div className={`${isDark ? 'bg-[#1a2332] border-[#2d3748]' : 'bg-white'} rounded-xl shadow-lg p-6 mt-4`}>
        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Post content...</p>
      </div>
    </div>
  );
};
```

---

## 🎯 Theme Persistence

The theme is automatically:
- ✅ Saved to `localStorage`
- ✅ Restored on page reload
- ✅ Applied to `<html>` element with `.dark` class

---

## 🔍 Testing

1. **Open the app** at `http://localhost:5174/`
2. **Login** as any user
3. **Click profile picture** in navbar
4. **Click theme buttons** and watch:
   - Background colors change
   - Text colors adapt
   - Card colors transition
   - Theme persists on refresh

---

## 📱 System Theme

The "System" button (💻) will:
- Detect your OS theme preference
- Apply dark mode if OS is in dark mode
- Apply light mode if OS is in light mode
- Automatically sync with OS theme changes

---

## ✨ Next Steps

To complete full dark mode support:

1. **Update all pages** to use `useTheme` hook
2. **Add theme classes** to all major components
3. **Test each page** in both themes
4. **Ensure readability** in both modes
5. **Check all hover states** work in both themes

---

## 🎨 Color Reference

### Dark Theme Classes:
```css
bg-[#0f1824]    /* Page background */
bg-[#1a2332]    /* Card background */
bg-[#2d3748]    /* Hover/borders */
text-white      /* Primary text */
text-gray-400   /* Secondary text */
```

### Light Theme Classes:
```css
bg-gray-50      /* Page background */
bg-white        /* Card background */
text-gray-800   /* Primary text */
text-gray-600   /* Secondary text */
```

---

**Status:** ✅ Theme system is functional and ready to use!

**Try it now:** Click your profile → Theme Toggle section → Switch themes! 🌓
