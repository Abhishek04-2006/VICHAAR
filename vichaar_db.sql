-- SQLBook: Code
-- Active: 1774068085074@@127.0.0.1@3306
DROP DATABASE IF EXISTS vichaar_db;
CREATE DATABASE vichaar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vichaar_db;

-- 1. Users Table (All profile & credibility fields included)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  department VARCHAR(50) DEFAULT 'BCA',
  badge ENUM('STUDENT', 'VERIFIED_DEBATER', 'FACULTY', 'DELEGATE') DEFAULT 'STUDENT',
  avatar LONGTEXT NULL,
  bio VARCHAR(255) DEFAULT 'Campus Thinker & Active Debater',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- 2. Posts Table (With Full-Text Index for Fast Search)
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FULLTEXT idx_posts_search (title, content),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 3. Votes Table
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  vote_type ENUM('UP', 'DOWN') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_post_vote (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 4. Comments Table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

ALTER TABLE users 
ADD COLUMN avatar LONGTEXT NULL,
ADD COLUMN bio VARCHAR(255) DEFAULT 'Campus Thinker & Active Debater',
ADD COLUMN department VARCHAR(50) DEFAULT 'BCA',
ADD COLUMN badge ENUM('STUDENT', 'VERIFIED_DEBATER', 'FACULTY', 'DELEGATE') DEFAULT 'STUDENT';

DESCRIBE users;