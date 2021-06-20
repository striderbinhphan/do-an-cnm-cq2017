use blockchain;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `address` varchar(45) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(256) default null,
  `role` varchar(45) DEFAULT NULL, 
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*user/donater - organization */;



--
-- Table structure for table `project`
--


CREATE TABLE `project` (
  `project_id` int(5) NOT NULL,
  `project_name` varchar(256) not  NULL,
  `project_beneficiary_create_address` varchar(256) DEFAULT NULL,
	`project_organization_confirm_address` varchar(256) DEFAULT NULL,
    `project_create_timestamp` timestamp DEFAULT null,
  `project_confirm_timestamp` timestamp DEFAULT NULL,
  `project_deadline` timestamp DEFAULT NULL,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `block`
--

CREATE TABLE `blocks` (
  `block_index` int NOT NULL,
  `block_timestamp` timestamp DEFAULT NULL,
  `block_hash` varchar(45) DEFAULT NULL,
  `block_previoushash` varchar(45) DEFAULT NULL,
  `block_nonce` varchar(45) DEFAULT NULL,
  `block_difficulty` int DEFAULT NULL,
  PRIMARY KEY (`block_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int(5) NOT NULL auto_increment,
  `transaction_type` varchar(10) NOT NULL,
  `project_id` int(5) NOT NULL,
  `block_index` int not null,
  
  `create_txs_project_beneficiary_create_address` varchar(256) DEFAULT NULL,
  `create_txs_project_create_timestamp` timestamp DEFAULT NULL,
  
  `confirm_txs_project_organization_confirm_address` varchar(256) DEFAULT NULL,
  `confirm_txs_project_confirm_timestamp` timestamp DEFAULT NULL,
  
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int default null,
  `donate_txs_timestamp` timestamp default null,
  
   `sendback_txs_from_address` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int default null,
  `sendback_txs_timestamp` timestamp default null,
  
  PRIMARY KEY (`transaction_id`),
  CONSTRAINT `fk_blockindex` FOREIGN KEY (`block_index`) REFERENCES `blocks` (`block_index`) ,
   CONSTRAINT `fk_projectid` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) 
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





--
-- Table structure for table `nodes`
--

CREATE TABLE `nodes` (
  `node_index` varchar(45) NOT NULL,
  `host` varchar(45) DEFAULT NULL,
  `port` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`node_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




--
-- Table structure for table `pendingTransactions`
--

CREATE TABLE `pending_transactions` (
  `transaction_type` varchar(10) NOT NULL,
  `project_id` varchar(45) DEFAULT NULL,
  
  `create_txs_project_beneficiary_create_address` varchar(256) DEFAULT NULL,
  `create_txs_projectCreateTimestamp` timestamp DEFAULT NULL,
  
  `confirm_txs_project_organization_confirm_address` varchar(256) DEFAULT NULL,
  `confirm_txs_project_confirm_timestamp` timestamp DEFAULT NULL,
  
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int default null,
  `donate_txs_timestamp` timestamp default null,
  
   `sendback_txs_from_address` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int default null,
  `sendback_txs_timestamp` timestamp default null
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




