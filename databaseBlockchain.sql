-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2021 at 11:56 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abc`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `block_index` varchar(45) NOT NULL,
  `block_timestamp` datetime(6) DEFAULT NULL,
  `block_hash` varchar(45) DEFAULT NULL,
  `block_previoushash` varchar(45) DEFAULT NULL,
  `block_nonce` varchar(45) DEFAULT NULL,
  `block_difficulty` int(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `nodes`
--

CREATE TABLE `nodes` (
  `node_index` varchar(45) NOT NULL,
  `host` varchar(45) DEFAULT NULL,
  `port` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pendingtransactions`
--

CREATE TABLE `pendingtransactions` (
  `transaction_id` varchar(45) NOT NULL,
  `transaction_type` varchar(45) NOT NULL,
  `project_id` varchar(45) DEFAULT NULL,
  `create_txs_projectBeneficiaryCreateAddress` varchar(256) DEFAULT NULL,
  `create_txs_projectCreateTimestamp` timestamp(6) NULL DEFAULT NULL,
  `confirm_txs_projectOrganizationConfirmAddress` varchar(256) DEFAULT NULL,
  `confirm_txs_projectConfirmTimestamp` timestamp(6) NULL DEFAULT NULL,
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int(56) DEFAULT NULL,
  `donate_txs_timestamp` timestamp(6) NULL DEFAULT NULL,
  `sendback_txs_from_addres` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int(45) DEFAULT NULL,
  `sendback_txs_timestamp` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `projectId` varchar(45) NOT NULL,
  `projectName` varchar(45) NOT NULL,
  `projectBeneficiaryCreateAddress` varchar(45) DEFAULT NULL,
  `projectOrganizationConfirmAddress` varchar(45) DEFAULT NULL,
  `projectCreateTimestamp` timestamp(6) NULL DEFAULT NULL,
  `projectConfirmTimestamp` timestamp(6) NULL DEFAULT NULL,
  `projectDeadline` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` varchar(45) NOT NULL,
  `transaction_type` varchar(10) NOT NULL,
  `project_id` varchar(45) DEFAULT NULL,
  `transaction_block_index` varchar(45) NOT NULL,
  `create_txs_projectBeneficiaryCreateAddress` varchar(256) DEFAULT NULL,
  `create_txs_projectCreateTimestamp` timestamp(6) NULL DEFAULT NULL,
  `confirm_txs_projectOrganizationConfirmAddress` varchar(256) DEFAULT NULL,
  `confirm_txs_projectConfirmTimestamp` timestamp(6) NULL DEFAULT NULL,
  `donate_txs_from_address` varchar(256) DEFAULT NULL,
  `donate_txs_to_address` varchar(256) DEFAULT NULL,
  `donate_txs_amount` int(45) DEFAULT NULL,
  `donate_txs_timestamp` timestamp(6) NULL DEFAULT NULL,
  `sendback_txs_from_address` varchar(256) DEFAULT NULL,
  `sendback_txs_to_address` varchar(256) DEFAULT NULL,
  `sendback_txs_amount` int(45) DEFAULT NULL,
  `sendback_txs_timestamp` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `address` varchar(45) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`block_index`);

--
-- Indexes for table `nodes`
--
ALTER TABLE `nodes`
  ADD PRIMARY KEY (`node_index`);

--
-- Indexes for table `pendingtransactions`
--
ALTER TABLE `pendingtransactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`projectId`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `transaction_block_index` (`transaction_block_index`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`address`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pendingtransactions`
--
ALTER TABLE `pendingtransactions`
  ADD CONSTRAINT `pendingtransactions_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`projectId`);

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`transaction_block_index`) REFERENCES `blocks` (`block_index`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
