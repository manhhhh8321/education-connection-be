'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert Teachers
    await queryInterface.bulkInsert('teachers', [
      { id: 1, email: 'teacherken@gmail.com', created_at: new Date(), updated_at: new Date() },
      { id: 2, email: 'teacherjoe@gmail.com', created_at: new Date(), updated_at: new Date() },
    ]);

    // Insert Students
    await queryInterface.bulkInsert('students', [
      { id: 1, email: 'studentjon@gmail.com', created_at: new Date(), updated_at: new Date() },
      { id: 2, email: 'studenthon@gmail.com', created_at: new Date(), updated_at: new Date() },
      {
        id: 3,
        email: 'student_only_under_teacher_ken@gmail.com',

        created_at: new Date(),
        updated_at: new Date(),
      },
      { id: 4, email: 'commonstudent1@gmail.com', created_at: new Date(), updated_at: new Date() },
      { id: 5, email: 'commonstudent2@gmail.com', created_at: new Date(), updated_at: new Date() },
      { id: 6, email: 'studentmary@gmail.com', created_at: new Date(), updated_at: new Date() },
    ]);

    // Insert Suspended Students
    await queryInterface.bulkInsert('suspended_students', [
      { student_id: 2, created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('suspended_students', {});
    await queryInterface.bulkDelete('teacher_students', {});
    await queryInterface.bulkDelete('students', {});
    await queryInterface.bulkDelete('teachers', {});
  },
};
