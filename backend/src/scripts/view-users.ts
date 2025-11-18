// backend/src/scripts/view-users.ts
// Run this to see all users with decrypted data
import { PrismaClient } from '@prisma/client';
import { decrypt } from '../utils/encryption';

const prisma = new PrismaClient();

async function viewAllUsers() {
  try {
    console.log('👥 Fetching all users...\n');

    const users = await prisma.user.findMany({
      include: {
        refreshTokens: true,
        backupCodes: true
      }
    });

    console.log(`📊 Total users: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`User #${index + 1}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🆔 ID:               ${user.id}`);
      console.log(`👤 Name (encrypted): ${user.name.substring(0, 40)}...`);
      console.log(`✨ Name (decrypted): ${decrypt(user.name)}`);
      console.log(`📧 Email (encrypted):${user.email.substring(0, 40)}...`);
      console.log(`✨ Email (decrypted):${decrypt(user.email)}`);
      console.log(`🔒 2FA Enabled:      ${user.twoFactorEnabled}`);
      console.log(`📅 Created:          ${user.createdAt.toLocaleString()}`);
      console.log(`📅 Updated:          ${user.updatedAt.toLocaleString()}`);
      console.log(`🔑 Active Tokens:    ${user.refreshTokens.length}`);
      console.log(`🎫 Backup Codes:     ${user.backupCodes.length}`);
      console.log();
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

viewAllUsers();