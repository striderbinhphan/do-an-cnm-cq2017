USE blockchain;

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `address` varchar(256) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(256) default null,
  `role` varchar(45) DEFAULT NULL, 
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
/*user/donater - organization */;
 


--
-- Table structure for table `project`
--


CREATE TABLE IF NOT EXISTS `project` (
  `project_id` int NOT NULL auto_increment,
  `project_name` varchar(256) not  NULL,
  `project_beneficiary_create_address` varchar(256) DEFAULT NULL,
	`project_organization_confirm_address` varchar(256) DEFAULT NULL,
    `project_description` varchar(256) DEFAULT NULL,
    `project_create_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  `project_confirm_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  `project_deadline` timestamp DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`project_id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `block`
--

CREATE TABLE IF NOT EXISTS `blocks` (
  `block_index` int NOT NULL auto_increment,
  `block_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  `block_hash` varchar(256) DEFAULT NULL,
  `block_previoushash` varchar(256) DEFAULT NULL,
  `block_nonce` int DEFAULT NULL,
  `block_difficulty` int DEFAULT NULL,
  PRIMARY KEY (`block_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



--
-- Table structure for table `transaction`
--

CREATE TABLE IF NOT EXISTS `transaction` (
  `transaction_id` int NOT NULL auto_increment,
  `transaction_type` varchar(20) NOT NULL,
  `project_id` int DEFAULT NULL,
  `block_index` int not null,
  `create_txs_project_beneficiary_create_address` varchar(256) DEFAULT NULL,
  `create_txs_project_create_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  
  `confirm_txs_project_organization_confirm_address` varchar(256) DEFAULT NULL,
  `confirm_txs_project_confirm_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int default null,
  `donate_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  
   `sendback_txs_from_address` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int default null,
  `sendback_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  
   `transaction_signature` varchar(256) default null,
  PRIMARY KEY (`transaction_id`),
  CONSTRAINT `fk_blockindex` FOREIGN KEY (`block_index`) REFERENCES `blocks` (`block_index`) ,
   CONSTRAINT `fk_projectid` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) 
  
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;





--
-- Table structure for table `nodes`
--

CREATE TABLE IF NOT EXISTS `nodes` (
  `node_index` varchar(45) NOT NULL,
  `host` varchar(256) DEFAULT NULL,
  `port` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`node_index`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;




--
-- Table structure for table `pendingTransactions`
--

CREATE TABLE IF NOT EXISTS `pending_transactions` (
  `transaction_type` varchar(20) NOT NULL,
  `project_id` int DEFAULT NULL,
  
  
  `create_txs_project_beneficiary_create_address` varchar(256) DEFAULT NULL,
  `create_txs_project_create_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  
  `confirm_txs_project_organization_confirm_address` varchar(256) DEFAULT NULL,
  `confirm_txs_project_confirm_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int default null,
  `donate_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  
   `sendback_txs_from_address` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int default null,
  `sendback_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ,
  `transaction_signature` varchar(256) default null
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;