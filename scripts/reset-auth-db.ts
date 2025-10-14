import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetAuth() {
  console.log('=== 清除現有的認證資料 ===\n')
  
  // 刪除所有 Sessions
  const deletedSessions = await prisma.session.deleteMany({})
  console.log(`✓ 刪除了 ${deletedSessions.count} 個 Session`)
  
  // 刪除所有 Accounts
  const deletedAccounts = await prisma.account.deleteMany({})
  console.log(`✓ 刪除了 ${deletedAccounts.count} 個 Account`)
  
  // 刪除所有 Users
  const deletedUsers = await prisma.user.deleteMany({})
  console.log(`✓ 刪除了 ${deletedUsers.count} 個 User`)
  
  console.log('\n✅ 清除完成！現在可以重新登入了')
  
  await prisma.$disconnect()
}

resetAuth().catch(console.error)
