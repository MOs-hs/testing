-- ========================================
-- KHADAMATI DATABASE SCHEMA
-- Complete database structure
-- Last updated: December 17, 2024
-- Uses IF NOT EXISTS to avoid errors on existing tables
-- ========================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `khadamati`
CREATE DATABASE IF NOT EXISTS `khadamati` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `khadamati`;

-- ========================================
-- TABLE: user (base table for all users)
-- ========================================
CREATE TABLE IF NOT EXISTS `user` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` enum('customer','provider','admin') NOT NULL DEFAULT 'customer',
  `CreatedAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `idx_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: admin
-- ========================================
CREATE TABLE IF NOT EXISTS `admin` (
  `AdminID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: customer
-- ========================================
CREATE TABLE IF NOT EXISTS `customer` (
  `CustomerID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  PRIMARY KEY (`CustomerID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: provider
-- ========================================
CREATE TABLE IF NOT EXISTS `provider` (
  `ProviderID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `Rating` decimal(3,2) DEFAULT 0.00,
  `TotalReviews` int(11) DEFAULT 0,
  PRIMARY KEY (`ProviderID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `provider_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: category
-- ========================================
CREATE TABLE IF NOT EXISTS `category` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  PRIMARY KEY (`CategoryID`),
  KEY `idx_name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories if table was just created
INSERT IGNORE INTO `category` (`CategoryID`, `Name`, `Description`) VALUES
(1, 'Plumbing', 'Water pipes, faucets, leaks'),
(2, 'Electrical', 'Wiring, lights, fans'),
(3, 'Cleaning', 'Home cleaning services'),
(4, 'Carpentry', 'Furniture assembly, repairs');

-- ========================================
-- TABLE: status
-- ========================================
CREATE TABLE IF NOT EXISTS `status` (
  `StatusID` int(11) NOT NULL AUTO_INCREMENT,
  `StatusName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  PRIMARY KEY (`StatusID`),
  UNIQUE KEY `StatusName` (`StatusName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default statuses if table was just created
INSERT IGNORE INTO `status` (`StatusID`, `StatusName`, `Description`) VALUES
(1, 'Pending', 'New request waiting for provider'),
(2, 'Accepted', 'Provider accepted the job'),
(3, 'In Progress', 'Service is being performed'),
(4, 'Completed', 'Service finished, ready for review'),
(5, 'Cancelled', 'Request cancelled');

-- ========================================
-- TABLE: service
-- ========================================
CREATE TABLE IF NOT EXISTS `service` (
  `ServiceID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `ProviderID` int(11) NOT NULL,
  `Status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`ServiceID`),
  KEY `idx_provider` (`ProviderID`),
  KEY `idx_category` (`CategoryID`),
  CONSTRAINT `service_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE SET NULL,
  CONSTRAINT `service_ibfk_2` FOREIGN KEY (`ProviderID`) REFERENCES `provider` (`ProviderID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: serviceimage
-- ========================================
CREATE TABLE IF NOT EXISTS `serviceimage` (
  `ImageID` int(11) NOT NULL AUTO_INCREMENT,
  `ServiceID` int(11) DEFAULT NULL,
  `ImageURL` varchar(500) NOT NULL,
  `Caption` text DEFAULT NULL,
  PRIMARY KEY (`ImageID`),
  KEY `ServiceID` (`ServiceID`),
  CONSTRAINT `serviceimage_ibfk_1` FOREIGN KEY (`ServiceID`) REFERENCES `service` (`ServiceID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: servicerequest
-- ========================================
CREATE TABLE IF NOT EXISTS `servicerequest` (
  `RequestID` int(11) NOT NULL AUTO_INCREMENT,
  `CustomerID` int(11) NOT NULL,
  `ServiceID` int(11) NOT NULL,
  `StatusID` int(11) DEFAULT 1,
  `RequestDate` datetime DEFAULT current_timestamp(),
  `ScheduledDate` datetime NOT NULL,
  `Details` text DEFAULT NULL,
  `AddressLine` text DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`RequestID`),
  KEY `idx_customer` (`CustomerID`),
  KEY `idx_service` (`ServiceID`),
  KEY `idx_status` (`StatusID`),
  CONSTRAINT `servicerequest_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`) ON DELETE CASCADE,
  CONSTRAINT `servicerequest_ibfk_2` FOREIGN KEY (`ServiceID`) REFERENCES `service` (`ServiceID`) ON DELETE CASCADE,
  CONSTRAINT `servicerequest_ibfk_3` FOREIGN KEY (`StatusID`) REFERENCES `status` (`StatusID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: review
-- ========================================
CREATE TABLE IF NOT EXISTS `review` (
  `ReviewID` int(11) NOT NULL AUTO_INCREMENT,
  `RequestID` int(11) NOT NULL,
  `Rating` int(11) DEFAULT NULL CHECK (`Rating` between 1 and 5),
  `Comment` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`ReviewID`),
  UNIQUE KEY `RequestID` (`RequestID`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`RequestID`) REFERENCES `servicerequest` (`RequestID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: payment
-- ========================================
CREATE TABLE IF NOT EXISTS `payment` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `RequestID` int(11) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentDate` datetime DEFAULT current_timestamp(),
  `PaymentStatus` enum('pending','paid','failed') DEFAULT 'pending',
  PRIMARY KEY (`PaymentID`),
  UNIQUE KEY `RequestID` (`RequestID`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`RequestID`) REFERENCES `servicerequest` (`RequestID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: notification
-- ========================================
CREATE TABLE IF NOT EXISTS `notification` (
  `NotificationID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `Type` varchar(50) NOT NULL,
  `IsRead` tinyint(1) DEFAULT 0,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`NotificationID`),
  KEY `idx_user` (`UserID`),
  KEY `idx_isread_type` (`IsRead`,`Type`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: certificate
-- ========================================
CREATE TABLE IF NOT EXISTS `certificate` (
  `CertificateID` int(11) NOT NULL AUTO_INCREMENT,
  `ProviderID` int(11) NOT NULL,
  `CertificateName` varchar(255) NOT NULL,
  `IssueDate` date DEFAULT NULL,
  `ExpiryDate` date DEFAULT NULL,
  PRIMARY KEY (`CertificateID`),
  KEY `idx_provider` (`ProviderID`),
  CONSTRAINT `certificate_ibfk_1` FOREIGN KEY (`ProviderID`) REFERENCES `provider` (`ProviderID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: reports
-- ========================================
CREATE TABLE IF NOT EXISTS `reports` (
  `ReportID` int(11) NOT NULL AUTO_INCREMENT,
  `AdminID` int(11) NOT NULL,
  `ReportType` varchar(100) NOT NULL,
  `DataJSON` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`DataJSON`)),
  `GeneratedAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`ReportID`),
  KEY `idx_admin` (`AdminID`),
  KEY `idx_type` (`ReportType`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`AdminID`) REFERENCES `admin` (`AdminID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: contact_message
-- ========================================
CREATE TABLE IF NOT EXISTS `contact_message` (
  `MessageID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `Status` enum('new', 'read', 'replied') DEFAULT 'new',
  `CreatedAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`MessageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE: profile_change_request (NEW)
-- ========================================
CREATE TABLE IF NOT EXISTS `profile_change_request` (
  `RequestID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `RequestType` enum('customer', 'provider', 'admin') NOT NULL,
  `CurrentData` JSON NOT NULL COMMENT 'Current user data snapshot',
  `RequestedChanges` JSON NOT NULL COMMENT 'Changes requested by user',
  `Status` enum('pending', 'approved', 'rejected') DEFAULT 'pending',
  `RejectionReason` text DEFAULT NULL,
  `RequestedAt` timestamp DEFAULT current_timestamp(),
  `ReviewedAt` timestamp NULL DEFAULT NULL,
  `ReviewedBy` int(11) DEFAULT NULL COMMENT 'Admin UserID who approved/rejected',
  PRIMARY KEY (`RequestID`),
  KEY `idx_user` (`UserID`),
  KEY `idx_status` (`Status`),
  KEY `idx_requested_at` (`RequestedAt`),
  CONSTRAINT `profile_change_request_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `profile_change_request_ibfk_2` FOREIGN KEY (`ReviewedBy`) REFERENCES `user` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
