-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_listId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_listId_fkey";

-- DropForeignKey
ALTER TABLE "ListMember" DROP CONSTRAINT "ListMember_listId_fkey";

-- DropForeignKey
ALTER TABLE "ListMember" DROP CONSTRAINT "ListMember_userId_fkey";

-- AddForeignKey
ALTER TABLE "ListMember" ADD CONSTRAINT "ListMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMember" ADD CONSTRAINT "ListMember_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
