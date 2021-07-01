use blockchain;
SET @@auto_increment_increment=5;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `address` varchar(150) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(256) default null,
  `role` varchar(45) DEFAULT NULL, 
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;
/*user/donater - organization */;
 


--
-- Table structure for table `project`
--


CREATE TABLE `project` (
	`project_id` int not  NULL auto_increment,
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

CREATE TABLE `blocks` (
  `block_index` int NOT NULL,
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

CREATE TABLE `transaction` (
  `transaction_id` int NOT NULL auto_increment,
  `transaction_type` varchar(20) NOT NULL,
  `project_id` int not  NULL,
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

CREATE TABLE `nodes` (
  `node_index` varchar(45) NOT NULL,
  `host` varchar(256) DEFAULT NULL,
  `port` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`node_index`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;




--
-- Table structure for table `pendingTransactions`
--

CREATE TABLE `pending_transactions` (
  `transaction_type` varchar(20) NOT NULL,
  `project_id` varchar(256) not  NULL,
  
  
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

insert into `project` values (1,'genesis','genesis','genesis','genesis_description','2021-01-01','2021-01-01','2021-01-01');
insert into `blocks` values(0,'2021-01-01',"genesisHash","genesispreviousHash",0,0);
insert into `transaction` values(1,'genesis',1,0, null, '2021-01-01',null,'2021-01-01',null,null,null,'2021-01-01',null,null,null,'2021-01-01','genesisSignature');

insert into `users` values ('04f8d1e28efd7f3ddc40686cccc0b025597e192bf6aac9ada6bfda95848296a68da6a4e30f98aa340a90b05c30fca885acc1abfbd043116c4ed77f8903eb6ba489','Hoi chu thap do','hctd@gmail.com','organization');
insert into `users` values ('043357fbded6ac0519e19db7cead0d6579876ff4c274a776d50cfde9cfb60642bbacb1a323cf952f36f85fe24f0f220a067e9e52d3e61f37701e7e1f4a399722bf','Mat tran To quoc Viet Nam','mttqvn@gmail.com','organization');
