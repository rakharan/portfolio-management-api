import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialUserGroups1753770358059 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO user_groups (id, group_name) VALUES
            (1, 'Administrator'),
            (2, 'Advisor'),
            (3, 'Client'),
            (4, 'Compliance Officer');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This will remove the data inserted in the 'up' method
        await queryRunner.query(`
            DELETE FROM user_groups 
            WHERE group_name IN ('Administrator', 'Advisor', 'Client', 'Compliance Officer');
        `);
    }

}
