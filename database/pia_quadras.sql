-- ============================================
-- PIA QUADRAS - Schema do Banco de Dados
-- ============================================

CREATE DATABASE IF NOT EXISTS pia_quadras
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pia_quadras;

-- ============================================
-- TABELA: users
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('player', 'admin') DEFAULT 'player',
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: courts (Quadras)
-- ============================================
CREATE TABLE courts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('society', 'areia', 'tenis', 'futsal', 'basquete', 'volei') NOT NULL,
    description TEXT,
    price_per_hour DECIMAL(10,2) NOT NULL,
    price_peak_hour DECIMAL(10,2), -- Preço em horário nobre
    image_url VARCHAR(255),
    capacity INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: operating_hours (Horário de Funcionamento)
-- ============================================
CREATE TABLE operating_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    court_id INT,
    day_of_week TINYINT NOT NULL, -- 0=Dom, 1=Seg, ..., 6=Sáb
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    INDEX idx_court_day (court_id, day_of_week)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: bookings (Reservas)
-- ============================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    court_id INT NOT NULL,
    user_id INT NOT NULL, -- Quem criou a reserva
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (court_id) REFERENCES courts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_court_date (court_id, booking_date),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_booking (court_id, booking_date, start_time)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: booking_players (Jogadores e Divisão de Pagamento)
-- ============================================
CREATE TABLE booking_players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT,
    guest_name VARCHAR(100), -- Para convidados sem cadastro
    guest_email VARCHAR(150),
    amount_due DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'refunded', 'expired') DEFAULT 'pending',
    payment_link VARCHAR(500),
    payment_method ENUM('pix', 'credit_card', 'cash', 'transfer') DEFAULT 'pix',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_booking (booking_id),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: waitlist (Lista de Espera)
-- ============================================
CREATE TABLE waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    court_id INT NOT NULL,
    user_id INT NOT NULL,
    desired_date DATE NOT NULL,
    desired_start_time TIME NOT NULL,
    desired_end_time TIME NOT NULL,
    priority INT DEFAULT 0, -- Prioridade na fila
    status ENUM('waiting', 'notified', 'converted', 'expired', 'cancelled') DEFAULT 'waiting',
    notified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_court_date (court_id, desired_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: payments (Histórico de Transações)
-- ============================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_player_id INT NOT NULL,
    gateway_id VARCHAR(100), -- ID da transação no gateway
    gateway_name VARCHAR(50), -- mercado_pago, pagarme, etc
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    qr_code TEXT, -- PIX Copia e Cola
    qr_code_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_player_id) REFERENCES booking_players(id) ON DELETE CASCADE,
    INDEX idx_gateway (gateway_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;