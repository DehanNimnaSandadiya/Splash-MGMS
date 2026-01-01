import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const ensureAdminUser = async () => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const adminEmail = 'adminmgms@gmail.com';
  const adminPassword = 'admin1234';

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const admin = new User({
        name: 'MGMS Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isActive: true,
      });

      await admin.save();
      console.log('Admin user created:', adminEmail);
    } else {
      // Ensure existing admin has correct role
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log('Admin user role updated:', adminEmail);
      }
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error.message);
  }
};


