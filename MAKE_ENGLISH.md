# Make Khadamati Fully English

## Step 1: Update Database Categories

Run this SQL in phpMyAdmin (XAMPP):

```sql
UPDATE `category` SET `Name` = 'Plumbing', `Description` = 'Water pipes, faucets, leaks' WHERE `Name` = 'سباكة';
UPDATE `category` SET `Name` = 'Electricity', `Description` = 'Wiring, lights, fans' WHERE `Name` = 'كهرباء';
UPDATE `category` SET `Name` = 'Carpentry', `Description` = 'Furniture assembly, repairs' WHERE `Name` = 'نجارة';
UPDATE `category` SET `Name` = 'Painting', `Description` = 'Wall painting, decoration' WHERE `Name` = 'دهان';
UPDATE `category` SET `Name` = 'Cleaning', `Description` = 'Home cleaning services' WHERE `Name` = 'نظافة';
UPDATE `category` SET `Name` = 'Gardening', `Description` = 'Garden maintenance' WHERE `Name` = 'بستنة';
UPDATE `category` SET `Name` = 'Air Conditioning', `Description` = 'AC installation and repair' WHERE `Name` = 'تكييف';
UPDATE `category` SET `Name` = 'Moving', `Description` = 'Moving and transport services' WHERE `Name` = 'نقل';
```

## Step 2: Clear Browser Cache

1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Delete `i18nextLng` key
4. Hard refresh (Ctrl + Shift + R)

## Step 3: Verify

- All categories should now show in English
- Language toggle should work properly
- Default language is English

## Files Modified

The following files have been updated to use English as default:
- `client/src/i18n/config.js` - Default language: English
- `client/src/index.js` - Initial language: English
- `client/src/components/Navbar/Navbar.jsx` - Language toggle fixed

## Note

There are 185+ hardcoded Arabic strings in various components. These are being used as fallbacks when translations are missing. The translation system (i18n) should handle the display language, but the database categories needed to be updated to English.
