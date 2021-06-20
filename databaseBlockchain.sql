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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
/*user/donater - organization */;
 


--
-- Table structure for table `project`
--


CREATE TABLE `project` (
  `project_id` int(5) NOT NULL,
  `project_name` varchar(256) not  NULL,
  `project_beneficiary_create_address` varchar(256) DEFAULT NULL,
	`project_organization_confirm_address` varchar(256) DEFAULT NULL,
    `project_create_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `project_confirm_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `project_deadline` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `block`
--

CREATE TABLE `blocks` (
  `block_index` int NOT NULL,
  `block_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `block_hash` varchar(256) DEFAULT NULL,
  `block_previoushash` varchar(256) DEFAULT NULL,
  `block_nonce` int DEFAULT NULL,
  `block_difficulty` int DEFAULT NULL,
  PRIMARY KEY (`block_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int(5) NOT NULL auto_increment,
  `transaction_type` varchar(10) NOT NULL,
  `project_id` int(5) DEFAULT NULL,
  `block_index` int not null,
  
  `create_txs_project_beneficiary_create_address` varchar(256) DEFAULT NULL,
  `create_txs_project_create_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  `confirm_txs_project_organization_confirm_address` varchar(256) DEFAULT NULL,
  `confirm_txs_project_confirm_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int default null,
  `donate_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
   `sendback_txs_from_address` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int default null,
  `sendback_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`transaction_id`),
  CONSTRAINT `fk_blockindex` FOREIGN KEY (`block_index`) REFERENCES `blocks` (`block_index`) ,
   CONSTRAINT `fk_projectid` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) 
  
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;





--
-- Table structure for table `nodes`
--

CREATE TABLE `nodes` (
  `node_index` varchar(45) NOT NULL,
  `host` varchar(45) DEFAULT NULL,
  `port` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`node_index`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;




--
-- Table structure for table `pendingTransactions`
--

CREATE TABLE `pending_transactions` (
  `transaction_type` varchar(10) NOT NULL,
  `project_id` varchar(45) DEFAULT NULL,
  
  `create_txs_project_beneficiary_create_address` varchar(256) DEFAULT NULL,
  `create_txs_projectCreateTimestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  `confirm_txs_project_organization_confirm_address` varchar(256) DEFAULT NULL,
  `confirm_txs_project_confirm_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int default null,
  `donate_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
   `sendback_txs_from_address` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int default null,
  `sendback_txs_timestamp` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into `project` values (0,'genesis','genesis','genesis','2021-01-01','2021-01-01','2021-01-01');
insert into `blocks` values(0,'2021-01-01',"genesisHash","genesispreviousHash",0,0);
insert into `transaction` values(0,'genesis',0,0, null, '2021-01-01',null,'2021-01-01',null,null,null,'2021-01-01',null,null,null,'2021-01-01');

DELETE FROM `blocks`
WHERE `block_index`=0; 
