-- Update Categories to English
UPDATE `category` SET `Name` = 'Plumbing', `Description` = 'Water pipes, faucets, leaks' WHERE `CategoryID` = 1;
UPDATE `category` SET `Name` = 'Electricity', `Description` = 'Wiring, lights, fans' WHERE `CategoryID` = 2;
UPDATE `category` SET `Name` = 'Cleaning', `Description` = 'Home cleaning services' WHERE `CategoryID` = 3;
UPDATE `category` SET `Name` = 'Carpentry', `Description` = 'Furniture assembly, repairs' WHERE `CategoryID` = 4;

-- Add more categories if they exist
UPDATE `category` SET `Name` = 'Painting', `Description` = 'Wall painting, decoration' WHERE `Name` LIKE '%دهان%';
UPDATE `category` SET `Name` = 'Gardening', `Description` = 'Garden maintenance' WHERE `Name` LIKE '%بستنة%';
UPDATE `category` SET `Name` = 'Air Conditioning', `Description` = 'AC installation and repair' WHERE `Name` LIKE '%تكييف%';
UPDATE `category` SET `Name` = 'Moving', `Description` = 'Moving and transport services' WHERE `Name` LIKE '%نقل%';
