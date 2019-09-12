CREATE TABLE `cards` (
  `idcard` int(11) NOT NULL AUTO_INCREMENT,
  `idcustomer` int(11) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `cvv` tinyint(3) NOT NULL,
  `expiration_date` date NOT NULL,
  `capital` decimal(18,2) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modify_date` datetime DEFAULT NULL,
  `modify_reason` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcard`),
  KEY `card_fk_cust_idx` (`idcustomer`),
  CONSTRAINT `card_fk_cust` FOREIGN KEY (`idcustomer`) REFERENCES `customers` (`idcustomer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customers` (
  `idcustomer` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `short_name` varchar(100) NOT NULL,
  `gender` varchar(45) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modify_date` datetime DEFAULT NULL,
  `modify_reason` varchar(45) DEFAULT NULL,
  `iduser` int(11) DEFAULT NULL,
  PRIMARY KEY (`idcustomer`),
  KEY `cust_fk_user_idx` (`iduser`),
  CONSTRAINT `cust_fk_user` FOREIGN KEY (`iduser`) REFERENCES `users` (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `nurses` (
  `idnurse` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `short_name` varchar(100) NOT NULL,
  `code_identification` varchar(100) NOT NULL,
  `gender` varchar(45) NOT NULL,
  `qualification` decimal(2,2) DEFAULT NULL,
  `thumbnail_image` varchar(100) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modify_date` datetime DEFAULT NULL,
  `modify_reason` varchar(45) DEFAULT NULL,
  `iduser` int(11) DEFAULT NULL,
  `idnursetype` int(11) DEFAULT NULL,
  PRIMARY KEY (`idnurse`),
  KEY `nurs_fk_nurstype_idx` (`idnursetype`),
  CONSTRAINT `nurs_fk_nurstype` FOREIGN KEY (`idnursetype`) REFERENCES `nursetypes` (`idnursetype`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `nursetypes` (
  `idnursetype` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modify_date` datetime DEFAULT NULL,
  `modify_reason` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idnursetype`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reservations` (
  `idreservation` int(11) NOT NULL,
  `idcustomer` int(11) NOT NULL,
  `idnurse` int(11) NOT NULL,
  `idcard` int(11) NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `active` tinyint(4) NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modify_date` datetime DEFAULT NULL,
  `modify_reason` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idreservation`),
  KEY `res_fk_nurse_idx` (`idnurse`),
  KEY `res_fk_customer_idx` (`idcustomer`),
  CONSTRAINT `res_fk_customer` FOREIGN KEY (`idcustomer`) REFERENCES `customers` (`idcustomer`),
  CONSTRAINT `res_fk_nurse` FOREIGN KEY (`idnurse`) REFERENCES `nurses` (`idnurse`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `created_by` varchar(45) NOT NULL,
  `create_date` datetime NOT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modify_date` datetime DEFAULT NULL,
  `modify_reason` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
