# BMW CAR DEALERSHIP - THEME SYSTEM

## **TỔNG QUAN**

Hệ thống theme hoàn chỉnh với 5 themes và khả năng tùy chỉnh màu sắc. Tất cả components đã được clean không có inline styles.

## **CẤU TRÚC**

```
src/
├── types/theme.ts              # Theme type definitions
├── styles/
│   ├── themes.ts              # 5 preset themes
│   ├── theme-variables.scss   # CSS custom properties
│   ├── theme-global.scss      # High specificity overrides
│   └── main.scss              # Import theme-global.scss cuối cùng
├── contexts/ThemeContext.tsx   # Theme management
├── utils/theme.ts             # Utility functions
└── components/ThemeController.tsx # Admin-only theme controls
```

## **THEMES**

1. **SiVi CAR** - `#059669` (Default)
2. **BMW Classic** - `#0066b1`
3. **Luxury** - `#8b5a3c`
4. **Sport** - `#c41e3a`
5. **Elegant** - `#4c516d`

## **CURRENT STATUS**

### ✅ **Working**

- Header: Sticky với blur effect, auth bar hide on scroll
- Footer: Gradient background với theme colors
- Theme Controller: Admin-only, 20 preset colors
- Cart System: Fixed API integration, proper types
- All components: Clean structure, no inline styles

### 🔧 **Key Features**

- **Sticky Header**: Auth bar hides on scroll, main bar stays sticky
- **Blur Effects**: Translucent backgrounds với backdrop-filter
- **Theme Persistence**: LocalStorage auto-save/load
- **Cart Integration**: Proper service layer, TypeScript types
- **CSS Overrides**: High specificity approach works

## **IMPORTANT FILES**

- `Header.tsx`: Sticky với scroll detection
- `CartPage.tsx`: Fixed API integration
- `theme-global.scss`: CSS overrides
- `main.scss`: Import order critical

## **CSS OVERRIDE SYSTEM**

```scss
// High specificity overrides
html body .header,
html body header.header {
  background: rgba(var(--theme-bg-primary), 0.8) !important;
  backdrop-filter: blur(10px) !important;
}

html body .footer {
  background: linear-gradient(
    135deg,
    var(--theme-secondary),
    var(--theme-primary)
  ) !important;
}
```

## **THEME CONTROLLER**

- **Admin-only access**
- **20 preset colors**
- **Live preview**
- **LocalStorage persistence**

## **DEVELOPMENT NOTES**

1. **Import Order**: `theme-global.scss` phải import cuối cùng
2. **Clean Components**: Không có inline styles
3. **CSS Specificity**: Multiple selectors để override
4. **Cart API**: Service layer với proper types

## **QUICK COMMANDS**

```bash
npm run dev          # Start development
npm run build        # Build production
```

## **TROUBLESHOOTING**

- **Theme không apply**: Check import order trong main.scss
- **CSS conflicts**: Verify theme-global.scss specificity
- **Cart errors**: Check API service integration
- **Header issues**: Verify scroll detection logic

---

**Last Updated**: Cart system fixed, Header sticky implemented, all components cleaned
