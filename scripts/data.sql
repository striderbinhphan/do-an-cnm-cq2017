USE blockchain;

INSERT INTO `project` VALUES (1,'genesis','genesis','genesis','genesis_description','2021-01-01','2021-01-01','2021-01-01');
INSERT INTO `blocks` VALUES(1,'2021-01-01',"genesisHash","genesispreviousHash",0,0);
INSERT INTO `transaction` VALUES(1,'genesis',1,1, null, '2021-01-01',null,'2021-01-01',null,null,null,'2021-01-01',null,null,null,'2021-01-01','genesisSignature');


 
INSERT INTO `users` VALUES ('04f8d1e28efd7f3ddc40686cccc0b025597e192bf6aac9ada6bfda95848296a68da6a4e30f98aa340a90b05c30fca885acc1abfbd043116c4ed77f8903eb6ba489','Hoi chu thap do','hctd@gmail.com','organization');
INSERT INTO `users` VALUES ('043357fbded6ac0519e19db7cead0d6579876ff4c274a776d50cfde9cfb60642bbacb1a323cf952f36f85fe24f0f220a067e9e52d3e61f37701e7e1f4a399722bf','Mat tran To quoc Viet Nam','mttqvn@gmail.com','organization');
