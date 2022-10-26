-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2022 at 04:30 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `production`
--

-- --------------------------------------------------------

--
-- Table structure for table `batch_formula`
--

CREATE TABLE `batch_formula` (
  `id` int(11) NOT NULL,
  `batchNum` varchar(255) NOT NULL,
  `production_line` text NOT NULL,
  `finmat_prod` text NOT NULL,
  `rawmat_list` text NOT NULL,
  `rawmat_quans` text NOT NULL,
  `rawmat_specs` text NOT NULL,
  `timeneeded` text NOT NULL,
  `efficency` text NOT NULL,
  `shift` text NOT NULL,
  `prod_quan` text NOT NULL,
  `waste_name` text NOT NULL,
  `waste_quan` text NOT NULL,
  `waste_unit` text NOT NULL,
  `rawmat_unit` text NOT NULL,
  `prod_unit` text NOT NULL,
  `batch_id` text NOT NULL,
  `finmat_spec` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `batch_formula`
--

INSERT INTO `batch_formula` (`id`, `batchNum`, `production_line`, `finmat_prod`, `rawmat_list`, `rawmat_quans`, `rawmat_specs`, `timeneeded`, `efficency`, `shift`, `prod_quan`, `waste_name`, `waste_quan`, `waste_unit`, `rawmat_unit`, `prod_unit`, `batch_id`, `finmat_spec`) VALUES
(1, '', 'Sed et anim consequu', 'Ipsum consequatur E', '[{\"mat_requestname\":\"Lois Lindsay\",\"mat_spec\":\"Quia labore eu commo\",\"mat_description\":\"Voluptatem velit e\",\"mat_quantity\":\"444\"},{\"mat_requestname\":\"Hamish Gentry\",\"mat_spec\":\"Placeat ea error es\",\"mat_description\":\"Sequi aspernatur ad \",\"mat_quantity\":\"46\"}]', '', '', 'Fugiat ad veniam o', 'Voluptatibus excepte', 'Dolore magnam fugiat', '490', 'Summer Fitzgerald', '338', 'Repellendus Ullam l', '', 'Ullamco omnis fugit', '', 'Non expedita consequ'),
(2, '', 'Sed et anim consequu', 'Ipsum consequatur E', '[{\"mat_requestname\":\"Lois Lindsay\",\"mat_spec\":\"Quia labore eu commo\",\"mat_description\":\"Voluptatem velit e\",\"mat_quantity\":\"444\"},{\"mat_requestname\":\"Hamish Gentry\",\"mat_spec\":\"Placeat ea error es\",\"mat_description\":\"Sequi aspernatur ad \",\"mat_quantity\":\"46\"}]', '', '', 'Fugiat ad veniam o', 'Voluptatibus excepte', 'Dolore magnam fugiat', '490', 'Summer Fitzgerald', '338', 'Repellendus Ullam l', '', 'Ullamco omnis fugit', '', 'Non expedita consequ'),
(3, 'l9e8lzrbtk3428a7utp', '1', 'Ullamco occaecat ali', '[{\"mat_requestname\":\"Jeanette Franco\",\"mat_spec\":\"Nostrud amet et sed\",\"mat_description\":\"Aut dolores labore q\",\"mat_quantity\":\"486\"},{\"mat_requestname\":\"Alisa Spears\",\"mat_spec\":\"Sit enim laboris fug\",\"mat_description\":\"Nihil necessitatibus\",\"mat_quantity\":\"900\"}]', '', '', '2', '100', '1', '814', 'Sloane', '758', 'KG', 'KG', 'sitatibus eos q', '', 'Rerum nemo nihil con');

-- --------------------------------------------------------

--
-- Table structure for table `custome_batch`
--

CREATE TABLE `custome_batch` (
  `id` int(11) NOT NULL,
  `raw_mat_needed` text NOT NULL,
  `expected_fin_qty` text NOT NULL,
  `expected_waste_quan` text NOT NULL,
  `custom_batch_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `custome_batch`
--

INSERT INTO `custome_batch` (`id`, `raw_mat_needed`, `expected_fin_qty`, `expected_waste_quan`, `custom_batch_id`) VALUES
(1, 'wertyuiosdfghj', '456', '45', 'l9o9xmu400kav3joguiae'),
(2, 'wertyuiosdfghj', '456', '45', 'l9o9z6pibb9it8ht3v'),
(3, 'wertyuiosdfghj', '456', '45', 'l9oa1ac23z82upp9mnl'),
(4, 'wertyuiosdfghj', '456', '45', 'l9oa65g80mbhoiphhrq9');

-- --------------------------------------------------------

--
-- Table structure for table `produced`
--

CREATE TABLE `produced` (
  `id` int(11) NOT NULL,
  `productionID` int(11) NOT NULL,
  `finished_name` text NOT NULL,
  `finished_spec` text NOT NULL,
  `finished_qty` text NOT NULL,
  `personID` text NOT NULL,
  `finished_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `production_order`
--

CREATE TABLE `production_order` (
  `id` int(11) NOT NULL,
  `fin_product` text NOT NULL,
  `fin_spec` text NOT NULL,
  `fin_quan` text NOT NULL,
  `batch_id` int(11) NOT NULL,
  `start_dateTime` text NOT NULL,
  `end_dateTime` text NOT NULL,
  `custom_batch_id` text NOT NULL,
  `batch_mult` int(11) NOT NULL,
  `status` text NOT NULL,
  `est_finQuan` text NOT NULL,
  `est_westQuan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `production_order`
--

INSERT INTO `production_order` (`id`, `fin_product`, `fin_spec`, `fin_quan`, `batch_id`, `start_dateTime`, `end_dateTime`, `custom_batch_id`, `batch_mult`, `status`, `est_finQuan`, `est_westQuan`) VALUES
(1, 'PVC', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '678', '873'),
(2, 'PVC', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(3, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(4, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(5, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(6, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(7, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(8, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(9, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(10, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '897', '43'),
(11, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(12, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(13, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '6666'),
(14, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(15, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(16, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(17, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '0', '0'),
(18, 'Pyui', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '12210', '11370'),
(19, 'ed', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '12210', '11370'),
(20, 'ed', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '12210', '11370'),
(21, 'ed', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '', ''),
(22, 'ed', 'pv3', '23', 3, '11:13:00', '11:13:00', '0', 5, 'Beginer', '', ''),
(23, 'ed', 'pv3', '23', 3, '11:13:00', '11:13:00', 'l9oa65g80mbhoiphhrq9', 5, 'Beginer', '', ''),
(24, 'ed', 'pv3', '23', 3, '11:13:00', '11:13:00', '', 5, 'Beginer', '12210', '11370');

-- --------------------------------------------------------

--
-- Table structure for table `summery`
--

CREATE TABLE `summery` (
  `id` int(11) NOT NULL,
  `ProductionID` text NOT NULL,
  `finishedID` text NOT NULL,
  `summeryTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `batch_formula`
--
ALTER TABLE `batch_formula`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `custome_batch`
--
ALTER TABLE `custome_batch`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produced`
--
ALTER TABLE `produced`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `production_order`
--
ALTER TABLE `production_order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `summery`
--
ALTER TABLE `summery`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `batch_formula`
--
ALTER TABLE `batch_formula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `custome_batch`
--
ALTER TABLE `custome_batch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `produced`
--
ALTER TABLE `produced`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `production_order`
--
ALTER TABLE `production_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `summery`
--
ALTER TABLE `summery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
