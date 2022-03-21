--DROP DATABASE IF EXISTS `--MONITORING--`;
CREATE DATABASE IF NOT EXISTS `monitoring`;
USE `monitoring`;

CREATE TABLE IF NOT EXISTS `MeasurementData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `temperature` double NOT NULL,
  `humidity` double NOT NULL,
  `measurementType` smallint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `MeasurementData` (`id`, `timestamp`, `temperature`, `humidity`, `measurementType`) VALUES
(1,1621158665, 25.4, 64.2, 0),
(2,1621158764, 23.2, 63.1, 0),
(3,1621158865, 22.1, 55.2, 1),
(4,1621158965, 25.4, 54.1, 1),
(5,1621158975, 29.1, 55.1, 0);

CREATE TABLE IF NOT EXISTS `UserData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `passwordHash` char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  PRIMARY KEY (`id`),
  ) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- For Insertion of UserData use ./generateUser.js because passwords have to be encrypted
