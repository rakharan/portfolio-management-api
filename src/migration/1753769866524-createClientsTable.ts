import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientsTable1753769866524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL, -- Each client profile must have a unique user login
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                date_of_birth DATE,
                risk_tolerance ENUM('conservative', 'moderate', 'aggressive') DEFAULT 'moderate',
                investment_experience ENUM('beginner', 'intermediate', 'experienced') DEFAULT 'beginner',
                annual_income DECIMAL(15,2),
                net_worth DECIMAL(15,2),
                investment_goals TEXT,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS clients`);
    }

}
